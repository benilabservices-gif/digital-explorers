'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WORLDS } from '@/data/content';
import { Lock, Shield, Sparkles } from 'lucide-react';
import Nav from '@/components/Nav';

export default function WorldsPage() {
  const router = useRouter();
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('de_auth');
    const expires = localStorage.getItem('de_auth_expires');
    if (token && expires && Date.now() > parseInt(expires)) {
      localStorage.removeItem('de_auth');
      localStorage.removeItem('de_auth_expires');
      setAuth(false);
    } else if (token) {
      setAuth(true);
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060810] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!auth) {
    return (
      <div className="min-h-screen bg-[#060810] text-white">
        <Nav />
        <div className="pt-32 px-6 pb-24 flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-violet-400" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Connecte-toi pour explorer</h1>
            <p className="text-gray-400 mb-8 text-lg">Les 7 mondes t attendent. Crée ton compte gratuit et commence ton aventure avec le Coach IA.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <button className="px-8 py-3 bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] rounded-full font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" /> Créer mon compte gratuit
                </button>
              </Link>
              <Link href="/auth/login">
                <button className="px-8 py-3 border border-white/10 rounded-full text-gray-300 hover:bg-white/5 transition-all">
                  J ai déjà un compte
                </button>
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-600">
              <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-emerald-400" /> 7 jours d essai gratuit</span>
              <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-emerald-400" /> Pas de carte requise</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060810] text-white">
      <Nav />
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-4"><Sparkles className="w-4 h-4" /> 7 univers interactifs</div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Les 7 Mondes</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Explore le numérique à travers des univers fascinants conçus pour les jeunes africains. Coach IA inclus.</p>
          </div>
        </div>
      </section>
      <section className="py-8 px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {WORLDS.map(world => (
              <Link key={world.id} href={`/worlds/${world.slug}`} className="group relative p-6 rounded-2xl bg-[#111827] border border-white/5 hover:border-violet-500/30 transition-all hover:-translate-y-1">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${world.gradient} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>{world.icon}</div>
                <h2 className="text-lg font-bold mb-2">{world.name}</h2>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{world.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">{world.adventures?.length || 0} aventures</span>
                  <span className={`px-3 py-1 rounded-full ${world.phase==='explorer'?'bg-blue-500/10 text-blue-400':world.phase==='creator'?'bg-emerald-500/10 text-emerald-400':'bg-orange-500/10 text-orange-400'}`}>
                    {world.phase==='explorer'?'Explorer':world.phase==='creator'?'Créer':'Construire'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
          <p>© 2026 Digital Explorers — BENILAB. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
