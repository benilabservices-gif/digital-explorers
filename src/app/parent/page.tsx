'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, Trophy, FolderOpen, Rocket, Shield, Users, CreditCard, BarChart3, Download, Plus, Trash2, Edit } from 'lucide-react';
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
  const totalAdventures = children.reduce((sum, c) => sum + c.adventuresCompleted.length, 0);
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

  function addExpense(amount: number, method: string, date: string) {
    const expenses = JSON.parse(localStorage.getItem('de_expenses') || '[]');
    expenses.push({ amount, method, date, id: Date.now() });
    localStorage.setItem('de_expenses', JSON.stringify(expenses));
  }

  return (
    <div className="min-h-screen bg-[#060810] text-white">
      <Nav />
      <section className="pt-28 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors"><ArrowLeft className="w-4 h-4" /> Retour au dashboard</Link>
          <div className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/30 rounded-2xl p-8 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs mb-4">👨‍👩‍👧 Espace parent sécurisé</div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Espace Parent</h1>
            <p className="text-gray-400">Suis la progression de {children.length > 0 ? (children.length === 1 ? `ton enfant ${activeChild?.name}` : `tes ${children.length} enfants`) : 'tes enfants'} en toute transparence.</p>
          </div>

          {/* Children overview cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {children.map(child => {
              const childBadges = child.badges.length;
              const childAdvs = child.adventuresCompleted.length;
              const childXP = child.xp;
              return (
                <div key={child.id} className={`bg-[#111827] border rounded-xl p-5 transition-all cursor-pointer hover:border-violet-500/30 ${child.id === activeChildId ? 'border-violet-500 bg-violet-500/5' : 'border-white/5'}`} onClick={() => { setActiveChildId(child.id); localStorage.setItem('de_active_child', JSON.stringify(child)); }}>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-4xl">{child.avatar}</span>
                    <div>
                      <div className="font-bold text-lg">{child.name}</div>
                      <div className="text-xs text-gray-400">{child.gradeLevel} • {child.age} ans</div>
                      <div className="text-xs text-violet-400">Niveau {child.level}</div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); deleteChild(child.id); }} className="ml-auto p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div><div className="text-lg font-bold text-yellow-400">{childXP}</div><div className="text-xs text-gray-500">XP</div></div>
                    <div><div className="text-lg font-bold text-pink-400">{childBadges}</div><div className="text-xs text-gray-500">Badges</div></div>
                    <div><div className="text-lg font-bold text-emerald-400">{childAdvs}</div><div className="text-xs text-gray-500">Aventures</div></div>
                  </div>
                  <div className="mt-3 h-1.5 bg-[#1e293b] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full" style={{ width: `${Math.min(100, (childXP % 500) / 5)}%` }} /></div>
                </div>
              );
            })}
            <button onClick={() => router.push('/auth/signup')} className="bg-[#111827] border border-dashed border-white/20 rounded-xl p-5 flex flex-col items-center justify-center gap-2 hover:border-violet-500/50 transition-all text-gray-400 hover:text-white min-h-[140px]">
              <Plus className="w-8 h-8" /><span className="text-sm font-medium">Ajouter un enfant</span>
            </button>
          </div>

          {/* Global stats */}
          {children.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-[#111827] border border-white/5 rounded-xl p-4 text-center"><Users className="w-6 h-6 text-violet-400 mx-auto mb-2" /><div className="text-2xl font-bold">{children.length}</div><div className="text-sm text-gray-400">Enfants</div></div>
              <div className="bg-[#111827] border border-white/5 rounded-xl p-4 text-center"><ZapIcon className="w-6 h-6 text-yellow-400 mx-auto mb-2" /><div className="text-2xl font-bold">{totalXP}</div><div className="text-sm text-gray-400">XP total</div></div>
              <div className="bg-[#111827] border border-white/5 rounded-xl p-4 text-center"><BookOpen className="w-6 h-6 text-emerald-400 mx-auto mb-2" /><div className="text-2xl font-bold">{totalAdventures}</div><div className="text-sm text-gray-400">Aventures</div></div>
              <div className="bg-[#111827] border border-white/5 rounded-xl p-4 text-center"><Trophy className="w-6 h-6 text-pink-400 mx-auto mb-2" /><div className="text-2xl font-bold">{totalBadges}</div><div className="text-sm text-gray-400">Badges</div></div>
            </div>
          )}

          {/* Activity by child */}
          {activeChild && (
            <div className="bg-[#111827] border border-white/5 rounded-xl p-6 mb-8">
              <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-violet-400" /> Progression de {activeChild.name}</h2>
              <div className="space-y-3">
                {WORLDS.map(world => {
                  const done = activeChild.adventuresCompleted.filter(a => world.adventures?.some(av => av.slug === a)).length;
                  const total = world.adventures?.length || 0;
                  const pct = total > 0 ? (done / total) * 100 : 0;
                  return (
                    <div key={world.id} className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${world.gradient} flex items-center justify-center text-lg flex-shrink-0`}>{world.icon}</div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1"><span className="font-medium">{world.name}</span><span className="text-gray-400">{done}/{total}</span></div>
                        <div className="h-2 bg-[#1e293b] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all" style={{ width: `${pct}%` }} /></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Badges collection */}
          {activeChild && (
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
          )}

          {/* Billing & Plans */}
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
              <div className="mt-4 flex gap-3">
                <span className="text-xs text-gray-500">Paiements acceptés:</span>
                <span className="text-xs text-gray-400">🟠 Orange Money</span>
                <span className="text-xs text-gray-400">🟡 MTN MoMo</span>
                <span className="text-xs text-gray-400">🔵 Wave</span>
              </div>
            </div>

            <div className="bg-[#111827] border border-white/5 rounded-xl p-6">
              <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-emerald-400" /> Confidentialité & Sécurité</h2>
              <ul className="space-y-3 text-sm text-gray-400">
                {[
                  { icon: '✓', text: 'Données minimales conformes RGPD' },
                  { icon: '✓', text: 'Pas de publicité ciblée sur les enfants' },
                  { icon: '✓', text: 'Données chiffrées de bout en bout' },
                  { icon: '✓', text: 'Contrôle parental complet' },
                  { icon: '✓', text: 'Aucune donnée vendue à des tiers' },
                  { icon: '✓', text: 'Suppression possible à tout moment' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3"><span className="text-emerald-400 font-bold">{item.icon}</span>{item.text}</li>
                ))}
              </ul>
              <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                🔒 Les données de tes enfants sont protégées. Tu peux demander leur suppression à tout moment.
              </div>
            </div>
          </div>

          {/* Reports */}
          {children.length > 0 && (
            <div className="bg-[#111827] border border-white/5 rounded-xl p-6">
              <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2"><Download className="w-5 h-5 text-blue-400" /> Rapports & Export</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button className="p-4 rounded-xl bg-[#0f172a] border border-white/5 hover:border-violet-500/30 transition-colors text-left">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="font-semibold text-sm">Rapport mensuel</div>
                  <div className="text-xs text-gray-400 mt-1">Télécharge le rapport de progression de tous tes enfants</div>
                </button>
                <button className="p-4 rounded-xl bg-[#0f172a] border border-white/5 hover:border-violet-500/30 transition-colors text-left">
                  <div className="text-2xl mb-2">🏆</div>
                  <div className="font-semibold text-sm">Certificats</div>
                  <div className="text-xs text-gray-400 mt-1">Génère des certificats pour les niveaux atteints</div>
                </button>
                <button className="p-4 rounded-xl bg-[#0f172a] border border-white/5 hover:border-violet-500/30 transition-colors text-left">
                  <div className="text-2xl mb-2">💬</div>
                  <div className="font-semibold text-sm">Feedback IA</div>
                  <div className="text-xs text-gray-400 mt-1">Reçois des recommandations personnalisées par enfant</div>
                </button>
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

function ZapIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.914 4a1.5 1.5 0 0 0-2.474-1.561l-9 9A1.5 1.5 0 0 0 5.5 14h4.002a.5.5 0 0 1 .471.666L8.086 20a1.5 1.5 0 0 0 2.475 1.56l9-9A1.5 1.5 0 0 0 18.5 10h-3.997a.5.5 0 0 1-.472-.667z"/></svg>;
}
