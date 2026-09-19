'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield } from 'lucide-react';
import { WORLDS } from '@/data/content';
import Nav from '@/components/Nav';
import AICoach from '@/components/AICoach';

export default function AdventureSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState('');
  let adventure: any = null;
  let world: any = null;

  useEffect(() => {
    params.then(p => setSlug(p.slug));
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
  }, [params]);

  useEffect(() => {
    if (!loading && !auth) {
      router.push('/auth/login');
    }
  }, [auth, loading, router]);

  for (const w of WORLDS) {
    const found = w.adventures?.find((a: any) => a.slug === slug);
    if (found) { adventure = found; world = w; break; }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060810] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!auth) {
    return (
      <div className="min-h-screen bg-[#060810] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-6"><Shield className="w-10 h-10 text-violet-400" /></div>
          <h1 className="font-display text-3xl font-bold mb-4">Accès réservé</h1>
          <p className="text-gray-400 mb-8">Connecte-toi pour accéder à cette aventure.</p>
          <Link href="/auth/signup"><button className="px-8 py-3 bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] rounded-full font-semibold hover:opacity-90">Créer mon compte</button></Link>
        </div>
      </div>
    );
  }

  if (!adventure || !world) {
    return (
      <div className="min-h-screen bg-[#060810] text-white flex items-center justify-center">
        <div className="text-center"><h1 className="text-2xl font-bold mb-2">Aventure non trouvée</h1><Link href="/dashboard" className="text-violet-400 hover:underline">Retour au dashboard</Link></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060810] text-white pb-32">
      <Nav />
      <div className="pt-24 px-6 max-w-3xl mx-auto">
        <Link href={`/worlds/${world.slug}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors"><ArrowLeft className="w-4 h-4" /> Retour à {world.name}</Link>
        <div className={`rounded-2xl p-6 mb-6 bg-gradient-to-r ${world.gradient} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative">
            <h1 className="text-2xl font-bold mb-1">{adventure.title}</h1>
            <p className="text-white/80 text-sm">{adventure.description}</p>
            <div className="mt-3 text-sm text-white/60">+{adventure.xp_reward} XP</div>
          </div>
        </div>
        <div className="bg-[#111827] border border-white/5 rounded-xl p-6 mb-6">
          <p className="text-gray-300 leading-relaxed whitespace-pre-line">{adventure.story || adventure.description}</p>
        </div>
        {adventure.lessons?.map((lesson: any, i: number) => (
          <div key={lesson.id} className="bg-[#111827] border border-white/5 rounded-xl p-6 mb-4">
            <div className="text-xs text-violet-400 font-medium mb-2">Étape {i + 1}/{adventure.lessons.length}</div>
            <h3 className="font-bold mb-2">{lesson.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{lesson.content}</p>
          </div>
        ))}
        <div className="flex justify-end mt-8">
          <Link href="/dashboard">
            <button className="bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity">
              Terminer l'aventure (+{adventure.xp_reward} XP)
            </button>
          </Link>
        </div>
      </div>
      <AICoach worldName={world.name} adventureTitle={adventure.title} />
    </div>
  );
}
