// ─────────────────────────────────────────────────────────────────────────────
// Layout (parent) — espace parent connecté : suivi, admin.
//
// Même guard que (app). Le contrôle de rôle admin reste dans la page
// /admin (403 pour les non-admin) : ce layout ne gère que la session.
// ─────────────────────────────────────────────────────────────────────────────

import { redirect } from 'next/navigation';
import { SiteNav } from '@/components/site-nav';
import { getNavUser } from '@/lib/queries/session';

export default async function ParentLayout({ children }: { children: React.ReactNode }) {
  const user = await getNavUser();
  if (!user) redirect('/auth/login');

  return (
    <>
      <SiteNav user={user} />
      <main>{children}</main>
    </>
  );
}
