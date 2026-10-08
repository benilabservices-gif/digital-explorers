// ─────────────────────────────────────────────────────────────────────────────
// Requêtes serveur — enfants & enfant actif (Phase 2).
//
// L'enfant « actif » (celui qui joue) vivait en localStorage côté client.
// Le RSC en a besoin au rendu (dashboard, aventure…) : on migre vers un cookie
// `de_active_child`, lu via cookies() dans les composants serveur.
// L'écriture reste côté client (src/lib/active-child.ts) — les mutations
// n'appartiennent pas au rendu.
// Fallback : findActiveChild() rend le premier enfant si le cookie est absent
// ou obsolète.
// ─────────────────────────────────────────────────────────────────────────────

import { cache } from 'react';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { fetchChildrenWithProgress, findActiveChild } from '@/lib/children';
import { ACTIVE_CHILD_COOKIE } from '@/lib/active-child';

export { ACTIVE_CHILD_COOKIE };

/** Enfants du compte courant, avec leur progression agrégée. */
export const getChildren = cache(async () => {
  const supabase = await createClient();
  return fetchChildrenWithProgress(supabase);
});

/**
 * Enfant actif du compte courant : cookie `de_active_child` si valide,
 * sinon premier enfant. Null si le compte n'a pas encore d'enfant
 * (onboarding) ou si la session est absente.
 */
export const getActiveChild = cache(async () => {
  const children = await getChildren();
  const cookieId = (await cookies()).get(ACTIVE_CHILD_COOKIE)?.value ?? null;
  return findActiveChild(children, cookieId);
});
