'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

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
    <div className="min-h-screen bg-[#060810] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#060810] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-4 text-3xl">👋</div>
          <h1 className="font-display text-2xl font-bold mb-2">Bienvenue{userName ? `, ${userName}` : ''} !</h1>
          <p className="text-gray-400">Ajoute ton premier enfant pour commencer l&apos;aventure.</p>
        </div>
        <Link href="/auth/signup" className="block">
          <button className="w-full bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity mb-4">
            Ajouter un enfant
          </button>
        </Link>
        <button onClick={() => router.push('/dashboard')} className="w-full border border-white/10 text-gray-300 font-semibold py-3 rounded-xl hover:bg-white/5 transition-all">
          Passer — aller au dashboard
        </button>
      </div>
    </div>
  );
}
