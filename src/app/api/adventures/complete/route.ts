// Complétion d'aventure — toute la logique de récompense est côté serveur :
// le client ne fait que soumettre ses réponses au quiz.

import { createClient } from '@/lib/supabase/server';
import {
  PLAN_LIMITS,
  activePlanCode,
  checkPlanGating,
  computeNewBadges,
  levelForXp,
  type BadgeLike,
} from '@/lib/game';

// Badges attribués par un mécanisme dédié (pas au fil des complétions).
const MANUAL_BADGE_SLUGS = new Set(['multi-children', 'starter-complete']);

export async function POST(request: Request) {
  let body: { childId?: string; adventureSlug?: string; answers?: (number | null)[] };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }

  const childId = body.childId;
  const adventureSlug = body.adventureSlug;
  const answers = Array.isArray(body.answers) ? body.answers : null;

  if (!childId || !adventureSlug || !answers) {
    return Response.json({ error: 'missing_fields' }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'unauthorized' }, { status: 401 });

  // ----- Enfant + propriété -----
  const { data: child } = await supabase
    .from('children')
    .select('id,parent_id,name,xp,level')
    .eq('id', childId)
    .maybeSingle();

  if (!child) return Response.json({ error: 'child_not_found' }, { status: 404 });
  if (child.parent_id !== user.id) return Response.json({ error: 'forbidden' }, { status: 403 });

  // ----- Aventure publiée + son monde -----
  const { data: adventure } = await supabase
    .from('adventures')
    .select('id,slug,title,xp_reward,world_id,worlds(id,slug,name)')
    .eq('slug', adventureSlug)
    .eq('is_published', true)
    .maybeSingle();

  if (!adventure) {
    return Response.json({ error: 'adventure_not_found' }, { status: 404 });
  }
  const world = adventure.worlds;
  if (!world) {
    return Response.json({ error: 'adventure_not_found' }, { status: 404 });
  }
  const worldId = world.id;

  // ----- Questions du quiz (scoring serveur) -----
  const { data: questions } = await supabase
    .from('quiz_questions')
    .select('id,correct_index')
    .eq('adventure_id', adventure.id)
    .order('sort_order');

  const quiz = (questions ?? []) as { id: string; correct_index: number }[];
  const quizMax = quiz.length;
  if (answers.length !== quizMax) {
    return Response.json({ error: 'answers_mismatch', quizMax }, { status: 400 });
  }
  if (answers.some((a) => a === null || a === undefined)) {
    return Response.json({ error: 'answers_incomplete' }, { status: 400 });
  }
  const quizScore = quiz.reduce((score, q, i) => score + (answers[i] === q.correct_index ? 1 : 0), 0);

  // ----- Idempotence : déjà complétée -> pas de double XP -----
  const { data: existing } = await supabase
    .from('adventure_completions')
    .select('id,quiz_score,quiz_max,completed_at')
    .eq('child_id', childId)
    .eq('adventure_id', adventure.id)
    .maybeSingle();

  if (existing) {
    return Response.json({
      alreadyCompleted: true,
      xpAwarded: 0,
      quizScore: existing.quiz_score,
      quizMax: existing.quiz_max,
      newXp: child.xp,
      newLevel: child.level,
      leveledUp: false,
      newBadges: [],
    });
  }

  // ----- Gating du plan (starter : 1 monde, 3 aventures) -----
  const [{ data: priorCompletions }, { data: subscription }] = await Promise.all([
    supabase
      .from('adventure_completions')
      .select('adventures(world_id)')
      .eq('child_id', childId),
    supabase
      .from('subscriptions')
      .select('plan_code,status,expires_at,started_at')
      .eq('parent_id', user.id)
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const priorWorldIds = ((priorCompletions ?? []) as unknown as { adventures: { world_id: string } | null }[])
    .map((r) => r.adventures?.world_id)
    .filter((id): id is string => Boolean(id));

  const planCode = activePlanCode(subscription);
  const gating = checkPlanGating({
    limits: PLAN_LIMITS[planCode],
    completedCount: priorWorldIds.length,
    distinctWorldIds: new Set(priorWorldIds),
    newWorldId: worldId,
  });

  if (!gating.allowed) {
    return Response.json(
      { error: 'plan_limit', reason: gating.reason, planCode },
      { status: 403 }
    );
  }

  // ----- Journalisation de la complétion -----
  const { error: insertError } = await supabase
    .from('adventure_completions')
    .insert({ child_id: childId, adventure_id: adventure.id, quiz_score: quizScore, quiz_max: quizMax });

  if (insertError) {
    console.error('adventures/complete: insertion impossible', insertError);
    return Response.json({ error: 'completion_failed' }, { status: 500 });
  }

  // ----- XP + niveau -----
  const newXp = child.xp + adventure.xp_reward;
  const newLevel = levelForXp(newXp);
  const { error: updateError } = await supabase
    .from('children')
    .update({ xp: newXp, level: newLevel })
    .eq('id', childId);

  if (updateError) {
    console.error('adventures/complete: mise à jour enfant impossible', updateError);
    return Response.json({ error: 'update_failed' }, { status: 500 });
  }

  // ----- Badges (seuils XP / complétions de monde / première action) -----
  const [{ data: allBadgeRows }, { data: ownedBadgeRows }, { count: siblingsCount }] =
    await Promise.all([
      supabase
        .from('badges')
        .select('id,slug,name,description,icon,rarity,xp_required,world_id,required_completions')
        .order('sort_order'),
      supabase
        .from('children_badges')
        .select('badges(slug)')
        .eq('child_id', childId),
      supabase
        .from('children')
        .select('*', { count: 'exact', head: true })
        .eq('parent_id', user.id),
    ]);

  const completionsPerWorld: Record<string, number> = {};
  for (const id of priorWorldIds) completionsPerWorld[id] = (completionsPerWorld[id] ?? 0) + 1;
  completionsPerWorld[worldId] = (completionsPerWorld[worldId] ?? 0) + 1;

  const ownedSlugs = ((ownedBadgeRows ?? []) as unknown as { badges: { slug: string } | null }[])
    .map((r) => r.badges?.slug)
    .filter((s): s is string => Boolean(s));

  const eligibleBadges = ((allBadgeRows ?? []) as (BadgeLike & { id: string })[]).filter(
    (b) => !MANUAL_BADGE_SLUGS.has(b.slug)
  );

  const autoBadges = computeNewBadges({
    allBadges: eligibleBadges,
    currentBadgeSlugs: ownedSlugs,
    totalXp: newXp,
    completionsPerWorld,
    totalCompletions: priorWorldIds.length + 1,
  });

  // Badge « Grand Frère / Grande Soeur » : parent avec 2+ enfants.
  const multiChildrenBadge = ((allBadgeRows ?? []) as unknown as (BadgeLike & { id: string })[])
    .find((b) => b.slug === 'multi-children');
  if (multiChildrenBadge && (siblingsCount ?? 0) >= 2 && !ownedSlugs.includes('multi-children')) {
    autoBadges.push(multiChildrenBadge);
  }

  if (autoBadges.length > 0) {
    const { error: badgeError } = await supabase.from('children_badges').insert(
      autoBadges.map((b) => ({ child_id: childId, badge_id: (b as BadgeLike & { id: string }).id }))
    );
    if (badgeError) console.error('adventures/complete: attribution badges impossible', badgeError);
  }

  return Response.json({
    alreadyCompleted: false,
    xpAwarded: adventure.xp_reward,
    quizScore,
    quizMax,
    newXp,
    newLevel,
    leveledUp: newLevel > child.level,
    newBadges: autoBadges.map((b) => ({ slug: b.slug, name: b.name, icon: b.icon })),
  });
}
