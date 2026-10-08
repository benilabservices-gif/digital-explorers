// ─────────────────────────────────────────────────────────────────────────────
// Requêtes serveur — session & profil (Phase 2).
//
// React cache() : les appels sont dédupliqués AU SEIN d'une même requête —
// layout + page + metadata peuvent tous appeler getSessionUser() sans
// multiplier les allers-retours Supabase.
//
// proxy.ts reste la première ligne (guards + refresh token) ; ces fonctions
// servent les layouts serveur (SiteNav) et les pages RSC.
// ─────────────────────────────────────────────────────────────────────────────

import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import type { NavUser } from '@/components/site-nav';

export interface SessionUser {
  id: string;
  email: string | null;
  fullName: string | null;
  isAdmin: boolean;
}

/** Session Supabase + profil public — null si visiteur non connecté. */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name,role')
    .eq('id', user.id)
    .maybeSingle();

  const metaName = (user.user_metadata as Record<string, string> | null)?.full_name;

  return {
    id: user.id,
    email: user.email ?? null,
    fullName: profile?.full_name ?? metaName ?? null,
    isAdmin: profile?.role === 'admin',
  };
});

/** Données exactes attendues par la SiteNav — consommé par les layouts. */
export const getNavUser = cache(async (): Promise<NavUser | null> => {
  const user = await getSessionUser();
  if (!user) return null;
  return { name: user.fullName, isAdmin: user.isAdmin };
});
