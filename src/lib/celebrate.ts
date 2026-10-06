// Célébrations : confettis (canvas-confetti, ~7 Ko) + son + vibration,
// regroupés par intensité d'événement. Respecte prefers-reduced-motion
// (pas de confettis ni vibration) et le mute (pas de son).

import confetti from 'canvas-confetti';
import { playSfx, vibrate } from './sfx';

export type CelebrationKind = 'win' | 'adventure' | 'levelup' | 'badge';

const COLORS = ['#fbbf24', '#34d399', '#8b5cf6', '#ec4899', '#60a5fa'];

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Mini-jeu gagné : salve modérée depuis le centre. */
function winBurst(): void {
  confetti({
    particleCount: 90,
    spread: 75,
    startVelocity: 38,
    origin: { y: 0.6 },
    colors: COLORS,
    disableForReducedMotion: true,
  });
}

/** Aventure terminée : double canon latéral. */
function adventureFanfare(): void {
  const options = {
    particleCount: 70,
    angle: 60,
    spread: 60,
    startVelocity: 55,
    colors: COLORS,
    disableForReducedMotion: true,
  } as const;
  confetti({ ...options, origin: { x: 0, y: 0.7 } });
  confetti({ ...options, angle: 120, origin: { x: 1, y: 0.7 } });
}

/** Passage de niveau : gerbe centrale généreuse. */
function levelUpBurst(): void {
  confetti({
    particleCount: 160,
    spread: 100,
    startVelocity: 45,
    scalar: 1.1,
    origin: { y: 0.5 },
    colors: ['#fbbf24', '#fde68a', '#f97316'],
    disableForReducedMotion: true,
  });
}

/** Badge débloqué : petite salve discrète. */
function badgeBurst(): void {
  confetti({
    particleCount: 35,
    spread: 45,
    startVelocity: 28,
    scalar: 0.8,
    origin: { y: 0.4 },
    colors: COLORS,
    disableForReducedMotion: true,
  });
}

/** Le moment de gloire, en une ligne côté composant. */
export function celebrate(kind: CelebrationKind): void {
  if (typeof window === 'undefined') return;
  const reduced = prefersReducedMotion();

  switch (kind) {
    case 'win':
      if (!reduced) winBurst();
      playSfx('win');
      if (!reduced) vibrate(35);
      break;
    case 'adventure':
      if (!reduced) adventureFanfare();
      playSfx('fanfare');
      if (!reduced) vibrate([40, 60, 40]);
      break;
    case 'levelup':
      if (!reduced) levelUpBurst();
      playSfx('levelup');
      if (!reduced) vibrate([50, 50, 50, 50, 140]);
      break;
    case 'badge':
      if (!reduced) badgeBurst();
      playSfx('tick');
      break;
  }
}
