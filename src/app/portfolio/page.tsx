'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Award, FolderOpen } from 'lucide-react';
import { BADGES as CONTENT_BADGES } from '@/data/content';

export default function PortfolioPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const auth = localStorage.getItem('de_auth');
    if (!auth) { router.push('/auth/login'); return; }
    const saved = localStorage.getItem('de_profile');
    if (saved) setProfile(JSON.parse(saved));
    const savedProjects = localStorage.getItem('de_projects');
    if (savedProjects) setProjects(JSON.parse(savedProjects));
  }, [router]);

  if (!profile) return null;

  const level = Math.floor(profile.xp / 500) + 1;
  const earnedCount = Math.min(Math.floor(profile.xp / 100), CONTENT_BADGES.length);
  const earnedBadges = CONTENT_BADGES.slice(0, earnedCount);

  return (
    <div className="min-h-screen bg-[#060810] text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#060810]/70 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff6b6b] to-[#8b5cf6] flex items-center justify-center text-sm font-bold">DE</div><span className="font-bold text-lg tracking-tight">Digital Explorers</span></Link>
          <div className="flex items-center gap-3">
            <Link href="/auth/login"><button className="px-4 py-2 text-sm border border-white/10 rounded-full text-gray-300 hover:bg-white/5 transition-all">Connexion</button></Link>
            <Link href="/auth/signup"><button className="px-5 py-2 text-sm bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] rounded-full font-semibold hover:opacity-90 transition-opacity">Commencer</button></Link>
          </div>
        </div>
      </nav>
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors"><ArrowLeft className="w-4 h-4" /> Retour au dashboard</Link>
          <div className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/20 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="relative flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 flex items-center justify-center text-4xl">👤</div>
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold mb-1">{profile.pseudonym}</h1>
                <p className="text-gray-400">Niveau {level} • {profile.xp} XP</p>
                <div className="flex items-center gap-3 mt-2 text-sm text-gray-400"><span>🎒 {projects.length} projet(s)</span><span>🏆 {earnedCount} badge(s)</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-8 px-6 pb-24">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-[#111827] border border-white/5 rounded-xl p-6">
            <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-yellow-400" /> 🪪 Mon Digital Passport</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[{label:'Niveau',value:`Nv. ${level}`,icon:'⭐'},{label:'XP Total',value:`${profile.xp}`,icon:'⚡'},{label:'Badges',value:`${earnedCount}/${CONTENT_BADGES.length}`,icon:'🏅'},{label:'Projets',value:String(projects.length),icon:'📁'}].map((stat,i) => (
                <div key={i} className="bg-[#0f172a] rounded-lg p-4 text-center"><div className="text-2xl mb-1">{stat.icon}</div><div className="text-xl font-bold">{stat.value}</div><div className="text-xs text-gray-400">{stat.label}</div></div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-display text-xl font-bold mb-4">Mes badges</h2>
            <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
              {earnedBadges.length > 0 ? (
                <div className="flex flex-wrap gap-3">{earnedBadges.map(badge => (<div key={badge.id} className="flex flex-col items-center gap-1 p-4 rounded-xl bg-[#0f172a] min-w-[90px]"><span className="text-3xl">{badge.icon}</span><span className="text-xs text-center font-medium">{badge.name}</span><span className={`text-xs ${badge.rarity==='legendary'?'text-yellow-400':badge.rarity==='epic'?'text-purple-400':badge.rarity==='rare'?'text-blue-400':'text-gray-400'}`}>{badge.rarity}</span></div>))}</div>
              ) : (<div className="text-center py-8 text-gray-400"><Award className="w-10 h-10 mx-auto mb-3 opacity-30" /><p>Aucun badge pour le moment.</p><p className="text-sm">Explore des mondes pour en gagner !</p></div>)}
            </div>
          </div>
          <div>
            <h2 className="font-display text-xl font-bold mb-4">Mes projets</h2>
            <div className="bg-[#111827] border border-white/5 rounded-xl overflow-hidden">
              {projects.length > 0 ? projects.map((p: any, i: number) => (
                <div key={i} className={`p-4 flex items-start gap-4 ${i>0?'border-t border-white/5':''}`}>
                  <div className="w-10 h-10 rounded-lg bg-[#0f172a] flex items-center justify-center text-lg">📝</div>
                  <div className="flex-1"><div className="font-medium">{p.title}</div><p className="text-sm text-gray-400 truncate">{p.description}</p></div>
                  <div className="text-xs text-gray-500">{new Date(p.created_at).toLocaleDateString('fr-FR')}</div>
                </div>
              )) : (<div className="text-center py-12 text-gray-400"><FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-30" /><p className="font-medium mb-1">Aucun projet</p><p className="text-sm">Termine des aventures et soumets tes créations !</p></div>)}
            </div>
          </div>
          {earnedCount < CONTENT_BADGES.length && (
            <div>
              <h2 className="font-display text-xl font-bold mb-4">Badges à débloquer</h2>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {CONTENT_BADGES.slice(earnedCount, earnedCount+10).map(badge => (<div key={badge.id} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-[#111827] border border-white/5 opacity-40"><span className="text-2xl grayscale">{badge.icon}</span><span className="text-xs text-center font-medium">{badge.name}</span></div>))}
              </div>
            </div>
          )}
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
