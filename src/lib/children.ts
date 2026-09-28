// Couche d'accès aux données enfants (Supabase). Remplace les lectures
// localStorage de la démo : les profils, complétions et badges vivent en base,
// protégés par RLS (parent_id = auth.uid()).

import type { SupabaseClient } from '@supabase/supabase-js';
import { levelForXp } from './game';

export interface ChildCompletion {
  adventureSlug: string;
  adventureTitle: string;
  worldSlug: string;
  worldName: string;
  xpReward: number;
  quizScore: number;
  quizMax: number;
  completedAt: string;
}

export interface ChildBadgeAward {
  slug: string;
  awardedAt: string;
}

export interface ChildData {
  id: string;
  name: string;
  age: number;
  gradeLevel: string;
  avatar: string;
  xp: number;
  level: number;
  phase: string;
  interests: string[];
  createdAt: string;
  completions: ChildCompletion[];
  completedAdventureSlugs: string[];
  badgeAwards: ChildBadgeAward[];
  badgeSlugs: string[];
  /** XP cumulé par slug de monde (alimente l'arbre des compétences) */
  worldXp: Record<string, number>;
  /** nombre d'aventures terminées par slug de monde */
  completionsPerWorld: Record<string, number>;
}

export async function fetchChildrenWithProgress(supabase: SupabaseClient): Promise<ChildData[]> {
  const { data: kids, error } = await supabase
    .from('children')
    .select('id,name,age,grade_level,avatar,xp,level,phase,interests,created_at')
    .order('created_at', { ascending: true });

  if (error) throw new Error('Impossible de charger les enfants : ' + error.message);
  if (!kids || kids.length === 0) return [];

  const ids = kids.map((k) => k.id);

  const [{ data: completionRows }, { data: badgeRows }] = await Promise.all([
    supabase
      .from('adventure_completions')
      .select(
        'child_id,quiz_score,quiz_max,completed_at,adventures(slug,title,xp_reward,worlds(slug,name))'
      )
      .in('child_id', ids),
    supabase.from('children_badges').select('child_id,awarded_at,badges(slug)').in('child_id', ids),
  ]);

  const byChild = new Map<string, ChildData>(
    kids.map((k) => [
      k.id,
      {
        id: k.id,
        name: k.name,
        age: k.age,
        gradeLevel: k.grade_level,
        avatar: k.avatar,
        xp: k.xp,
        level: k.level,
        phase: k.phase,
        interests: k.interests ?? [],
        createdAt: k.created_at,
        completions: [],
        completedAdventureSlugs: [],
        badgeAwards: [],
        badgeSlugs: [],
        worldXp: {},
        completionsPerWorld: {},
      },
    ])
  );

  for (const row of (completionRows ?? []) as unknown as {
    child_id: string;
    quiz_score: number;
    quiz_max: number;
    completed_at: string;
    adventures: { slug: string; title: string; xp_reward: number; worlds: { slug: string; name: string } | null } | null;
  }[]) {
    const child = byChild.get(row.child_id);
    if (!child || !row.adventures) continue;
    const worldSlug = row.adventures.worlds?.slug ?? '';
    const completion: ChildCompletion = {
      adventureSlug: row.adventures.slug,
      adventureTitle: row.adventures.title,
      worldSlug,
      worldName: row.adventures.worlds?.name ?? '',
      xpReward: row.adventures.xp_reward ?? 0,
      quizScore: row.quiz_score,
      quizMax: row.quiz_max,
      completedAt: row.completed_at,
    };
    child.completions.push(completion);
    child.completedAdventureSlugs.push(completion.adventureSlug);
    child.worldXp[worldSlug] = (child.worldXp[worldSlug] ?? 0) + completion.xpReward;
    child.completionsPerWorld[worldSlug] = (child.completionsPerWorld[worldSlug] ?? 0) + 1;
  }

  for (const row of (badgeRows ?? []) as unknown as { child_id: string; awarded_at: string; badges: { slug: string } | null }[]) {
    const child = byChild.get(row.child_id);
    if (!child || !row.badges?.slug) continue;
    child.badgeAwards.push({ slug: row.badges.slug, awardedAt: row.awarded_at });
    child.badgeSlugs.push(row.badges.slug);
  }

  for (const child of byChild.values()) {
    child.completions.sort((a, b) => a.completedAt.localeCompare(b.completedAt));
    child.badgeAwards.sort((a, b) => a.awardedAt.localeCompare(b.awardedAt));
    // resynchronise le niveau si la DB était en retard (ceinture et bretelles)
    if (child.level !== levelForXp(child.xp)) child.level = levelForXp(child.xp);
  }

  return Array.from(byChild.values());
}

export function findActiveChild(children: ChildData[], activeId: string | null): ChildData | null {
  if (children.length === 0) return null;
  return children.find((c) => c.id === activeId) ?? children[0];
}
