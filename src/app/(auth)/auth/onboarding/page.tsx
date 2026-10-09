'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/components/motion/page-transition';

// ─────────────────────────────────────────────────────────────────────────────
// Onboarding parent — îlot client : redirige vers /auth/signup si non
// connecté, vers /dashboard si un enfant existe déjà. Habillage tokens-only.
// ─────────────────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/auth/signup'); return; }
      setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || null);

      // Des enfants existent déjà -> pas besoin d'onboarding
      const { count } = await supabase.from('children').select('id', { count: 'exact', head: true });
      if ((count ?? 0) > 0) {
        router.push('/dashboard');
      } else {
        setLoading(false);
      }
    });
  }, [router]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-night-950">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-sunrise-500 border-t-transparent" />
    </div>
  );

  return (
    <PageTransition>
    <div className="flex min-h-screen items-center justify-center bg-night-950 px-4 py-12 text-ink">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-sunrise-500/30 bg-linear-to-br from-sunrise-500/20 to-gleam-400/20 text-3xl" aria-hidden="true">👋</div>
          <h1 className="font-display mb-2 text-2xl font-bold">Bienvenue{userName ? `, ${userName}` : ''} !</h1>
          <p className="text-ink-soft">Ajoute ton premier enfant pour commencer l'aventure.</p>
        </div>
        <Link href="/auth/signup" className={cn(buttonVariants(), 'mb-4 h-12 w-full')}>
          Ajouter un enfant
        </Link>
        <Button variant="secondary" onClick={() => router.push('/dashboard')} className="h-12 w-full">
          Passer — aller au dashboard
        </Button>
      </div>
    </div>
    </PageTransition>
  );
}
