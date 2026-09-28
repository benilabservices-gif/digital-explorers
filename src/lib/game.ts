// Logique de jeu pure — partagée entre les routes API (serveur), les pages
// et les tests vitest. Aucune dépendance externe, aucun accès DB ici.

export const XP_PER_LEVEL = 500;

export function levelForXp(xp: number): number {
  return Math.max(1, Math.floor(xp / XP_PER_LEVEL) + 1);
}

export function levelProgress(xp: number): { level: number; inLevelXp: number; nextLevelAt: number } {
  const level = levelForXp(xp);
  const currentFloor = (level - 1) * XP_PER_LEVEL;
  return { level, inLevelXp: xp - currentFloor, nextLevelAt: currentFloor + XP_PER_LEVEL };
}

export function getLevelTitle(xp: number): string {
  if (xp >= 4000) return 'Innovateur';
  if (xp >= 2000) return 'Maker';
  if (xp >= 1000) return 'Créateur';
  if (xp >= 500) return 'Apprenti';
  return 'Explorateur';
}

// ---------------------------------------------------------------------------
// Badges
// ---------------------------------------------------------------------------

export interface BadgeLike {
  slug: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xp_required: number;
  world_id: string | null;
  required_completions: number;
}

export interface BadgeProgressInput {
  allBadges: BadgeLike[];
  currentBadgeSlugs: string[];
  totalXp: number;
  /** world_id -> nombre d'aventures terminées dans ce monde */
  completionsPerWorld: Record<string, number>;
  totalCompletions: number;
}

/**
 * Badges à attribuer :
 * - seuil d'XP atteint (xp_required > 0),
 * - OU seuil de complétions d'un monde atteint (required_completions > 0, ex. 12 aventures),
 * - OU badge « première action » (0/0) dès la première complétion.
 */
export function computeNewBadges(input: BadgeProgressInput): BadgeLike[] {
  const owned = new Set(input.currentBadgeSlugs);
  return input.allBadges.filter((badge) => {
    if (owned.has(badge.slug)) return false;
    const worldDone = badge.world_id ? (input.completionsPerWorld[badge.world_id] || 0) : 0;
    const xpMet = badge.xp_required > 0 && input.totalXp >= badge.xp_required;
    const worldMet = badge.required_completions > 0 && worldDone >= badge.required_completions;
    const firstDone = badge.xp_required === 0 && badge.required_completions === 0 && input.totalCompletions > 0;
    return xpMet || worldMet || firstDone;
  });
}

// ---------------------------------------------------------------------------
// Gating des plans (starter : 1 enfant, 1 monde, 3 aventures)
// ---------------------------------------------------------------------------

export type PlanCode = 'starter' | 'explorer' | 'pro';

export interface PlanLimits {
  code: PlanCode;
  maxChildren: number;
  maxWorlds: number;
  maxAdventures: number;
}

export const PLAN_LIMITS: Record<PlanCode, PlanLimits> = {
  starter: { code: 'starter', maxChildren: 1, maxWorlds: 1, maxAdventures: 3 },
  explorer: { code: 'explorer', maxChildren: 1, maxWorlds: 99, maxAdventures: Number.POSITIVE_INFINITY },
  pro: { code: 'pro', maxChildren: 3, maxWorlds: 99, maxAdventures: Number.POSITIVE_INFINITY },
};

export interface PlanCheckInput {
  limits: PlanLimits;
  /** nombre de complétions existantes, avant celle en cours */
  completedCount: number;
  /** identifiants des mondes déjà touchés par les complétions existantes */
  distinctWorldIds: Set<string>;
  /** monde de l'aventure que l'on veut compléter */
  newWorldId: string;
}

export type PlanCheckResult = { allowed: true } | { allowed: false; reason: 'adventures_limit' | 'worlds_limit' };

export function checkPlanGating(input: PlanCheckInput): PlanCheckResult {
  if (input.completedCount >= input.limits.maxAdventures) {
    return { allowed: false, reason: 'adventures_limit' };
  }
  const worlds = new Set(input.distinctWorldIds);
  worlds.add(input.newWorldId);
  if (worlds.size > input.limits.maxWorlds) {
    return { allowed: false, reason: 'worlds_limit' };
  }
  return { allowed: true };
}

/** Abonnement exploitable : statut actif/essai et pas encore expiré. */
export function activePlanCode(
  subscription: { plan_code: string; status: string; expires_at: string | null } | null
): PlanCode {
  if (!subscription) return 'starter';
  if (subscription.status !== 'active' && subscription.status !== 'trial') return 'starter';
  if (subscription.expires_at && new Date(subscription.expires_at).getTime() <= Date.now()) return 'starter';
  if (subscription.plan_code === 'explorer' || subscription.plan_code === 'pro') return subscription.plan_code;
  return 'starter';
}

// ---------------------------------------------------------------------------
// Rotation des défis (déterministe par date)
// ---------------------------------------------------------------------------

/** Indice du défi quotidien : stable pour une journée donnée, indépendant de l'heure. */
export function dailyChallengeIndex(date: Date, poolSize: number): number {
  if (poolSize <= 0) return -1;
  const days = Math.floor(date.getTime() / 86_400_000);
  return days % poolSize;
}

/** Indice de la quête hebdomadaire : rotation par semaine complète. */
export function weeklyChallengeIndex(date: Date, poolSize: number): number {
  if (poolSize <= 0) return -1;
  const weeks = Math.floor(date.getTime() / (7 * 86_400_000));
  return weeks % poolSize;
}

/** Complétions de l'enfant sur les 7 derniers jours (rapport hebdo parent). */
export function weeklyStats(
  completions: { completedAt: string; xpReward: number }[],
  badges: { awardedAt: string }[],
  now: Date = new Date()
): { count: number; xp: number; badges: number } {
  const cutoff = now.getTime() - 7 * 86_400_000;
  const inWindow = completions.filter((c) => new Date(c.completedAt).getTime() >= cutoff);
  return {
    count: inWindow.length,
    xp: inWindow.reduce((sum, c) => sum + c.xpReward, 0),
    badges: badges.filter((b) => new Date(b.awardedAt).getTime() >= cutoff).length,
  };
}
