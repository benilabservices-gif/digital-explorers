import { describe, expect, it } from 'vitest';
import {
  XP_PER_LEVEL,
  activePlanCode,
  checkPlanGating,
  computeNewBadges,
  dailyChallengeIndex,
  getLevelTitle,
  levelForXp,
  levelProgress,
  PLAN_LIMITS,
  weeklyChallengeIndex,
  weeklyStats,
  type BadgeLike,
} from './game';

// ---------------------------------------------------------------------------
// Niveaux / XP
// ---------------------------------------------------------------------------

describe('levelForXp', () => {
  it('commence au niveau 1', () => {
    expect(levelForXp(0)).toBe(1);
    expect(levelForXp(499)).toBe(1);
  });

  it('passe au niveau 2 à 500 XP', () => {
    expect(levelForXp(500)).toBe(2);
    expect(levelForXp(999)).toBe(2);
    expect(levelForXp(1000)).toBe(3);
  });

  it('ne descend jamais sous 1', () => {
    expect(levelForXp(-50)).toBe(1);
  });

  it('respecte XP_PER_LEVEL', () => {
    expect(levelForXp(XP_PER_LEVEL * 7)).toBe(8);
  });
});

describe('levelProgress', () => {
  it('calcule la progression dans le niveau courant', () => {
    expect(levelProgress(620)).toEqual({ level: 2, inLevelXp: 120, nextLevelAt: 1000 });
  });
});

describe('getLevelTitle', () => {
  it('attribue les titres par palier d\'XP', () => {
    expect(getLevelTitle(0)).toBe('Explorateur');
    expect(getLevelTitle(500)).toBe('Apprenti');
    expect(getLevelTitle(1000)).toBe('Créateur');
    expect(getLevelTitle(2000)).toBe('Maker');
    expect(getLevelTitle(4000)).toBe('Innovateur');
  });
});

// ---------------------------------------------------------------------------
// Badges
// ---------------------------------------------------------------------------

function badge(partial: Partial<BadgeLike> & { slug: string }): BadgeLike {
  return {
    name: partial.slug,
    description: '',
    icon: '🏆',
    rarity: 'common',
    xp_required: 0,
    world_id: null,
    required_completions: 0,
    ...partial,
  };
}

describe('computeNewBadges', () => {
  const allBadges = [
    badge({ slug: 'first-project' }), // première complétion
    badge({ slug: 'web-explorer', xp_required: 100, world_id: 'w-web' }),
    badge({ slug: 'web-master', xp_required: 500, world_id: 'w-web', required_completions: 12 }),
    badge({ slug: 'explorer-legend', xp_required: 2000 }),
  ];

  it('attribue le badge de première action à la première complétion', () => {
    const result = computeNewBadges({
      allBadges,
      currentBadgeSlugs: [],
      totalXp: 100,
      completionsPerWorld: { 'w-web': 1 },
      totalCompletions: 1,
    });
    expect(result.map((b) => b.slug)).toContain('first-project');
  });

  it('attribue un badge dès que le seuil d\'XP est atteint', () => {
    const result = computeNewBadges({
      allBadges,
      currentBadgeSlugs: ['first-project'],
      totalXp: 100,
      completionsPerWorld: {},
      totalCompletions: 1,
    });
    expect(result.map((b) => b.slug)).toEqual(['web-explorer']);
  });

  it('attribue le badge de monde à 12 complétions du monde', () => {
    const result = computeNewBadges({
      allBadges,
      currentBadgeSlugs: ['first-project', 'web-explorer'],
      totalXp: 600,
      completionsPerWorld: { 'w-web': 12 },
      totalCompletions: 12,
    });
    expect(result.map((b) => b.slug)).toContain('web-master');
  });

  it('n\'attribue pas le badge de monde à 11 complétions (XP sous le seuil)', () => {
    const result = computeNewBadges({
      allBadges,
      currentBadgeSlugs: ['first-project', 'web-explorer'],
      totalXp: 450,
      completionsPerWorld: { 'w-web': 11 },
      totalCompletions: 11,
    });
    expect(result.map((b) => b.slug)).not.toContain('web-master');
  });

  it('attribue le badge de monde par complétions même sous le seuil d\'XP', () => {
    const result = computeNewBadges({
      allBadges,
      currentBadgeSlugs: ['first-project', 'web-explorer'],
      totalXp: 480,
      completionsPerWorld: { 'w-web': 12 },
      totalCompletions: 12,
    });
    expect(result.map((b) => b.slug)).toContain('web-master');
  });

  it('ne réattribue jamais un badge possédé', () => {
    const result = computeNewBadges({
      allBadges,
      currentBadgeSlugs: ['first-project', 'web-explorer', 'web-master', 'explorer-legend'],
      totalXp: 3000,
      completionsPerWorld: { 'w-web': 12 },
      totalCompletions: 12,
    });
    expect(result).toEqual([]);
  });

  it('combine XP global et complétions de monde', () => {
    const result = computeNewBadges({
      allBadges,
      currentBadgeSlugs: ['first-project'],
      totalXp: 2000,
      completionsPerWorld: { 'w-web': 12 },
      totalCompletions: 12,
    });
    expect(result.map((b) => b.slug).sort()).toEqual([
      'explorer-legend',
      'web-explorer',
      'web-master',
    ]);
  });
});

// ---------------------------------------------------------------------------
// Gating des plans
// ---------------------------------------------------------------------------

describe('checkPlanGating', () => {
  it('autorise sous les limites Starter', () => {
    expect(
      checkPlanGating({
        limits: PLAN_LIMITS.starter,
        completedCount: 2,
        distinctWorldIds: new Set(['w1']),
        newWorldId: 'w1',
      })
    ).toEqual({ allowed: true });
  });

  it('refuse la 4e aventure en Starter (3 max)', () => {
    const result = checkPlanGating({
      limits: PLAN_LIMITS.starter,
      completedCount: 3,
      distinctWorldIds: new Set(['w1']),
      newWorldId: 'w1',
    });
    expect(result).toEqual({ allowed: false, reason: 'adventures_limit' });
  });

  it('refuse un 2e monde en Starter (1 monde max)', () => {
    const result = checkPlanGating({
      limits: PLAN_LIMITS.starter,
      completedCount: 1,
      distinctWorldIds: new Set(['w1']),
      newWorldId: 'w2',
    });
    expect(result).toEqual({ allowed: false, reason: 'worlds_limit' });
  });

  it('autorise plusieurs mondes en Explorateur', () => {
    expect(
      checkPlanGating({
        limits: PLAN_LIMITS.explorer,
        completedCount: 50,
        distinctWorldIds: new Set(['w1', 'w2', 'w3']),
        newWorldId: 'w4',
      })
    ).toEqual({ allowed: true });
  });
});

describe('activePlanCode', () => {
  it('retombe sur Starter sans abonnement', () => {
    expect(activePlanCode(null)).toBe('starter');
  });

  it('retombe sur Starter si abonnement expiré ou annulé', () => {
    expect(
      activePlanCode({ plan_code: 'pro', status: 'cancelled', expires_at: null })
    ).toBe('starter');
    expect(
      activePlanCode({
        plan_code: 'explorer',
        status: 'active',
        expires_at: new Date(Date.now() - 1000).toISOString(),
      })
    ).toBe('starter');
  });

  it('garde Explorateur/Pro si actif et non expiré', () => {
    expect(
      activePlanCode({ plan_code: 'explorer', status: 'active', expires_at: null })
    ).toBe('explorer');
    expect(
      activePlanCode({
        plan_code: 'pro',
        status: 'trial',
        expires_at: new Date(Date.now() + 60_000).toISOString(),
      })
    ).toBe('pro');
  });
});

// ---------------------------------------------------------------------------
// Rotation des défis
// ---------------------------------------------------------------------------

describe('dailyChallengeIndex', () => {
  it('est stable sur une même journée', () => {
    const matin = new Date('2026-09-25T06:12:00Z');
    const soir = new Date('2026-09-25T22:48:00Z');
    expect(dailyChallengeIndex(matin, 7)).toBe(dailyChallengeIndex(soir, 7));
  });

  it('change de jour en jour et reste dans le pool', () => {
    const j1 = new Date('2026-09-25T00:00:00Z');
    const j2 = new Date('2026-09-26T00:00:00Z');
    const pool = 7;
    expect(dailyChallengeIndex(j2, pool)).toBe((dailyChallengeIndex(j1, pool) + 1) % pool);
  });

  it('retourne -1 pour un pool vide', () => {
    expect(dailyChallengeIndex(new Date(), 0)).toBe(-1);
  });
});

describe('weeklyChallengeIndex', () => {
  it('reste dans le pool et avance par semaine', () => {
    const pool = 5;
    const s1 = new Date('2026-09-25T00:00:00Z');
    const s2 = new Date(s1.getTime() + 7 * 86_400_000);
    const i1 = weeklyChallengeIndex(s1, pool);
    const i2 = weeklyChallengeIndex(s2, pool);
    expect(i2).toBe((i1 + 1) % pool);
  });
});

describe('weeklyStats', () => {
  const now = new Date('2026-09-25T12:00:00Z');

  it('ne compte que les 7 derniers jours', () => {
    const completions = [
      { completedAt: '2026-09-24T10:00:00Z', xpReward: 100 }, // dans la fenêtre
      { completedAt: '2026-09-20T10:00:00Z', xpReward: 50 }, // dans la fenêtre
      { completedAt: '2026-09-10T10:00:00Z', xpReward: 500 }, // hors fenêtre
    ];
    const badges = [{ awardedAt: '2026-09-22T10:00:00Z' }, { awardedAt: '2026-09-01T10:00:00Z' }];
    expect(weeklyStats(completions, badges, now)).toEqual({ count: 2, xp: 150, badges: 1 });
  });
});
