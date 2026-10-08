"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { TESTIDS } from "@/lib/testids";

/** Îlot client de déconnexion — seul élément interactif de la SiteNav RSC. */
export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      data-testid={TESTIDS.nav.logout}
      title="Se déconnecter"
      aria-label="Se déconnecter"
      className="rounded-lg p-2 text-ink-faint transition-colors duration-250 hover:bg-night-800 hover:text-ink"
    >
      <LogOut className="h-4 w-4" />
    </button>
  );
}
