'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Award, FolderOpen, Zap, ArrowRight, Crown, Rocket, ChevronRight, LogOut, Plus, UserPlus, Shield, Heart, Gift, Sparkles, Target, Star } from 'lucide-react';
import { WORLDS, BADGES as CONTENT_BADGES, DIGITAL_BRIDGES } from '@/data/content';
import type { ChildProfile } from '@/data/content';
import Nav from '@/components/Nav';
import AICoach from '@/components/AICoach';
import { createClient } from '@/lib/supabase/client';

export default function DashboardPage() {
  const router = useRouter();
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [activeChild, setActiveChild] = useState<ChildProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const [worldProgress, setWorldProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    const token = localStorage.getItem('de_auth');
    if (!token) { setAuth(false); setLoading(false); return; }
    setAuth(true);
    loadChildren();
  }, [router]);

  async function loadChildren() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    // Load from Supabase
    const { data: dbChildren } = await supabase
      .from('children')
      .select('*')
      .eq('parent_id', user.id)
      .order('created_at', { ascending: true });

    // Load from localStorage (fallback/merge)
    const lsChildren: ChildProfile[] = JSON.parse(localStorage.getItem('de_children') || '[]');
    
    // Merge: prefer DB data, fallback to LS
    const allChildren: ChildProfile[] = dbChildren?.map(c => ({
      id: c.id,
      name: c.name,
      age: c.age || 0,
      gradeLevel: c.grade_level || '',
      avatar: c.avatar || '👦🏾',
      xp: c.xp || 0,
      level: c.level || 1,
      phase: c.phase as any,
      badges: [],
      adventuresCompleted: [],
      interests: c.interests || [],
      createdAt: c.created_at,
    })) || lsChildren;

    setChildren(allChildren);
    
    const active = localStorage.getItem('de_active_child');
    if (active) {
      const child = JSON.parse(active);
      setActiveChildId(child.id);
      setActiveChild(child);
    } else if (allChildren.length > 0) {
      setActiveChildId(allChildren[0].id);
      setActiveChild(allChildren[0]);
      localStorage.setItem('de_active_child', JSON.stringify(allChildren[0]));
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!activeChildId || children.length === 0) return;
    const child = children.find(c => c.id === activeChildId) || activeChild;
    if (!child) return;
    setActiveChild(child);
    
    // Calculate world progress
    const progress: Record<string, number> = {};
    WORLDS.forEach(world => {
      const worldAdvs = world.adventures || [];
      const completed = worldAdvs.filter(a => child.adventuresCompleted.includes(a.slug)).length;
      progress[world.slug] = worldAdvs.length > 0 ? Math.round((completed / worldAdvs.length) * 100) : 0;
    });
    setWorldProgress(progress);
  }, [activeChildId, children, activeChild]);

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

  const child = activeChild || children[0];

  function handleSignOut() {
    localStorage.removeItem('de_auth');
    localStorage.removeItem('de_active_child');
    router.push('/');
  }

  function addChild() {
    router.push('/auth/signup');
  }

  async function selectChild(id: string) {
    setActiveChildId(id);
    const kid = children.find(c => c.id === id);
    if (kid) {
      setActiveChild(kid);
      localStorage.setItem('de_active_child', JSON.stringify(kid));
    }
  }

  function getLevelTitle(xp: number): string {
    if (xp >= 4000) return 'Innovateur';
    if (xp >= 2000) return 'Maker';
    if (xp >= 1000) return 'Créateur';
    if (xp >= 500) return 'Apprenti';
    return 'Explorateur';
  }

  function getNextAdventure(): { world: any; adventure: any } | null {
    if (!child) return null;
    for (const world of WORLDS) {
      const unfinished = (world.adventures || []).filter(adv => !child.adventuresCompleted.includes(adv.slug));
      if (unfinished.length > 0) {
        return { world, adventure: unfinished[0] };
      }
    }
    return null;
  }

  const nextAct = getNextAdventure();

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
            {children.map(c => (
              <button key={c.id} onClick={() => selectChild(c.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all min-w-[160px] ${c.id === activeChildId ? 'border-violet-500 bg-violet-500/10' : 'border-white/10 bg-[#111827] hover:border-white/20'}`}>
                <span className="text-3xl">{c.avatar}</span>
                <div className="text-left">
                  <div className="font-bold text-sm">{c.name}</div>
                  <div className="text-xs text-gray-400">{c.gradeLevel} • Nv.{c.level}</div>
                  <div className="text-xs text-violet-400">{c.xp} XP</div>
                </div>
              </button>
            ))}
            <button onClick={addChild} className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-dashed border-white/20 text-gray-400 hover:text-white hover:border-violet-500/50 transition-all min-w-[120px]">
              <UserPlus className="w-5 h-5" /> <span className="text-sm">Ajouter</span>
            </button>
          </div>

          {!child ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">👨‍👩‍👧</div>
              <h2 className="font-display text-2xl font-bold mb-2">Aucun enfant ajouté</h2>
              <p className="text-gray-400 mb-6">Commence par ajouter ton enfant pour suivre sa progression.</p>
              <Link href="/auth/signup"><button className="px-8 py-3 bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] rounded-full font-semibold hover:opacity-90">Ajouter un enfant</button></Link>
            </div>
          ) : (
            <>
              {/* ACTIVE CHILD HERO — Action-Oriented */}
              <div className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/20 rounded-2xl p-6 md:p-8 relative overflow-hidden mb-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <div className="relative flex items-center gap-6">
                  <div className="text-6xl">{child.avatar}</div>
                  <div className="flex-1">
                    <p className="text-sm text-violet-300 mb-1">👋 Bonjour {child.name} !</p>
                    <h2 className="font-display text-2xl md:text-3xl font-bold mb-1">
                      {getLevelTitle(child.xp)} — Niveau {child.level}
                    </h2>
                    <p className="text-gray-400">{child.gradeLevel} • {child.age} ans • Phase {child.phase}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className="flex items-center gap-1"><Crown className="w-4 h-4 text-yellow-400" /> Nv.{child.level}</span>
                      <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-violet-400" /> {child.xp} XP</span>
                      <span className="flex items-center gap-1"><Award className="w-4 h-4 text-pink-400" /> {child.badges.length} badges</span>
                      <span className="flex items-center gap-1"><TrendingUp className="w-4 h-4 text-emerald-400" /> {child.adventuresCompleted.length}/84</span>
                    </div>
                  </div>
                  <div className="text-right hidden md:block">
                    <div className="text-4xl font-bold text-violet-400">Nv.{child.level}</div>
                    <div className="text-sm text-gray-400">{child.xp} / {child.level * 500} XP</div>
                    <div className="mt-2 h-2 w-32 bg-[#1e293b] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full" style={{ width: `${((child.xp % 500) / 500) * 100}%` }} /></div>
                  </div>
                </div>
              </div>

              {/* NEXT ACTION — PRIMARY CTA */}
              {nextAct && (
                <div className="mb-8">
                  <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${nextAct.world.gradient} flex items-center justify-center text-3xl flex-shrink-0`}>{nextAct.world.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="w-5 h-5 text-emerald-400" />
                        <span className="text-sm font-semibold text-emerald-300 uppercase tracking-wider">Ta prochaine mission</span>
                      </div>
                      <h3 className="text-xl font-bold mb-1">{nextAct.adventure.title}</h3>
                      <p className="text-gray-400 text-sm">{nextAct.adventure.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span>+{nextAct.adventure.xp_reward} XP</span>
                        <span>•</span>
                        <span>Niv. {nextAct.adventure.level}</span>
                        <span>•</span>
                        <span>{nextAct.world.name}</span>
                      </div>
                    </div>
                    <Link href={`/adventure/${nextAct.adventure.slug}`}>
                      <button className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl transition-colors flex items-center gap-2 flex-shrink-0">
                        <Sparkles className="w-5 h-5" /> Continuer
                      </button>
                    </Link>
                  </div>
                </div>
              )}

              {/* DAILY CHALLENGE */}
              <div className="mb-8">
                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-amber-400" />
                    <span className="text-sm font-semibold text-amber-300 uppercase tracking-wider">Défi du jour</span>
                  </div>
                  <p className="text-gray-300 mb-3">Trouve une information fiable sur Internet et vérifie sa source.</p>
                  <Link href="/adventure/search-master"><button className="px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-lg text-sm font-semibold text-amber-300 hover:bg-amber-500/30 transition-colors">Relever le défi</button></Link>
                </div>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { icon: Crown, label: 'Niveau', value: `Nv. ${child.level}`, color: 'text-yellow-400' },
                  { icon: Zap, label: 'XP Total', value: `${child.xp} XP`, color: 'text-violet-400' },
                  { icon: Award, label: 'Badges', value: `${child.badges.length}/${CONTENT_BADGES.length}`, color: 'text-pink-400' },
                  { icon: FolderOpen, label: 'Aventures', value: `${child.adventuresCompleted.length}/84`, color: 'text-emerald-400' },
                ].map((stat, i) => (
                  <div key={i} className="bg-[#111827] border border-white/5 rounded-xl p-4">
                    <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} /><div className="text-2xl font-bold">{stat.value}</div><div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* WORLDS PROGRESS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-[#111827] border border-white/5 rounded-xl p-6">
                  <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-violet-400" /> Progression par monde</h2>
                  <div className="space-y-3">
                    {WORLDS.map(world => {
                      const pct = worldProgress[world.slug] || 0;
                      const done = world.adventures?.filter(av => child.adventuresCompleted.includes(av.slug)).length || 0;
                      const total = world.adventures?.length || 0;
                      const locked = child.xp < 100 && world.phase !== 'explorer';
                      return (
                        <div key={world.id} className={`bg-[#0f172a] rounded-xl p-4 border ${locked ? 'border-white/5 opacity-50' : 'border-white/5 hover:border-violet-500/30'} transition-colors`}>
                          <div className="flex items-center gap-4 mb-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${world.gradient} flex items-center justify-center text-lg flex-shrink-0`}>{world.icon}</div>
                            <div className="flex-1">
                              <div className="font-bold text-sm">{world.name}</div>
                              <div className="text-xs text-gray-400">{done}/{total} aventures{locked ? ' 🔒' : ''}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-violet-400">{pct}%</div>
                              {!locked && done < total && (
                                <Link href={`/adventure/${world.adventures?.find(a => !child.adventuresCompleted.includes(a.slug))?.slug}`} className="text-xs text-gray-500 hover:text-white">Continuer →</Link>
                              )}
                            </div>
                          </div>
                          <div className="h-2 bg-[#1e293b] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all" style={{ width: `${pct}%` }} /></div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Digital Bridge */}
                  <div className="bg-[#111827] border border-white/5 rounded-xl p-6">
                    <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2"><Rocket className="w-5 h-5 text-orange-400" /> Digital Bridge</h2>
                    <div className="space-y-3">
                      {DIGITAL_BRIDGES.map(bridge => (
                        <a key={bridge.id} href={bridge.targetUrl} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] border border-white/5 hover:border-orange-300/30 transition-all">
                          <div className="text-lg mb-1">{bridge.icon}</div>
                          <div className="font-semibold text-sm">{bridge.name}</div>
                          <div className="text-xs text-gray-400">{bridge.description}</div>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Plan */}
                  <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2"><Gift className="w-5 h-5 text-amber-400" /><span className="font-bold">Plan actuel</span></div>
                    <div className="text-2xl font-bold text-amber-400 mb-1">Starter — Gratuit</div>
                    <p className="text-xs text-gray-400 mb-3">Accès limité. Passe à Explorateur pour tout débloquer.</p>
                    <Link href="/pricing"><button className="w-full py-2 bg-amber-500/20 border border-amber-500/30 rounded-lg text-sm font-semibold text-amber-300 hover:bg-amber-500/30 transition-colors">Voir les tarifs</button></Link>
                  </div>
                </div>
              </div>

              {/* BADGES */}
              <div className="mb-8">
                <h2 className="font-display text-xl font-bold mb-4">🏆 Badges obtenus</h2>
                <div className="bg-[#111827] border border-white/5 rounded-xl p-5">
                  {child.badges.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {child.badges.map(slug => {
                        const badge = CONTENT_BADGES.find(b => b.slug === slug);
                        if (!badge) return null;
                        return (
                          <div key={slug} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-[#0f172a] min-w-[80px]">
                            <span className="text-2xl">{badge.icon}</span>
                            <span className="text-xs text-center font-medium">{badge.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <Award className="w-10 h-10 mx-auto mb-3 opacity-30" /><p>Aucun badge pour le moment.</p><p className="text-sm">Complète des aventures pour en gagner !</p>
                    </div>
                  )}
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
