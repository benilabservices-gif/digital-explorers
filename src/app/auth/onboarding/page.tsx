'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function OnboardingPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth/signup'); return; }
      setUser(user);
      const existing = localStorage.getItem('de_profile');
      if (existing) { router.push('/dashboard'); return; }
      setLoading(false);
    };
    checkUser();
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
          <h1 className="font-display text-2xl font-bold mb-2">Bienvenue, {user?.email?.split('@')[0]} !</h1>
          <p className="text-gray-400">Finalise ton profil pour commencer l aventure.</p>
        </div>
        <button onClick={() => router.push('/auth/signup')} className="w-full bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity mb-4">
          Compléter mon profil
        </button>
        <button onClick={() => router.push('/dashboard')} className="w-full border border-white/10 text-gray-300 font-semibold py-3 rounded-xl hover:bg-white/5 transition-all">
          Passer — aller au dashboard
        </button>
      </div>
    </div>
  );
}
