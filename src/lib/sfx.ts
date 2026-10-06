// Sons synthétisés en Web Audio — zéro fichier audio, tout est généré.
// Toggle mute persistant (localStorage) + vibration mobile gardée ici pour
// centraliser le « game-feel » côté client.

export type SfxName = 'tick' | 'correct' | 'wrong' | 'win' | 'fanfare' | 'levelup';

const MUTE_STORAGE_KEY = 'de:sfx-muted';

export function isSfxMuted(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(MUTE_STORAGE_KEY) === '1';
  } catch {
    return false; // navigation privée : on laisse le son plutôt que de bloquer
  }
}

export function setSfxMuted(muted: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(MUTE_STORAGE_KEY, muted ? '1' : '0');
  } catch {
    /* stockage indisponible : sans effet, on ne bloque pas le jeu */
  }
}

/** Vibration courte sur les réussites (no-op hors mobile). */
export function vibrate(pattern: number | number[]): void {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
  try {
    navigator.vibrate(pattern);
  } catch {
    /* certains navigateurs jettent si le geste a expiré */
  }
}

let audioContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!audioContext) audioContext = new Ctor();
  // Chrome/Safari suspendent le contexte jusqu'à un geste utilisateur.
  if (audioContext.state === 'suspended') void audioContext.resume();
  return audioContext;
}

/** Une note : oscillateur + enveloppe exponentielle (attaque/release douces). */
function tone(
  ctx: AudioContext,
  frequency: number,
  startOffset: number,
  duration: number,
  volume = 0.14,
  type: OscillatorType = 'sine',
): void {
  const start = ctx.currentTime + startOffset;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.05);
}

/** Joue un son court. Sans effet côté serveur, muet, ou navigateur sans Web Audio. */
export function playSfx(name: SfxName): void {
  if (typeof window === 'undefined' || isSfxMuted()) return;
  const ctx = getContext();
  if (!ctx) return;

  switch (name) {
    case 'tick': // micro-clic d'interface
      tone(ctx, 880, 0, 0.05, 0.07, 'square');
      break;
    case 'correct': // petit « ding » deux notes
      tone(ctx, 659, 0, 0.08);
      tone(ctx, 988, 0.08, 0.12);
      break;
    case 'wrong': // buzz grave bref
      tone(ctx, 220, 0, 0.14, 0.1, 'sawtooth');
      break;
    case 'win': // mini-arpège de victoire
      [523, 659, 784].forEach((f, i) => tone(ctx, f, i * 0.09, 0.13));
      break;
    case 'fanfare': // fin d'aventure : arpège + note tenue
      [523, 659, 784, 1047].forEach((f, i) => tone(ctx, f, i * 0.1, 0.16, 0.15));
      tone(ctx, 1319, 0.4, 0.4, 0.15);
      break;
    case 'levelup': // montée en tierces, aérée
      [392, 494, 587, 784, 988].forEach((f, i) => tone(ctx, f, i * 0.08, 0.18, 0.12, 'triangle'));
      break;
  }
}
