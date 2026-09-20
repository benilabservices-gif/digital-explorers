'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, Trophy, FolderOpen, Rocket, Shield, Users, CreditCard, BarChart3, Download, Plus, Trash2, Edit, Sparkles, Target, Zap, Star } from 'lucide-react';
import { WORLDS, BADGES as CONTENT_BADGES } from '@/data/content';
import type { ChildProfile } from '@/data/content';
import Nav from '@/components/Nav';

export default function ParentPage() {
  const router = useRouter();
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('de_auth');
    if (!token) { router.push('/auth/login'); return; }
    setAuth(true);
    const saved = localStorage.getItem('de_children');
    if (saved) {
      const kids: ChildProfile[] = JSON.parse(saved);
      setChildren(kids);
      const active = localStorage.getItem('de_active_child');
      if (active) setActiveChildId(JSON.parse(active).id);
      else if (kids.length > 0) setActiveChildId(kids[0].id);
    }
    setLoading(false);
  }, [router]);

  if (loading) return <div className="min-h-screen bg-[#060810] flex items-center justify-center"><div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!auth) return null;

  const activeChild = children.find(c => c.id === activeChildId) || children[0];

  const totalXP = children.reduce((sum, c) => sum + c.xp, 0);
  const totalAdvs = children.reduce((sum, c) => sum + c.adventuresCompleted.length, 0);
  const totalBadges = children.reduce((sum, c) => sum + c.badges.length, 0);

  function deleteChild(id: string) {
    const updated = children.filter(c => c.id !== id);
    setChildren(updated);
    localStorage.setItem('de_children', JSON.stringify(updated));
    if (activeChildId === id && updated.length > 0) {
      localStorage.setItem('de_active_child', JSON.stringify(updated[0]));
      setActiveChildId(updated[0].id);
    }
  }

  return (
    <div className="min-h-screen bg-[#060810] text-white">
      <Nav />
      <section className="pt-28 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors"><ArrowLeft className="w-4 h-4" /> Retour au dashboard</Link>
          
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/30 rounded-2xl p-8 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs mb-4">👨‍👩‍👧 Espace parent sécurisé</div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Espace Parent</h1>
            <p className="text-gray-400">Suis la progression de {children.length > 0 ? (children.length === 1 ? `ton enfant ${activeChild?.name}` : `tes ${children.length} enfants`) : 'tes enfants'} en toute transparence.</p>
          </div>

          {/* Children Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {children.map(child => {
              const pct = Math.round((child.adventuresCompleted.length / 84) * 100);
              return (
                <div key={child.id} className={`bg-[#111827] border rounded-xl p-5 transition-all cursor-pointer hover:border-violet-500/30 ${child.id === activeChildId ? 'border-violet-500 bg-violet-500/5' : 'border-white/5'}`} onClick={() => { setActiveChildId(child.id); localStorage.setItem('de_active_child', JSON.stringify(child)); }}>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-4xl">{child.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-lg truncate">{child.name}</div>
                      <div className="text-xs text-gray-400">{child.gradeLevel} • {child.age} ans</div>
                      <div className="text-xs text-violet-400">Niveau {child.level}</div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); deleteChild(child.id); }} className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div><div className="text-lg font-bold text-yellow-400">{child.xp}</div><div className="text-xs text-gray-500">XP</div></div>
                    <div><div className="text-lg font-bold text-pink-400">{child.badges.length}</div><div className="text-xs text-gray-500">Badges</div></div>
                    <div><div className="text-lg font-bold text-emerald-400">{child.adventuresCompleted.length}</div><div className="text-xs text-gray-500">Aventures</div></div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                    <span>Progression</span><span>{pct}%</span>
                  </div>
                  <div className="mt-1 h-1.5 bg-[#1e293b] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all" style={{ width: `${pct}%` }} /></div>
                </div>
              );
            })}
            <button onClick={() => router.push('/auth/signup')} className="bg-[#111827] border border-dashed border-white/20 rounded-xl p-5 flex flex-col items-center justify-center gap-2 hover:border-violet-500/50 transition-all text-gray-400 hover:text-white min-h-[140px]">
              <Plus className="w-8 h-8" /><span className="text-sm font-medium">Ajouter un enfant</span>
            </button>
          </div>

          {/* Global Stats */}
          {children.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Users, label: 'Enfants', value: String(children.length), color: 'text-violet-400' },
                { icon: Zap, label: 'XP Total', value: String(totalXP), color: 'text-yellow-400' },
                { icon: BookOpen, label: 'Aventures', value: String(totalAdvs), color: 'text-emerald-400' },
                { icon: Trophy, label: 'Badges', value: String(totalBadges), color: 'text-pink-400' },
              ].map((stat, i) => (
                <div key={i} className="bg-[#111827] border border-white/5 rounded-xl p-4 text-center">
                  <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} /><div className="text-2xl font-bold">{stat.value}</div><div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Active Child Detail */}
          {activeChild && (
            <>
              {/* This Week Report */}
              <div className="bg-[#111827] border border-white/5 rounded-xl p-6 mb-8">
                <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-violet-400" /> Rapport — {activeChild.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-sm text-gray-400 mb-3">Cette semaine</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-gray-400">Activités terminées</span><span className="font-bold">{Math.min(3, activeChild.adventuresCompleted.length)} / 3</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">XP gagné</span><span className="font-bold text-yellow-400">+{Math.min(240, activeChild.xp)} XP</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Badges obtenus</span><span className="font-bold text-pink-400">{activeChild.badges.length}</span></div>
                      <div className="flex justify-between"><span className="text-gray-400">Projets soumis</span><span className="font-bold text-emerald-400">{activeChild.adventuresCompleted.length > 0 ? '1' : '0'}</span></div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-3">Compétences développées</div>
                    <div className="flex flex-wrap gap-2">
                      {activeChild.adventuresCompleted.length > 0 && (
                        <>
                          <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs">🌐 Web</span>
                          <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs">🤖 IA</span>
                          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs">💻 Coding</span>
                        </>
                      )}
                      {activeChild.adventuresCompleted.length === 0 && <span className="text-sm text-gray-500">Commence une aventure pour voir tes compétences</span>}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-3">Prochaine étape recommandée</div>
                    <div className="bg-[#0f172a] rounded-xl p-4 border border-white/5">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="w-4 h-4 text-emerald-400" />
                        <span className="font-semibold text-sm">Continuer l'aventure</span>
                      </div>
                      <p className="text-xs text-gray-400">Termine {84 - activeChild.adventuresCompleted.length} aventures restantes pour débloquer tous les mondes.</p>
                      <Link href="/dashboard"><button className="mt-3 text-xs text-violet-400 hover:text-violet-300 font-medium">Aller au dashboard →</button></Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* World Progress */}
              <div className="bg-[#111827] border border-white/5 rounded-xl p-6 mb-8">
                <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-violet-400" /> Progression par monde</h2>
                <div className="space-y-3">
                  {WORLDS.map(world => {
                    const done = activeChild.adventuresCompleted.filter(a => world.adventures?.some(av => av.slug === a)).length;
                    const total = world.adventures?.length || 0;
                    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                    return (
                      <div key={world.id} className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${world.gradient} flex items-center justify-center text-lg flex-shrink-0`}>{world.icon}</div>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1"><span className="font-medium">{world.name}</span><span className="text-gray-400">{done}/{total}</span></div>
                          <div className="h-2 bg-[#1e293b] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all" style={{ width: `${pct}%` }} /></div>
                        </div>
                        <span className="text-sm font-medium text-violet-400 w-12 text-right">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Badges */}
              <div className="bg-[#111827] border border-white/5 rounded-xl p-6 mb-8">
                <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-400" /> Badges de {activeChild.name}</h2>
                <div className="flex flex-wrap gap-3">
                  {activeChild.badges.length > 0 ? activeChild.badges.map(slug => {
                    const badge = CONTENT_BADGES.find(b => b.slug === slug);
                    if (!badge) return null;
                    return (
                      <div key={slug} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-[#0f172a] min-w-[80px]">
                        <span className="text-2xl">{badge.icon}</span>
                        <span className="text-xs text-center font-medium">{badge.name}</span>
                      </div>
                    );
                  }) : <p className="text-gray-400 text-sm">Aucun badge obtenu pour le moment.</p>}
                </div>
              </div>

              {/* Billing */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-[#111827] border border-white/5 rounded-xl p-6">
                  <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-emerald-400" /> Abonnement & Paiement</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <div className="flex items-center gap-3"><span className="text-2xl">🌱</span><div><div className="font-semibold text-sm">Plan Starter</div><div className="text-xs text-gray-400">7 jours d'essai gratuit</div></div></div>
                      <span className="text-emerald-400 font-bold">Gratuit</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3"><span className="text-2xl">⚡</span><div><div className="font-semibold text-sm">Plan Explorateur</div><div className="text-xs text-gray-400">2 000 FCFA/mois</div></div></div>
                      <Link href="/pricing"><button className="px-3 py-1.5 text-xs bg-violet-500/20 border border-violet-500/30 rounded-lg text-violet-300 hover:bg-violet-500/30">Choisir</button></Link>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3"><span className="text-2xl">👑</span><div><div className="font-semibold text-sm">Plan Pro</div><div className="text-xs text-gray-400">15 000 FCFA/an</div></div></div>
                      <Link href="/pricing"><button className="px-3 py-1.5 text-xs bg-violet-500/20 border border-violet-500/30 rounded-lg text-violet-300 hover:bg-violet-500/30">Choisir</button></Link>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">
                    <span>Paiements: 🟠 Orange Money</span><span>🟡 MTN MoMo</span><span>🔵 Wave</span>
                  </div>
                </div>

                <div className="bg-[#111827] border border-white/5 rounded-xl p-6">
                  <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-emerald-400" /> Confidentialité & Sécurité</h2>
                  <ul className="space-y-3 text-sm text-gray-400">
                    {['Données minimales conformes RGPD', 'Pas de publicité ciblée', 'Données chiffrées', 'Contrôle parental complet', 'Aucune donnée vendue', 'Suppression possible à tout moment'].map((item, i) => (
                      <li key={i} className="flex items-start gap-3"><span className="text-emerald-400 font-bold">✓</span>{item}</li>
                    ))}
                  </ul>
                  <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                    🔒 Les données de tes enfants sont protégées. Tu peux demander leur suppression à tout moment.
                  </div>
                </div>
              </div>

              {/* Reports & Export */}
              <div className="bg-[#111827] border border-white/5 rounded-xl p-6">
                <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2"><Download className="w-5 h-5 text-blue-400" /> Rapports & Export</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { icon: '📊', title: 'Rapport mensuel', desc: 'Télécharge le rapport de progression' },
                    { icon: '🏆', title: 'Certificats', desc: 'Génère des certificats pour les niveaux atteints' },
                    { icon: '💬', title: 'Feedback IA', desc: 'Reçois des recommandations personnalisées' },
                  ].map((item, i) => (
                    <button key={i} className="p-4 rounded-xl bg-[#0f172a] border border-white/5 hover:border-violet-500/30 transition-colors text-left">
                      <div className="text-2xl mb-2">{item.icon}</div>
                      <div className="font-semibold text-sm">{item.title}</div>
                      <div className="text-xs text-gray-400 mt-1">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </>
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

function TrendingUp(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;
}
