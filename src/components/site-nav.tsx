import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import { TESTIDS } from "@/lib/testids";

// ─────────────────────────────────────────────────────────────────────────────
// SiteNav — navigation unifiée (remplace les 2 navs dupliquées + la nav inline
// de pricing). Composant serveur : l'état de session est passé par le layout
// du route group (Phase 2) — plus de createClient() dans la nav.
// Variantes : invité (marketing) / connecté (app) via `user`.
// ─────────────────────────────────────────────────────────────────────────────

export interface NavUser {
  /** prénom/nom du profil, null si inconnu */
  name: string | null;
  isAdmin: boolean;
}

const navLink =
  "rounded-lg px-3 py-2 text-sm text-ink-soft transition-colors duration-250 hover:bg-night-800 hover:text-ink";

export function SiteNav({ user }: { user: NavUser | null }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-night-950/70 backdrop-blur-xl">
      <nav
        aria-label="Navigation principale"
        className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6"
      >
        <Link
          href="/"
          className="flex items-center gap-3"
          data-testid="brand-home"
        >
          <span
            aria-hidden
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-sunrise-500 to-gleam-400 font-display text-sm font-bold text-night-950"
          >
            DE
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-ink">
            Digital Explorers
          </span>
        </Link>

        {user ? (
          <div className="flex items-center gap-1">
            <Link href="/dashboard" className={navLink} data-testid={TESTIDS.nav.dashboard}>
              Dashboard
            </Link>
            <Link href="/worlds" className={navLink} data-testid={TESTIDS.nav.worlds}>
              Mondes
            </Link>
            <Link href="/challenges" className={navLink} data-testid={TESTIDS.nav.challenges}>
              Défis
            </Link>
            <Link href="/pricing" className={navLink} data-testid={TESTIDS.nav.pricing}>
              Tarifs
            </Link>
            {user.isAdmin && (
              <Link
                href="/admin"
                className={cn(navLink, "text-sunrise-300 hover:text-sunrise-200")}
                data-testid={TESTIDS.nav.admin}
              >
                Admin
              </Link>
            )}
            {user.name && (
              <span
                className="mr-2 hidden text-xs text-ink-faint sm:block"
                data-testid={TESTIDS.nav.profile}
              >
                {user.name}
              </span>
            )}
            <LogoutButton />
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Link href="/worlds" className={navLink} data-testid={TESTIDS.nav.worlds}>
              Mondes
            </Link>
            <Link href="/pricing" className={navLink} data-testid={TESTIDS.nav.pricing}>
              Tarifs
            </Link>
            <Link
              href="/auth/login"
              className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "ml-1")}
              data-testid={TESTIDS.nav.login}
            >
              Connexion
            </Link>
            <Link
              href="/auth/signup"
              className={cn(buttonVariants({ variant: "primary", size: "sm" }), "ml-1")}
              data-testid={TESTIDS.nav.signup}
            >
              Commencer
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
