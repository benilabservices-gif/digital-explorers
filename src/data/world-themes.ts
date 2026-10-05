import type { WorldSlug } from './content';

// ---------------------------------------------------------------------------
// Identité visuelle par monde — injectée via WorldThemeProvider (variables
// CSS) et WorldBackdrop (canvas animé). Chaque monde possède sa couleur
// d'accent, ses halos de fond, son style de particules et son guide, issu de
// la team présentée sur la home (Awa, Koffi, Sami, Nadia, Yann).
// ---------------------------------------------------------------------------

export type ParticleStyle = 'network' | 'neural' | 'coderain' | 'chain' | 'paint' | 'radar' | 'orbit';

export interface WorldGuide {
  emoji: string;
  name: string;
  trait: string;
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
    guide: { emoji: '👦🏿', name: 'Sami', trait: 'Surfeur du Web' },
  },
  'artificial-intelligence': {
    accent: '#a78bfa',
    accentRgb: '167,139,250',
    accentSoft: 'rgba(167,139,250,0.12)',
    glow: 'rgba(167,139,250,0.35)',
    bgGlow:
      'radial-gradient(ellipse at 18% 0%, rgba(139,92,246,0.18), transparent 55%), radial-gradient(ellipse at 85% 100%, rgba(96,165,250,0.12), transparent 55%)',
    particles: 'neural',
    guide: { emoji: '👦🏽', name: 'Yann', trait: 'Scientifique' },
  },
  coding: {
    accent: '#34d399',
    accentRgb: '52,211,153',
    accentSoft: 'rgba(52,211,153,0.12)',
    glow: 'rgba(52,211,153,0.35)',
    bgGlow:
      'radial-gradient(ellipse at 18% 0%, rgba(16,185,129,0.16), transparent 55%), radial-gradient(ellipse at 85% 100%, rgba(45,212,191,0.12), transparent 55%)',
    particles: 'coderain',
    guide: { emoji: '👦🏾', name: 'Koffi', trait: 'Codeur en herbe' },
  },
  blockchain: {
    accent: '#fbbf24',
    accentRgb: '251,191,36',
    accentSoft: 'rgba(251,191,36,0.12)',
    glow: 'rgba(251,191,36,0.35)',
    bgGlow:
      'radial-gradient(ellipse at 18% 0%, rgba(245,158,11,0.16), transparent 55%), radial-gradient(ellipse at 85% 100%, rgba(249,115,22,0.12), transparent 55%)',
    particles: 'chain',
    guide: { emoji: '👩🏿', name: 'Nadia', trait: 'Exploratrice Web3' },
  },
  'digital-creator': {
    accent: '#f472b6',
    accentRgb: '244,114,182',
    accentSoft: 'rgba(244,114,182,0.12)',
    glow: 'rgba(244,114,182,0.35)',
    bgGlow:
      'radial-gradient(ellipse at 18% 0%, rgba(236,72,153,0.16), transparent 55%), radial-gradient(ellipse at 85% 100%, rgba(251,113,133,0.12), transparent 55%)',
    particles: 'paint',
    guide: { emoji: '👩🏾', name: 'Awa', trait: 'Créative' },
  },
  'cyber-hero': {
    accent: '#f87171',
    accentRgb: '248,113,113',
    accentSoft: 'rgba(248,113,113,0.12)',
    glow: 'rgba(248,113,113,0.35)',
    bgGlow:
      'radial-gradient(ellipse at 18% 0%, rgba(239,68,68,0.16), transparent 55%), radial-gradient(ellipse at 85% 100%, rgba(244,63,94,0.12), transparent 55%)',
    particles: 'radar',
    guide: { emoji: '👦🏿', name: 'Sami', trait: 'Gardien du Net' },
  },
  'innovation-entrepreneurship': {
    accent: '#22d3ee',
    accentRgb: '34,211,238',
    accentSoft: 'rgba(34,211,238,0.12)',
    glow: 'rgba(34,211,238,0.35)',
    bgGlow:
      'radial-gradient(ellipse at 18% 0%, rgba(6,182,212,0.16), transparent 55%), radial-gradient(ellipse at 85% 100%, rgba(59,130,246,0.12), transparent 55%)',
    particles: 'orbit',
    guide: { emoji: '👩🏿', name: 'Nadia', trait: 'Entrepreneure' },
  },
};

/** Thème d'un monde (repli : web-digital si slug inconnu). */
export function getWorldTheme(slug: string): WorldTheme {
  return WORLD_THEMES[slug as WorldSlug] ?? WORLD_THEMES['web-digital'];
}
