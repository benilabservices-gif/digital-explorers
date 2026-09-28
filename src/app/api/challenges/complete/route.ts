// Complétion de défi (quotidien/hebdomadaire) — idempotente par enfant+défi.

import { createClient } from '@/lib/supabase/server';
import { levelForXp } from '@/lib/game';

export async function POST(request: Request) {
  let body: { childId?: string; challengeSlug?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }

  const { childId, challengeSlug } = body;
  if (!childId || !challengeSlug) {
    return Response.json({ error: 'missing_fields' }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'unauthorized' }, { status: 401 });

  const { data: child } = await supabase
    .from('children')
    .select('id,parent_id,xp,level')
    .eq('id', childId)
    .maybeSingle();

  if (!child) return Response.json({ error: 'child_not_found' }, { status: 404 });
  if (child.parent_id !== user.id) return Response.json({ error: 'forbidden' }, { status: 403 });

  const { data: challenge } = await supabase
    .from('challenges')
    .select('id,slug,title,xp_reward')
    .eq('slug', challengeSlug)
    .eq('is_active', true)
    .maybeSingle();

  if (!challenge) return Response.json({ error: 'challenge_not_found' }, { status: 404 });

  // Idempotence : un défi ne rapporte son XP qu'une seule fois.
  const { data: existing } = await supabase
    .from('challenge_completions')
    .select('completed_at')
    .eq('child_id', childId)
    .eq('challenge_id', challenge.id)
    .maybeSingle();

  if (existing) {
    return Response.json({
      alreadyCompleted: true,
      xpAwarded: 0,
      newXp: child.xp,
      newLevel: child.level,
      leveledUp: false,
    });
  }

  const { error: insertError } = await supabase
    .from('challenge_completions')
    .insert({ child_id: childId, challenge_id: challenge.id });

  if (insertError) {
    console.error('challenges/complete: insertion impossible', insertError);
    return Response.json({ error: 'completion_failed' }, { status: 500 });
  }

  const newXp = child.xp + challenge.xp_reward;
  const newLevel = levelForXp(newXp);
  const { error: updateError } = await supabase
    .from('children')
    .update({ xp: newXp, level: newLevel })
    .eq('id', childId);

  if (updateError) {
    console.error('challenges/complete: mise à jour enfant impossible', updateError);
    return Response.json({ error: 'update_failed' }, { status: 500 });
  }

  return Response.json({
    alreadyCompleted: false,
    xpAwarded: challenge.xp_reward,
    newXp,
    newLevel,
    leveledUp: newLevel > child.level,
  });
}
