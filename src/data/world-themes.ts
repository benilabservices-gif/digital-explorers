import type { WorldSlug } from './content';
import { GUIDES_BY_ID, type GuideId } from './characters';

// ---------------------------------------------------------------------------
// Identité visuelle par monde — injectée via WorldThemeProvider (variables
// CSS) et WorldBackdrop (canvas animé). Chaque monde possède sa couleur
// d'accent, ses halos de fond, son style de particules et son guide, dérivé
// de la source unique des personnages (src/data/characters.ts).
//
// Recalibrage DA « Carnet de l'Explorateur » : l'or (#gold) est réservé aux
// récompenses — le monde blockchain passe au orange Bitcoin ; les autres
// accents pédagogiques sont conservés (posés sur la nuit d'obsidienne).
// ---------------------------------------------------------------------------

export type ParticleStyle = 'network' | 'neural' | 'coderain' | 'chain' | 'paint' | 'radar' | 'orbit';

export interface WorldGuide {
  emoji: string;
  name: string;
  /** rôle du guide dans CE monde (l'identité cœur vit dans characters.ts) */
  trait: string;
}

/** Construit le guide d'un monde depuis la source unique des personnages. */
function guideOf(id: GuideId, role: string): WorldGuide {
  const g = GUIDES_BY_ID[id];
  return { emoji: g.emoji, name: g.name, trait: role };
}

export interface WorldTheme {
  /** couleur d'accent principale (hex) */
  accent: string;
  /** composantes RGB « r,g,b » pour construire des rgba() en canvas */
  accentRgb: string;
  /** fond translucide basé sur l'accent (badges, encadrés) */
  accentSoft: string;
  /** halo/ombre basée sur l'accent */
  glow: string;
  /** halos de fond CSS (dégradés radiaux) */
  bgGlow: string;
  /** style de particules du fond animé */
  particles: ParticleStyle;
  /** guide personnage du monde */
  guide: WorldGuide;
}

export const WORLD_THEMES: Record<WorldSlug, WorldTheme> = {
  'web-digital': {
    accent: '#38bdf8',
    accentRgb: '56,189,248',
    accentSoft: 'rgba(56,189,248,0.12)',
    glow: 'rgba(56,189,248,0.35)',
    bgGlow:
      'radial-gradient(ellipse at 18% 0%, rgba(59,130,246,0.16), transparent 55%), radial-gradient(ellipse at 85% 100%, rgba(34,211,238,0.12), transparent 55%)',
    particles: 'network',
    guide: guideOf('sami', 'Surfeur du Web'),
  },
  'artificial-intelligence': {
    accent: '#a78bfa',
    accentRgb: '167,139,250',
    accentSoft: 'rgba(167,139,250,0.12)',
    glow: 'rgba(167,139,250,0.35)',
    bgGlow:
      'radial-gradient(ellipse at 18% 0%, rgba(139,92,246,0.18), transparent 55%), radial-gradient(ellipse at 85% 100%, rgba(96,165,250,0.12), transparent 55%)',
    particles: 'neural',
    guide: guideOf('yann', 'Scientifique des données'),
  },
  coding: {
    accent: '#34d399',
    accentRgb: '52,211,153',
    accentSoft: 'rgba(52,211,153,0.12)',
    glow: 'rgba(52,211,153,0.35)',
    bgGlow:
      'radial-gradient(ellipse at 18% 0%, rgba(16,185,129,0.16), transparent 55%), radial-gradient(ellipse at 85% 100%, rgba(45,212,191,0.12), transparent 55%)',
    particles: 'coderain',
    guide: guideOf('koffi', 'Codeur en herbe'),
  },
  blockchain: {
    accent: '#f7931a',
    accentRgb: '247,147,26',
    accentSoft: 'rgba(247,147,26,0.12)',
    glow: 'rgba(247,147,26,0.35)',
    bgGlow:
      'radial-gradient(ellipse at 18% 0%, rgba(247,147,26,0.16), transparent 55%), radial-gradient(ellipse at 85% 100%, rgba(234,88,12,0.12), transparent 55%)',
    particles: 'chain',
    guide: guideOf('nadia', 'Exploratrice Web3'),
  },
  'digital-creator': {
    accent: '#f472b6',
    accentRgb: '244,114,182',
    accentSoft: 'rgba(244,114,182,0.12)',
    glow: 'rgba(244,114,182,0.35)',
    bgGlow:
      'radial-gradient(ellipse at 18% 0%, rgba(236,72,153,0.16), transparent 55%), radial-gradient(ellipse at 85% 100%, rgba(251,113,133,0.12), transparent 55%)',
    particles: 'paint',
    guide: guideOf('awa', 'Directrice artistique'),
  },
  'cyber-hero': {
    accent: '#f87171',
    accentRgb: '248,113,113',
    accentSoft: 'rgba(248,113,113,0.12)',
    glow: 'rgba(248,113,113,0.35)',
    bgGlow:
      'radial-gradient(ellipse at 18% 0%, rgba(239,68,68,0.16), transparent 55%), radial-gradient(ellipse at 85% 100%, rgba(244,63,94,0.12), transparent 55%)',
    particles: 'radar',
    guide: guideOf('sami', 'Gardien du Net'),
  },
  'innovation-entrepreneurship': {
    accent: '#22d3ee',
    accentRgb: '34,211,238',
    accentSoft: 'rgba(34,211,238,0.12)',
    glow: 'rgba(34,211,238,0.35)',
    bgGlow:
      'radial-gradient(ellipse at 18% 0%, rgba(6,182,212,0.16), transparent 55%), radial-gradient(ellipse at 85% 100%, rgba(59,130,246,0.12), transparent 55%)',
    particles: 'orbit',
    guide: guideOf('nadia', 'Entrepreneure'),
  },
};

/** Thème d'un monde (repli : web-digital si slug inconnu). */
export function getWorldTheme(slug: string): WorldTheme {
  return WORLD_THEMES[slug as WorldSlug] ?? WORLD_THEMES['web-digital'];
}
