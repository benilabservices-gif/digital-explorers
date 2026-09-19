'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Award, FolderOpen, Zap, ArrowRight, Crown, Rocket, ChevronRight, LogOut, Plus, UserPlus, Shield, Heart, Gift } from 'lucide-react';
import { WORLDS, BADGES as CONTENT_BADGES, DIGITAL_BRIDGES } from '@/data/content';
import type { ChildProfile } from '@/data/content';
import Nav from '@/components/Nav';
import AICoach from '@/components/AICoach';

export default function DashboardPage() {
  const router = useRouter();
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('de_auth');
    if (!token) { setAuth(false); setLoading(false); return; }
    setAuth(true);
    const saved = localStorage.getItem('de_children');
    if (saved) {
      const kids: ChildProfile[] = JSON.parse(saved);
      setChildren(kids);
      const active = localStorage.getItem('de_active_child');
      if (active) {
        const child = JSON.parse(active);
        setActiveChildId(child.id);
      } else if (kids.length > 0) {
        setActiveChildId(kids[0].id);
        localStorage.setItem('de_active_child', JSON.stringify(kids[0]));
      }
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return <div className="min-h-screen bg-[#060810] flex items-center justify-center"><div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!auth) {
    return (
      <div className="min-h-screen bg-[#060810] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-6"><Award className="w-10 h-10 text-violet-400" /></div>
          <h1 className="font-display text-3xl font-bold mb-4">Accès réservé</h1>
          <p className="text-gray-400 mb-8">Connecte-toi pour accéder à ton espace parent.</p>
          <Link href="/auth/signup"><button className="px-8 py-3 bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] rounded-full font-semibold hover:opacity-90">Créer mon compte</button></Link>
        </div>
      </div>
    );
  }

  const activeChild = children.find(c => c.id === activeChildId) || children[0];

  function handleSignOut() {
    localStorage.removeItem('de_auth');
    localStorage.removeItem('de_active_child');
    router.push('/');
  }

  function addChild() {
    router.push('/auth/signup');
  }

  function selectChild(id: string) {
    setActiveChildId(id);
    const kid = children.find(c => c.id === id);
    if (kid) localStorage.setItem('de_active_child', JSON.stringify(kid));
  }

  function completeAdventure(advSlug: string, xpReward: number) {
    if (!activeChildId) return;
    const updated = children.map(c => {
      if (c.id !== activeChildId) return c;
      if (c.adventuresCompleted.includes(advSlug)) return c;
      const newXp = c.xp + xpReward;
      const newLevel = Math.floor(newXp / 500) + 1;
      const earnedBadges = CONTENT_BADGES.filter(b => newXp >= b.xp_required && !c.badges.includes(b.slug)).map(b => b.slug);
      return {
        ...c,
        xp: newXp,
        level: newLevel,
        adventuresCompleted: [...c.adventuresCompleted, advSlug],
        badges: [...c.badges, ...earnedBadges],
      };
    });
    setChildren(updated);
    localStorage.setItem('de_children', JSON.stringify(updated));
    if (activeChild) {
      const child = updated.find(c => c.id === activeChildId);
      if (child) localStorage.setItem('de_active_child', JSON.stringify(child));
    }
  }

  return (
    <div className="min-h-screen bg-[#060810] text-white">
      <Nav />
      <section className="pt-28 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-sm text-gray-400 mb-1">Tableau de bord parental</p>
              <h1 className="font-display text-3xl md:text-4xl font-bold">Mes enfants</h1>
            </div>
            <button onClick={addChild} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] rounded-full font-semibold text-sm hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4" /> Ajouter un enfant
            </button>
          </div>

          {/* Children selector */}
          <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
            {children.map(child => (
              <button key={child.id} onClick={() => selectChild(child.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all min-w-[160px] ${child.id === activeChildId ? 'border-violet-500 bg-violet-500/10' : 'border-white/10 bg-[#111827] hover:border-white/20'}`}>
                <span className="text-3xl">{child.avatar}</span>
                <div className="text-left">
                  <div className="font-bold text-sm">{child.name}</div>
                  <div className="text-xs text-gray-400">{child.gradeLevel} • Nv.{child.level}</div>
                  <div className="text-xs text-violet-400">{child.xp} XP</div>
                </div>
              </button>
            ))}
            <button onClick={addChild} className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-dashed border-white/20 text-gray-400 hover:text-white hover:border-violet-500/50 transition-all min-w-[120px]">
              <UserPlus className="w-5 h-5" /> <span className="text-sm">Ajouter</span>
            </button>
          </div>

          {!activeChild ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">👨‍👩‍👧</div>
              <h2 className="font-display text-2xl font-bold mb-2">Aucun enfant ajouté</h2>
              <p className="text-gray-400 mb-6">Commence par ajouter ton enfant pour suivre sa progression.</p>
              <Link href="/auth/signup"><button className="px-8 py-3 bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] rounded-full font-semibold hover:opacity-90">Ajouter un enfant</button></Link>
            </div>
          ) : (
            <>
              {/* Active child hero */}
              <div className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/20 rounded-2xl p-6 md:p-8 relative overflow-hidden mb-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <div className="relative flex items-center gap-6">
                  <div className="text-6xl">{activeChild.avatar}</div>
                  <div className="flex-1">
                    <h2 className="font-display text-2xl md:text-3xl font-bold mb-1">{activeChild.name}</h2>
                    <p className="text-gray-400">{activeChild.gradeLevel} • {activeChild.age} ans • Phase: <span className="text-violet-400 capitalize">{activeChild.phase}</span></p>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className="flex items-center gap-1"><Crown className="w-4 h-4 text-yellow-400" /> Niveau {activeChild.level}</span>
                      <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-violet-400" /> {activeChild.xp} XP</span>
                      <span className="flex items-center gap-1"><Award className="w-4 h-4 text-pink-400" /> {activeChild.badges.length} badges</span>
                      <span className="flex items-center gap-1"><TrendingUp className="w-4 h-4 text-emerald-400" /> {activeChild.adventuresCompleted.length}/84 aventures</span>
                    </div>
                  </div>
                  <div className="text-right hidden md:block">
                    <div className="text-4xl font-bold text-violet-400">Nv.{activeChild.level}</div>
                    <div className="text-sm text-gray-400">{activeChild.xp} / {activeChild.level * 500} XP</div>
                    <div className="mt-2 h-2 w-32 bg-[#1e293b] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full" style={{ width: `${((activeChild.xp % 500) / 500) * 100}%` }} /></div>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { icon: Crown, label: 'Niveau', value: `Nv. ${activeChild.level}`, color: 'text-yellow-400' },
                  { icon: Zap, label: 'XP Total', value: `${activeChild.xp} XP`, color: 'text-violet-400' },
                  { icon: Award, label: 'Badges', value: `${activeChild.badges.length}/${CONTENT_BADGES.length}`, color: 'text-pink-400' },
                  { icon: FolderOpen, label: 'Aventures', value: `${activeChild.adventuresCompleted.length}/84`, color: 'text-emerald-400' },
                ].map((stat, i) => (
                  <div key={i} className="bg-[#111827] border border-white/5 rounded-xl p-4">
                    <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} /><div className="text-2xl font-bold">{stat.value}</div><div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Worlds + Adventures */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-[#111827] border border-white/5 rounded-xl p-6">
                  <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-violet-400" /> Progression par monde</h2>
                  <div className="space-y-4">
                    {WORLDS.map(world => {
                      const done = activeChild.adventuresCompleted.filter(a => WORLDS.find(w => w.slug === world.slug)?.adventures?.some(av => av.slug === a)).length;
                      const total = world.adventures?.length || 0;
                      const pct = total > 0 ? (done / total) * 100 : 0;
                      const lastAdv = world.adventures?.find(av => !activeChild.adventuresCompleted.includes(av.slug));
                      return (
                        <div key={world.id} className="bg-[#0f172a] rounded-xl p-4 border border-white/5">
                          <div className="flex items-center gap-4 mb-3">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${world.gradient} flex items-center justify-center text-2xl`}>{world.icon}</div>
                            <div className="flex-1">
                              <div className="font-bold">{world.name}</div>
                              <div className="text-xs text-gray-400">{done}/{total} aventures terminées</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-violet-400">{Math.round(pct)}%</div>
                              {lastAdv && <Link href={`/adventure/${lastAdv.slug}`} className="text-xs text-gray-500 hover:text-white">Suivant: {lastAdv.title}</Link>}
                            </div>
                          </div>
                          <div className="h-2 bg-[#1e293b] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all" style={{ width: `${pct}%` }} /></div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-[#111827] border border-white/5 rounded-xl p-6">
                    <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2"><Rocket className="w-5 h-5 text-orange-400" /> Digital Bridge</h2>
                    <div className="space-y-3">
                      {DIGITAL_BRIDGES.map(bridge => (
                        <a key={bridge.id} href={bridge.targetUrl} target="_blank" rel="noopener noreferrer" className="block p-4 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] border border-white/5 hover:border-orange-300/30 transition-all">
                          <div className="text-xl mb-1">{bridge.icon}</div>
                          <div className="font-semibold text-sm">{bridge.name}</div>
                          <div className="text-xs text-gray-400 mt-1">{bridge.description}</div>
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2"><Gift className="w-5 h-5 text-amber-400" /><span className="font-bold">Plan actuel</span></div>
                    <div className="text-2xl font-bold text-amber-400 mb-1">Starter — 7 jours gratuit</div>
                    <p className="text-xs text-gray-400 mb-3">Passe à Explorateur (2 000 FCFA/mois) pour un accès complet.</p>
                    <Link href="/pricing"><button className="w-full py-2 bg-amber-500/20 border border-amber-500/30 rounded-lg text-sm font-semibold text-amber-300 hover:bg-amber-500/30 transition-colors">Voir les tarifs</button></Link>
                  </div>
                </div>
              </div>

              {/* Earned badges */}
              <div className="mb-8">
                <h2 className="font-display text-xl font-bold mb-4">Badges obtenus</h2>
                <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
                  {activeChild.badges.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {activeChild.badges.map(slug => {
                        const badge = CONTENT_BADGES.find(b => b.slug === slug);
                        if (!badge) return null;
                        return (
                          <div key={slug} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-[#0f172a] min-w-[80px]">
                            <span className="text-2xl">{badge.icon}</span>
                            <span className="text-xs text-center font-medium">{badge.name}</span>
                            <span className={`text-xs ${badge.rarity === 'legendary' ? 'text-yellow-400' : badge.rarity === 'epic' ? 'text-purple-400' : badge.rarity === 'rare' ? 'text-blue-400' : 'text-gray-400'}`}>{badge.rarity}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <Award className="w-10 h-10 mx-auto mb-3 opacity-30" /><p>Aucun badge pour le moment.</p><p className="text-sm">Termine des aventures pour en gagner !</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick adventures */}
              <div>
                <h2 className="font-display text-xl font-bold mb-4">Continuer l'aventure</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {WORLDS.flatMap(world =>
                    (world.adventures || []).filter(adv => !activeChild.adventuresCompleted.includes(adv.slug)).slice(0, 3).map(adv => (
                      <Link key={`${world.slug}-${adv.slug}`} href={`/adventure/${adv.slug}`} className="flex items-center gap-4 p-4 rounded-xl bg-[#111827] border border-white/5 hover:border-violet-500/30 transition-all group">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${world.gradient} flex items-center justify-center text-2xl flex-shrink-0`}>{world.icon}</div>
                        <div className="flex-1 min-w-0"><div className="text-xs text-gray-500 mb-0.5">{world.name}</div><div className="font-semibold truncate">{adv.title}</div><div className="text-sm text-gray-400 truncate">{adv.description}</div></div>
                        <div className="text-right flex-shrink-0"><div className="text-sm text-yellow-400 font-medium">+{adv.xp_reward} XP</div><ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-violet-400 transition-colors" /></div>
                      </Link>
                    ))
                  ).slice(0, 6)}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
      <AICoach />
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
          <p>© 2026 Digital Explorers — BENILAB. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
