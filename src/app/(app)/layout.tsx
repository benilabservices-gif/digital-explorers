// ─────────────────────────────────────────────────────────────────────────────
// Layout (app) — espace enfant connecté : dashboard, mondes, aventures, défis,
// portfolio.
//
// Serveur + guard : sans session on redirige vers /auth/login AVANT le rendu.
// proxy.ts reste la première ligne de défense ; ce redirect est le garde-fou
// RSC (une page serveur ne doit jamais s'exécuter pour un visiteur).
// Pas de footer : ces pages sont immersives (footers par page en Phase 4).
// ─────────────────────────────────────────────────────────────────────────────

import { redirect } from 'next/navigation';
import { SiteNav } from '@/components/site-nav';
import { getNavUser } from '@/lib/queries/session';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getNavUser();
  if (!user) redirect('/auth/login');

  return (
    <>
      <SiteNav user={user} />
      <main>{children}</main>
    </>
  );
}
