'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Award, FolderOpen, Zap, ArrowRight, Crown, Rocket, ChevronRight, LogOut } from 'lucide-react';
import { WORLDS, DIGITAL_BRIDGES, BADGES as CONTENT_BADGES } from '@/data/content';

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('de_auth');
    if (!auth) { router.push('/auth/login'); return; }
    const saved = localStorage.getItem('de_profile');
    if (saved) setProfile(JSON.parse(saved));
    else {
      const p = { id:'local_1', pseudonym:'Explorateur', age:14, gradeLevel:'4e', phase:'creator', xp:0, level:1 };
      localStorage.setItem('de_profile', JSON.stringify(p));
      setProfile(p);
    }
    setLoading(false);
  }, [router]);

  if (loading) return <div className="min-h-screen bg-[#060810] flex items-center justify-center"><div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>;

  const level = Math.floor(profile.xp / 500) + 1;
  const progress = ((profile.xp % 500) / 500) * 100;
  const earnedBadges = CONTENT_BADGES.slice(0, Math.min(Math.floor(profile.xp / 100), CONTENT_BADGES.length));

  function handleSignOut() {
    localStorage.removeItem('de_auth');
    localStorage.removeItem('de_profile');
    router.push('/');
  }

  return (
    <div className="min-h-screen bg-[#060810] text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#060810]/70 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff6b6b] to-[#8b5cf6] flex items-center justify-center text-sm font-bold">DE</div><span className="font-bold text-lg tracking-tight">Digital Explorers</span></Link>
          <div className="flex items-center gap-3">
            <Link href="/pricing"><button className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">Tarifs</button></Link>
            <button onClick={handleSignOut} className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors" title="Se déconnecter"><LogOut className="w-5 h-5" /></button>
          </div>
        </div>
      </nav>
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/20 rounded-2xl p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="relative flex items-center justify-between">
              <div><h1 className="font-display text-2xl md:text-3xl font-bold mb-2">Bonjour, {profile.pseudonym} !</h1><p className="text-gray-400">Prêt à continuer ton exploration ?</p></div>
              <div className="text-right"><div className="text-3xl font-bold text-violet-400">Nv. {level}</div><div className="text-sm text-gray-400">{profile.xp} XP</div></div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-8 px-6 pb-24">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[{icon:Crown,label:'Niveau',value:`Nv. ${level}`,color:'text-yellow-400'},{icon:Zap,label:'XP Total',value:`${profile.xp} XP`,color:'text-violet-400'},{icon:Award,label:'Badges',value:`${earnedBadges.length}/${CONTENT_BADGES.length}`,color:'text-pink-400'},{icon:FolderOpen,label:'Projets',value:'0',color:'text-emerald-400'}].map((stat,i) => (
              <div key={i} className="bg-[#111827] border border-white/5 rounded-xl p-4">
                <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} /><div className="text-2xl font-bold">{stat.value}</div><div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="bg-[#111827] border border-white/5 rounded-xl p-4">
            <div className="flex justify-between text-sm mb-2"><span className="text-gray-400">Progression vers le niveau {level + 1}</span><span className="text-violet-400 font-medium">{profile.xp} / {level * 500} XP</span></div>
            <div className="h-2 bg-[#1e293b] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all" style={{width:`${progress}%`}} /></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#111827] border border-white/5 rounded-xl p-6">
              <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-violet-400" />Ma prochaine aventure</h2>
              <div className="space-y-3">
                {WORLDS.slice(0,3).map(world => world.adventures?.slice(0,1).map(adv => (
                  <Link key={`${world.slug}-${adv.slug}`} href={`/adventure/${adv.slug}`} className="flex items-center gap-4 p-4 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] border border-white/5 hover:border-violet-500/30 transition-all group">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${world.gradient} flex items-center justify-center text-2xl flex-shrink-0`}>{world.icon}</div>
                    <div className="flex-1 min-w-0"><div className="text-xs text-gray-500 mb-0.5">{world.name}</div><div className="font-semibold truncate">{adv.title}</div><div className="text-sm text-gray-400 truncate">{adv.description}</div></div>
                    <div className="text-right flex-shrink-0"><div className="text-sm text-yellow-400 font-medium">+{adv.xp_reward} XP</div></div>
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-violet-400 transition-colors" />
                  </Link>
                )))}
              </div>
            </div>
            <div className="bg-[#111827] border border-white/5 rounded-xl p-6">
              <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2"><Rocket className="w-5 h-5 text-orange-400" />Digital Bridge</h2>
              <div className="space-y-3">
                {DIGITAL_BRIDGES.map(bridge => (
                  <a key={bridge.id} href={bridge.targetUrl} target="_blank" rel="noopener noreferrer" className="block p-4 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] border border-white/5 hover:border-orange-300/30 transition-all">
                    <div className="text-xl mb-1">{bridge.icon}</div>
                    <div className="font-semibold text-sm">{bridge.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{bridge.description}</div>
                    <div className="text-xs text-orange-400 mt-2 font-medium">Continuer →</div>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h2 className="font-display text-xl font-bold mb-4">Explore les mondes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {WORLDS.map(world => (
                <Link key={world.id} href={`/worlds/${world.slug}`} className="group p-5 rounded-xl bg-[#111827] border border-white/5 hover:border-violet-500/30 transition-all hover:-translate-y-0.5">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${world.gradient} flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform`}>{world.icon}</div>
                  <h3 className="font-bold mb-1">{world.name}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2">{world.description}</p>
                  <div className="mt-3 text-xs text-violet-400 font-medium flex items-center gap-1">{world.adventures?.length || 0} aventures <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" /></div>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-display text-xl font-bold mb-4">Mes badges</h2>
            <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
              {earnedBadges.length > 0 ? (
                <div className="flex flex-wrap gap-3">{earnedBadges.map(badge => (<div key={badge.id} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-[#0f172a] min-w-[80px]"><span className="text-2xl">{badge.icon}</span><span className="text-xs text-center font-medium">{badge.name}</span><span className={`text-xs ${badge.rarity==='legendary'?'text-yellow-400':badge.rarity==='epic'?'text-purple-400':badge.rarity==='rare'?'text-blue-400':'text-gray-400'}`}>{badge.rarity}</span></div>))}</div>
              ) : (<div className="text-center py-8 text-gray-400"><Award className="w-10 h-10 mx-auto mb-3 opacity-30" /><p>Tu n&apos;as pas encore de badges.</p><p className="text-sm">Complète des aventures pour en gagner !</p></div>)}
            </div>
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
