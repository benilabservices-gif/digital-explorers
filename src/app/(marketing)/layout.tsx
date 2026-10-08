// ─────────────────────────────────────────────────────────────────────────────
// Layout (marketing) — pages publiques : accueil, tarifs.
//
// Serveur : la session est lue UNE fois (cache) pour la nav, sans guard —
// un visiteur non connecté voit la variante invité. Les pages n'ont plus
// à embarquer leur propre nav/footer (supprimés en Phase 2).
// ─────────────────────────────────────────────────────────────────────────────

import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';
import { getNavUser } from '@/lib/queries/session';

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const user = await getNavUser();

  return (
    <>
      <SiteNav user={user} />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
