// Requêtes de contenu (mondes, aventures, badges, ponts, défis, plans).
// Le contenu est lisible par anon (RLS) — utilisable côté client ou serveur.

import type { SupabaseClient } from '@supabase/supabase-js';
import { isWorldReady } from '@/data/content';
import { activePlanCode, PLAN_LIMITS, type BadgeLike, type PlanCode, type PlanLimits } from './game';

export interface AdventureSummary {
  id: string;
  worldId: string;
  slug: string;
  title: string;
  description: string;
  xpReward: number;
}

export interface WorldWithAdventures {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  gradient: string;
  phase: string;
  adventures: AdventureSummary[];
}

interface WorldRow {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  gradient: string;
  phase: string;
}

interface AdventureRow {
  id: string;
  world_id: string;
  slug: string;
  title: string;
  description: string;
  xp_reward: number;
}

export async function fetchWorldsWithAdventures(supabase: SupabaseClient): Promise<WorldWithAdventures[]> {
  const [{ data: worlds }, { data: adventures }] = await Promise.all([
    supabase
      .from('worlds')
      .select('id,slug,name,icon,description,gradient,phase,sort_order')
      .eq('is_active', true)
      .order('sort_order'),
    supabase
      .from('adventures')
      .select('id,world_id,slug,title,description,xp_reward,sort_order')
      .eq('is_published', true)
      .order('sort_order'),
  ]);

  const advs = (adventures ?? []) as unknown as AdventureRow[];
  return ((worlds ?? []) as unknown as WorldRow[]).map((w) => ({
    id: w.id,
    slug: w.slug,
    name: w.name,
    icon: w.icon,
    description: w.description,
    gradient: w.gradient,
    phase: w.phase,
    adventures: advs
      .filter((a) => a.world_id === w.id)
      .map((a) => ({
        id: a.id,
        worldId: a.world_id,
        slug: a.slug,
        title: a.title,
        description: a.description,
        xpReward: a.xp_reward,
      })),
  }));
}

export async function fetchBadges(supabase: SupabaseClient): Promise<BadgeLike[]> {
  const { data } = await supabase
    .from('badges')
    .select('slug,name,description,icon,rarity,xp_required,world_id,required_completions,sort_order')
    .order('sort_order');
  return (data ?? []) as BadgeLike[];
}

export interface BridgeInfo {
  id: string;
  name: string;
  description: string;
  targetUrl: string;
  icon: string;
  color: string;
}

export async function fetchDigitalBridges(supabase: SupabaseClient): Promise<BridgeInfo[]> {
  const { data } = await supabase
    .from('digital_bridges')
    .select('id,name,description,target_url,icon,color,sort_order')
    .eq('is_active', true)
    .order('sort_order');
  return (data ?? []).map((b) => ({
    id: b.id,
    name: b.name,
    description: b.description,
    targetUrl: b.target_url,
    icon: b.icon,
    color: b.color,
  }));
}

export interface ChallengeInfo {
  id: string;
  type: 'daily' | 'weekly';
  slug: string;
  title: string;
  description: string;
  worldSlug: string | null;
  xpReward: number;
  badgeSlug: string | null;
}

export async function fetchChallenges(supabase: SupabaseClient): Promise<ChallengeInfo[]> {
  const { data } = await supabase
    .from('challenges')
    .select('id,type,slug,title,description,world_slug,xp_reward,badge_slug')
    .eq('is_active', true)
    .order('slug');
  return (data ?? []).map((c) => ({
    id: c.id,
    type: c.type,
    slug: c.slug,
    title: c.title,
    description: c.description,
    worldSlug: c.world_slug,
    xpReward: c.xp_reward,
    badgeSlug: c.badge_slug,
  }))
    // MVP : écarter les défis qui pointent vers un monde pas encore publié.
    .filter((c) => !c.worldSlug || isWorldReady(c.worldSlug));
}

export interface PlanInfo {
  code: PlanCode;
  name: string;
  status: string;
  priceFcfa: number;
  period: string;
  expiresAt: string | null;
  limits: PlanLimits;
}

/** Plan courant du parent : abonnement valide le plus récent, sinon Starter. */
export async function fetchCurrentPlan(
  supabase: SupabaseClient,
  parentId: string
): Promise<PlanInfo> {
  const [{ data: subscription }, { data: plans }] = await Promise.all([
    supabase
      .from('subscriptions')
      .select('plan_code,status,expires_at,started_at')
      .eq('parent_id', parentId)
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase.from('plans').select('code,name,price_fcfa,period'),
  ]);

  const code = activePlanCode(subscription);
  const plan = (plans ?? []).find((p) => p.code === code);

  return {
    code,
    name: plan?.name ?? 'Starter',
    status: subscription?.status ?? 'trial',
    priceFcfa: plan?.price_fcfa ?? 0,
    period: plan?.period ?? '7 jours',
    expiresAt: subscription?.expires_at ?? null,
    limits: PLAN_LIMITS[code],
  };
}
