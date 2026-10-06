// ---------------------------------------------------------------------------
// Parseur de leçons (Phase 2 — lecteur immersif).
//
// Le contenu des leçons en base est du texte brut francophone : de la prose
// continue (paragraphes séparés par des lignes vides), quelques listes rares,
// des « Astuce de pro : … » et des tournures « appelé/appelée X » ou
// « on appelle X » qui signalent une définition. Ce module transforme ce
// texte en blocs typés que LessonScene / MissionCard affichent scène par
// scène, sans toucher au contenu en base.
//
// Heuristiques volontairement conservatrices : en cas de doute, une phrase
// reste un simple paragraphe.
// ---------------------------------------------------------------------------

export type LessonBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; ordered: boolean; items: string[] }
  | { kind: 'dialogue'; text: string }
  | { kind: 'tip'; text: string }
  | { kind: 'definition'; term: string; text: string };

export interface MissionSplit {
  /** bloc d'introduction de la mission (premier bloc) */
  briefing: LessonBlock[];
  /** étapes actionnables (paragraphes instructions + items de listes aplatis) */
  steps: string[];
  /** blocs de soutien : astuces, définitions, dialogues */
  support: LessonBlock[];
  /** blocs de conclusion narrative (« Tu viens de… ») */
  closing: LessonBlock[];
}

export interface LessonParseOptions {
  /** taille maximale d'un chunk de paragraphe (caractères), défaut 320 */
  maxChunkChars?: number;
}

const DEFAULT_MAX_CHUNK_CHARS = 320;

/** Ligne de liste : « - item », « * item », « • item », « 1. item », « 1) item ». */
const LIST_LINE_RE = /^\s*(?:[-*•]\s+|\d+[.)]\s+)/;
const ORDERED_LINE_RE = /^\s*\d+[.)]\s+/;
/** Astuce : « Astuce de pro : … » */
const TIP_RE = /\bastuce\b/i;
/** Paroles rapportées entre guillemets français. */
const DIALOGUE_QUOTE_RE = /«[^»]+»/;
/** Tiret de dialogue en tête de phrase. */
const DIALOGUE_DASH_RE = /^[—–]\s+/;
/** « appelé/appelée/appelés/appelées suivi du terme » */
const DEF_CALLED_RE = /\bappelé(?:e?s?)?\s+([^,;:.!?…«»"]+)/;
/** « on appelle X » / « appellent X » (insensible à la casse : « On appelle… ») */
const DEF_ON_APPELLE_RE = /\b(?:on\s+appelle|appellent)\s+([^,;:.!?…«»"]+)/i;
/** Mots qui ne peuvent jamais commencer un terme (≠ une définition). */
const NOT_A_TERM_RE = /^(quand|par|comment|pourquoi|pour|avec|dans|sur|alors|puis|ensuite|si|comme|ça|cela|que|qui|où|est|a|à|un peu)$/;
/** Articles/démonstratifs à retirer devant un terme. */
const ARTICLE_RE = /^(le|la|les|un|une|du|des|ce|cet|cette|l’|l'|d’|d')$/i;
/** Articles qui introduisent plutôt une apposition (« on appelle le DOM la
 *  carte du document » → le terme est « DOM », pas « DOM la carte du »).
 *  « du/des » restent admis dans un terme composé (« cahier des charges »). */
const APPOSITION_RE = /^(un|une|le|la|les)$/i;
const ARTICLE_PREFIX_RE = /^(?:l’|l'|d’|d')(\S.*)$/i;

/** Découpe en phrases : coupe après un token terminé par une ponctuation
 *  forte (éventuellement suivie d'un guillemet fermant), sauf à l'intérieur
 *  de guillemets français « … » (une citation reste une seule phrase).
 *  Contrairement à un simple split sur les points, « 192.168.1.10 » reste
 *  intact : pas d'espace après les points. */
function splitSentences(text: string): string[] {
  const tokens = text.split(/\s+/).filter((t) => t.length > 0);
  const sentences: string[] = [];
  let current = '';
  let inQuote = false;
  for (const token of tokens) {
    current = current ? `${current} ${token}` : token;
    if (token.includes('«')) inQuote = true;
    if (token.includes('»')) inQuote = false;
    if (/[.!?…][»"]?$/.test(token) && !inQuote) {
      sentences.push(current);
      current = '';
    }
  }
  if (current) sentences.push(current);
  return sentences;
}

/** Extrait le terme défini d'une tournure « appelé X » / « on appelle X ».
 *  Retourne null si la capture ne ressemble pas à un terme. */
function extractTerm(sentence: string): string | null {
  const called = DEF_CALLED_RE.exec(sentence);
  const onAppelle = DEF_ON_APPELLE_RE.exec(sentence);
  const captured = onAppelle ?? called;
  if (!captured) return null;

  let words = captured[1].trim().split(/\s+/).filter((w) => w.length > 0);
  if (words.length === 0) return null;

  // Retire jusqu'à deux articles/démonstratifs en tête (« les agents
  // autonomes » → « agents autonomes »), sans jamais vider le terme.
  for (let i = 0; i < 2; i++) {
    if (words.length <= 1) break;
    const first = words[0];
    if (ARTICLE_RE.test(first)) {
      words = words.slice(1);
      continue;
    }
    const elided = ARTICLE_PREFIX_RE.exec(first);
    if (elided) {
      words = [elided[1], ...words.slice(1)];
      continue;
    }
    break;
  }

  if (NOT_A_TERM_RE.test(words[0].toLowerCase())) return null;

  // Coupe à la première apposition : « le DOM la carte du document » → « DOM ».
  for (let j = 1; j < words.length; j++) {
    if (APPOSITION_RE.test(words[j])) {
      words = words.slice(0, j);
      break;
    }
  }

  // Terme limité à 4 mots, ponctuation traînante retirée.
  const term = words.slice(0, 4).join(' ').replace(/[,:;»"]+$/, '').trim();
  if (term.length < 2) return null;
  return term;
}

/** Transforme une unité de prose (lignes sans saut de ligne vide) en blocs :
 *  les phrases spéciales (dialogue, astuce, définition) interrompent le
 *  chunk en cours, les autres s'accumulent en paragraphes ≤ maxChunkChars. */
function proseUnitToBlocks(unit: string, out: LessonBlock[], maxChunk: number): void {
  let chunk: string[] = [];
  let chunkLen = 0;

  const flush = () => {
    if (chunk.length > 0) {
      out.push({ kind: 'paragraph', text: chunk.join(' ') });
      chunk = [];
      chunkLen = 0;
    }
  };

  for (const sentence of splitSentences(unit)) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;

    if (DIALOGUE_DASH_RE.test(trimmed)) {
      flush();
      out.push({ kind: 'dialogue', text: trimmed.replace(DIALOGUE_DASH_RE, '') });
      continue;
    }
    if (DIALOGUE_QUOTE_RE.test(trimmed)) {
      flush();
      out.push({ kind: 'dialogue', text: trimmed });
      continue;
    }
    if (TIP_RE.test(trimmed)) {
      flush();
      out.push({ kind: 'tip', text: trimmed });
      continue;
    }
    const term = extractTerm(trimmed);
    if (term) {
      flush();
      out.push({ kind: 'definition', term, text: trimmed });
      continue;
    }

    // Phrase ordinaire : complète le chunk courant si elle tient, sinon
    // ferme le chunk et en ouvre un nouveau (une phrase trop longue reste
    // un chunk à elle seule).
    if (chunkLen > 0 && chunkLen + 1 + trimmed.length > maxChunk) {
      flush();
    }
    chunk.push(trimmed);
    chunkLen = chunk.join(' ').length;
  }
  flush();
}

/** Parse le contenu brut d'une leçon en blocs typés, prêts à être révélés
 *  scène par scène. L'ordre du texte est toujours préservé. */
export function parseLesson(raw: string, options?: LessonParseOptions): LessonBlock[] {
  const maxChunk = Math.max(40, options?.maxChunkChars ?? DEFAULT_MAX_CHUNK_CHARS);
  const text = (raw ?? '').replace(/\r\n/g, '\n').trim();
  if (!text) return [];

  const out: LessonBlock[] = [];
  let proseLines: string[] = [];
  let listItems: string[] = [];
  let listOrdered = false;

  const flushProse = () => {
    if (proseLines.length > 0) {
      proseUnitToBlocks(proseLines.join(' '), out, maxChunk);
      proseLines = [];
    }
  };
  const flushList = () => {
    if (listItems.length > 0) {
      out.push({ kind: 'list', ordered: listOrdered, items: listItems });
      listItems = [];
      listOrdered = false;
    }
  };

  for (const line of text.split('\n')) {
    if (LIST_LINE_RE.test(line)) {
      flushProse();
      if (listItems.length === 0) listOrdered = ORDERED_LINE_RE.test(line);
      const item = line.replace(LIST_LINE_RE, '').trim();
      if (item) listItems.push(item);
    } else if (line.trim() === '') {
      flushProse();
      flushList();
    } else {
      flushList();
      proseLines.push(line.trim());
    }
  }
  flushProse();
  flushList();
  return out;
}

/** Blocs de mission : le premier bloc sert de briefing, les paragraphes et
 *  listes deviennent des étapes actionnables, les blocs « tu/ton/vous… »
 *  une conclusion narrative, et les astuces/définitions du soutien. */
export function splitMission(blocks: LessonBlock[]): MissionSplit {
  const split: MissionSplit = { briefing: [], steps: [], support: [], closing: [] };
  if (blocks.length === 0) return split;

  split.briefing = [blocks[0]];
  const CLOSING_RE = /^(tu|ta|ton|tes|vous|et toi)\b/i;

  for (const block of blocks.slice(1)) {
    switch (block.kind) {
      case 'list':
        for (const item of block.items) split.steps.push(item);
        break;
      case 'paragraph':
        if (CLOSING_RE.test(block.text)) split.closing.push(block);
        else split.steps.push(block.text);
        break;
      default:
        split.support.push(block);
        break;
    }
  }
  return split;
}
