import { describe, expect, it } from 'vitest';
import { INTERACTIVES, getInteractive, type InteractiveConfig } from './interactives';

const SECTION_TYPES = new Set(['story', 'discover', 'play', 'experiment', 'build', 'mission', 'reflect', 'project']);

describe('INTERACTIVES', () => {
  it('fournit au moins 12 configs phares', () => {
    expect(Object.keys(INTERACTIVES).length).toBeGreaterThanOrEqual(12);
  });

  it('utilise des clés au format « slug:section_type » valides', () => {
    for (const key of Object.keys(INTERACTIVES)) {
      const [slug, section] = key.split(':');
      expect(slug).toMatch(/^[\w-]+$/);
      expect(SECTION_TYPES.has(section)).toBe(true);
    }
  });

  it('getInteractive renvoie la config ou null', () => {
    const config = getInteractive('internet-discover', 'play');
    expect(config?.kind).toBe('reorder');
    expect(getInteractive('internet-discover', 'discover')).toBeNull();
    expect(getInteractive('aventure-inconnue', 'play')).toBeNull();
  });

  it('respecte les invariants de chaque moteur', () => {
    for (const [key, config] of Object.entries(INTERACTIVES)) {
      expect(key).toBeTruthy();
      assertConfig(config);
    }
  });

  it('ne référence que des sections actives des mondes prêts', () => {
    // sections réellement utilisées par le contenu : jamais story/reflect ici,
    // sinon le lecteur immersif serait court-circuité partout.
    const sections = new Set(Object.keys(INTERACTIVES).map((k) => k.split(':')[1]));
    const active = new Set(['play', 'experiment', 'build', 'project']);
    expect([...sections].every((s) => active.has(s))).toBe(true);
  });
});

function assertConfig(config: InteractiveConfig): void {
  switch (config.kind) {
    case 'quiz-tap':
      expect(config.statements.length).toBeGreaterThanOrEqual(2);
      for (const s of config.statements) {
        expect(s.text.length).toBeGreaterThan(5);
        expect(typeof s.answer).toBe('boolean');
        expect(s.why.length).toBeGreaterThan(5);
      }
      break;
    case 'drag-match':
      expect(config.pairs.length).toBeGreaterThanOrEqual(2);
      for (const p of config.pairs) {
        expect(p.left.length).toBeGreaterThan(1);
        expect(p.right.length).toBeGreaterThan(1);
      }
      break;
    case 'reorder':
      expect(config.items.length).toBeGreaterThanOrEqual(2);
      expect(new Set(config.items).size).toBe(config.items.length);
      break;
    case 'memory-pairs':
      expect(config.pairs.length).toBeGreaterThanOrEqual(2);
      break;
    case 'fill-blank': {
      const holes = [...config.text.matchAll(/\{(\d+)\}/g)].map((m) => Number(m[1]));
      expect(holes.length).toBeGreaterThanOrEqual(1);
      for (const n of holes) {
        const blank = config.blanks[n - 1];
        expect(blank, `trou {${n}} sans options`).toBeTruthy();
        expect(blank.options.length).toBeGreaterThanOrEqual(2);
        expect(blank.options).toContain(blank.answer);
      }
      break;
    }
    case 'hotspot': {
      const risky = config.items.filter((i) => i.risky);
      expect(risky.length).toBeGreaterThanOrEqual(1);
      for (const item of risky) expect(item.why?.length ?? 0).toBeGreaterThan(5);
      break;
    }
    case 'code-sandbox':
      expect(config.starter.length).toBeGreaterThan(50);
      expect(config.starter).toMatch(/^<!DOCTYPE html>/);
      expect(config.checklist.length).toBeGreaterThanOrEqual(2);
      break;
    case 'prompt-lab':
      expect(config.system.length).toBeGreaterThan(10);
      expect(config.starter.length).toBeGreaterThan(10);
      break;
    case 'chain-sim':
      expect(config.transactions.length).toBeGreaterThanOrEqual(2);
      break;
    case 'color-mixer':
      expect(config.palette.length).toBeGreaterThanOrEqual(2);
      expect(config.challenges.length).toBeGreaterThanOrEqual(1);
      for (const c of [...config.palette, ...config.challenges]) {
        expect(c.hex).toMatch(/^#[0-9a-f]{6}$/i);
      }
      break;
    case 'password-meter':
      expect(config.practices.length).toBeGreaterThanOrEqual(2);
      break;
  }
}
