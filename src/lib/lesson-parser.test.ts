import { describe, expect, it } from 'vitest';
import { parseLesson, splitMission, type LessonBlock } from './lesson-parser';

// ---------------------------------------------------------------------------
// parseLesson — structure de base
// ---------------------------------------------------------------------------

describe('parseLesson', () => {
  it('retourne un tableau vide pour un contenu vide', () => {
    expect(parseLesson('')).toEqual([]);
    expect(parseLesson('   \n  \n ')).toEqual([]);
  });

  it('produit un seul paragraphe pour une phrase courte', () => {
    expect(parseLesson('Bienvenue dans le monde du web.')).toEqual([
      { kind: 'paragraph', text: 'Bienvenue dans le monde du web.' },
    ]);
  });

  it('regroupe les phrases courtes en un seul chunk de paragraphe', () => {
    const raw = 'Internet est un réseau. Il relie des millions de machines. Ensemble, elles partagent des informations.';
    const blocks = parseLesson(raw);
    expect(blocks).toEqual([{ kind: 'paragraph', text: raw }]);
  });

  it('découpe les longues phrases en chunks ≤ maxChunkChars', () => {
    const phrases = Array.from({ length: 10 }, (_, i) => `Phrase numéro ${i} pour tester le découpage.`).join(' ');
    const blocks = parseLesson(phrases, { maxChunkChars: 100 });
    expect(blocks.length).toBeGreaterThan(1);
    for (const block of blocks) {
      expect(block.kind).toBe('paragraph');
      if (block.kind === 'paragraph') expect(block.text.length).toBeLessThanOrEqual(100);
    }
    // Aucune phrase perdue : la reconstitution redonne le texte intégral.
    expect(blocks.map((b) => (b.kind === 'paragraph' ? b.text : '')).join(' ')).toBe(phrases);
  });

  it('garde une phrase trop longue comme chunk unique', () => {
    const longSentence = 'Une phrase volontairement très longue qui dépasse seule la limite fixée pour ce test.';
    const blocks = parseLesson(`${longSentence} Suite brève.`, { maxChunkChars: 80 });
    expect(blocks).toEqual([
      { kind: 'paragraph', text: longSentence },
      { kind: 'paragraph', text: 'Suite brève.' },
    ]);
  });

  it('normalise les retours Windows \\r\\n', () => {
    const blocks = parseLesson('Ligne une.\r\n\r\nLigne deux.');
    expect(blocks).toEqual([
      { kind: 'paragraph', text: 'Ligne une.' },
      { kind: 'paragraph', text: 'Ligne deux.' },
    ]);
  });
});

// ---------------------------------------------------------------------------
// parseLesson — listes
// ---------------------------------------------------------------------------

describe('parseLesson : listes', () => {
  it('regroupe les lignes à puces en un bloc de liste non ordonnée', () => {
    const blocks = parseLesson('Trois étapes :\n- Allumer la machine\n- Ouvrir le navigateur\n- Chercher un site');
    expect(blocks).toEqual([
      { kind: 'paragraph', text: 'Trois étapes :' },
      { kind: 'list', ordered: false, items: ['Allumer la machine', 'Ouvrir le navigateur', 'Chercher un site'] },
    ]);
  });

  it('reconnaît les listes numérotées avec point', () => {
    const blocks = parseLesson('1. Première étape\n2. Deuxième étape');
    expect(blocks).toEqual([{ kind: 'list', ordered: true, items: ['Première étape', 'Deuxième étape'] }]);
  });

  it('reconnaît les listes numérotées avec parenthèse', () => {
    const blocks = parseLesson('1) Première étape\n2) Deuxième étape');
    expect(blocks).toEqual([{ kind: 'list', ordered: true, items: ['Première étape', 'Deuxième étape'] }]);
  });

  it('accepte les puces étoiles et les items sur plusieurs lignes', () => {
    const blocks = parseLesson('* Astérisque\n• Puce ronde');
    expect(blocks).toEqual([{ kind: 'list', ordered: false, items: ['Astérisque', 'Puce ronde'] }]);
  });
});

// ---------------------------------------------------------------------------
// parseLesson — blocs spéciaux (dialogue, astuce, définition)
// ---------------------------------------------------------------------------

describe('parseLesson : blocs spéciaux', () => {
  it('détecte un dialogue entre guillemets français', () => {
    const blocks = parseLesson('Le guide sourit puis dit : « Bienvenue, explorateur ! Prépare-toi. »');
    expect(blocks).toEqual([{ kind: 'dialogue', text: 'Le guide sourit puis dit : « Bienvenue, explorateur ! Prépare-toi. »' }]);
  });

  it('détecte un dialogue commençant par un tiret et le retire du texte', () => {
    const blocks = parseLesson('— Tu es prêt pour cette aventure ?');
    expect(blocks).toEqual([{ kind: 'dialogue', text: 'Tu es prêt pour cette aventure ?' }]);
  });

  it('détecte une astuce « Astuce de pro »', () => {
    const blocks = parseLesson('Astuce de pro : les props sont en lecture seule.');
    expect(blocks).toEqual([{ kind: 'tip', text: 'Astuce de pro : les props sont en lecture seule.' }]);
  });

  it('extrait une définition « appelée adresse IP » avec son terme', () => {
    const sentence = "Chaque machine connectée possède une étiquette appelée adresse IP, comme une adresse postale.";
    const blocks = parseLesson(sentence);
    expect(blocks).toEqual([{ kind: 'definition', term: 'adresse IP', text: sentence }]);
  });

  it('extrait une définition au pluriel « appelés oracles »', () => {
    const sentence = 'Ces services sont appelés oracles, car ils vont chercher la vérité dehors.';
    const blocks = parseLesson(sentence);
    expect(blocks).toEqual([{ kind: 'definition', term: 'oracles', text: sentence }]);
  });

  it('extrait une définition « on appelle le DOM » sans article', () => {
    const sentence = "On appelle le DOM la carte du document affiché par le navigateur.";
    const blocks = parseLesson(sentence);
    expect(blocks).toEqual([{ kind: 'definition', term: 'DOM', text: sentence }]);
  });

  it('ne transforme pas « on appelle quand… » en définition', () => {
    const sentence = 'On appelle quand un outil bloque au pire moment un incident de parcours.';
    expect(parseLesson(sentence)).toEqual([{ kind: 'paragraph', text: sentence }]);
  });

  it('préserve l’ordre paragraphe → astuce → paragraphe', () => {
    const blocks = parseLesson('Première phrase du récit. Astuce : pense à sauvegarder. Le récit reprend ici.');
    expect(blocks.map((b) => b.kind)).toEqual(['paragraph', 'tip', 'paragraph']);
    expect(blocks[1]).toEqual({ kind: 'tip', text: 'Astuce : pense à sauvegarder.' });
  });

  it('ne coupe pas une adresse IP au milieu', () => {
    const sentence = 'Ton ordinateur reçoit l’adresse 192.168.1.10 sur le réseau local.';
    const blocks = parseLesson(sentence);
    expect(blocks).toEqual([{ kind: 'paragraph', text: sentence }]);
  });
});

// ---------------------------------------------------------------------------
// splitMission
// ---------------------------------------------------------------------------

describe('splitMission', () => {
  it('retourne des listes vides sans blocs', () => {
    expect(splitMission([])).toEqual({ briefing: [], steps: [], support: [], closing: [] });
  });

  it('répartit briefing, étapes (listes aplaties), soutien et conclusion', () => {
    const blocks: LessonBlock[] = [
      { kind: 'paragraph', text: 'Mission : démonte ces affirmations.' },
      { kind: 'paragraph', text: 'Recueille les affirmations de ton entourage.' },
      { kind: 'list', ordered: true, items: ['Vérifie la première.', 'Vérifie la deuxième.'] },
      { kind: 'tip', text: 'Astuce : reste bienveillant.' },
      { kind: 'definition', term: 'oracle', text: 'Un service appelé oracle apporte la vérité.' },
      { kind: 'dialogue', text: '« Tu y es presque ! »' },
      { kind: 'paragraph', text: 'Tu viens de gagner en esprit critique.' },
    ];
    const split = splitMission(blocks);
    expect(split.briefing).toEqual([blocks[0]]);
    expect(split.steps).toEqual([
      'Recueille les affirmations de ton entourage.',
      'Vérifie la première.',
      'Vérifie la deuxième.',
    ]);
    expect(split.support).toEqual([blocks[3], blocks[4], blocks[5]]);
    expect(split.closing).toEqual([blocks[6]]);
  });

  it('place les paragraphes commençant par tu/vous dans la conclusion', () => {
    const blocks: LessonBlock[] = [
      { kind: 'paragraph', text: 'Mission : construis une page.' },
      { kind: 'paragraph', text: 'Ouvre ton éditeur de texte.' },
      { kind: 'paragraph', text: 'Tu viens de construire ta première page.' },
    ];
    const split = splitMission(blocks);
    expect(split.steps).toEqual(['Ouvre ton éditeur de texte.']);
    expect(split.closing.map((b) => (b.kind === 'paragraph' ? b.text : ''))).toEqual([
      'Tu viens de construire ta première page.',
    ]);
  });

  it('fonctionne de bout en bout sur du contenu de mission réel', () => {
    const raw = [
      'Mission de concepteur : rédige la spécification complète de ton contrat, sans code.',
      'Choisis un cas utile à ton quotidien, comme la cagnotte de la tontine.',
      'Décris les rôles de chacun.',
      'Tu es prêt à rejoindre une vraie équipe blockchain.',
    ].join(' ');
    const blocks = parseLesson(raw, { maxChunkChars: 120 });
    const split = splitMission(blocks);
    expect(split.briefing).toHaveLength(1);
    expect(split.steps.length).toBeGreaterThan(0);
    expect(split.closing.map((b) => (b.kind === 'paragraph' ? b.text : ''))).toEqual([
      'Tu es prêt à rejoindre une vraie équipe blockchain.',
    ]);
  });
});
