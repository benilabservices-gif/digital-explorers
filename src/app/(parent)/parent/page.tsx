'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, Trophy, Shield, Users, CreditCard, BarChart3, Download, Plus, Trash2, Target, Zap, TrendingUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { fetchChildrenWithProgress, findActiveChild, type ChildData } from '@/lib/children';
import { fetchBadges, fetchWorldsWithAdventures, type WorldWithAdventures } from '@/lib/content-queries';
import { isWorldReady } from '@/data/content';
import { getActiveChildId, setActiveChildId as persistActiveChildId } from '@/lib/active-child';
import { weeklyStats, type BadgeLike } from '@/lib/game';
import { buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { PageTransition } from '@/components/motion/page-transition';

// ─────────────────────────────────────────────────────────────────────────────
// Espace Parent — îlot client : vue d'ensemble des enfants, rapport hebdo
// réel (complétions 7 derniers jours), progression par monde, badges,
// abonnement et confidentialité. Habillage tokens-only : or = XP/niveaux,
// corail = marque & badges, vert = progression, danger = suppression.
// Guard de session : layout (parent) (getNavUser → /auth/login).
// ─────────────────────────────────────────────────────────────────────────────

export default function ParentPage() {
  const router = useRouter();
  const [children, setChildren] = useState<ChildData[]>([]);
  const [worlds, setWorlds] = useState<WorldWithAdventures[]>([]);
  const [badges, setBadges] = useState<BadgeLike[]>([]);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      if (cancelled) return;

      const [kids, worldRows, badgeRows] = await Promise.all([
        fetchChildrenWithProgress(supabase),
        fetchWorldsWithAdventures(supabase),
        fetchBadges(supabase),
      ]);
      if (cancelled) return;

      setChildren(kids);
      setWorlds(worldRows);
      setBadges(badgeRows);
      const pointer = getActiveChildId();
      setActiveChildId(kids.length > 0 ? (kids.find(k => k.id === pointer)?.id ?? kids[0].id) : null);
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [router]);

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-night-950"><div className="h-12 w-12 animate-spin rounded-full border-4 border-sunrise-500 border-t-transparent" /></div>;

  const activeChild = findActiveChild(children, activeChildId);
  // MVP : seuls les mondes « prêts » (contenu importé) comptent dans le total.
  const totalAdventures = worlds.reduce((sum, w) => sum + (isWorldReady(w.slug) ? w.adventures.length : 0), 0);
  const totalXP = children.reduce((sum, c) => sum + c.xp, 0);
  const totalAdvs = children.reduce((sum, c) => sum + c.completedAdventureSlugs.length, 0);
  const totalBadges = children.reduce((sum, c) => sum + c.badgeSlugs.length, 0);

  function selectChild(id: string) {
    setActiveChildId(id);
    persistActiveChildId(id);
  }

  async function deleteChild(id: string) {
    const kid = children.find(c => c.id === id);
    const confirmed = window.confirm(
      `Supprimer définitivement le profil de ${kid?.name ?? 'cet enfant'} ? Toute sa progression (XP, badges, complétions) sera effacée.`
    );
    if (!confirmed || busy) return;
    setBusy(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('children').delete().eq('id', id);
      if (error) {
        window.alert('Suppression impossible : ' + error.message);
        return;
      }
      const updated = children.filter(c => c.id !== id);
      setChildren(updated);
      if (activeChildId === id) {
        const next = updated[0]?.id ?? null;
        setActiveChildId(next);
        persistActiveChildId(next);
      }
    } finally {
      setBusy(false);
    }
  }

  // Rapport hebdo réel : complétions des 7 derniers jours.
  const weekReport = activeChild
    ? weeklyStats(
        activeChild.completions.map(c => ({ completedAt: c.completedAt, xpReward: c.xpReward })),
        activeChild.badgeAwards.map(b => ({ awardedAt: b.awardedAt }))
      )
    : { count: 0, xp: 0, badges: 0 };

  return (
    <PageTransition>
    <div className="min-h-screen bg-night-950 text-ink">
      <section className="px-6 pb-8 pt-28">
        <div className="mx-auto max-w-6xl">
          <Link href="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-ink"><ArrowLeft className="h-4 w-4" /> Retour au dashboard</Link>

          {/* Header */}
          <Card className="mb-8 rounded-2xl border-sunrise-500/20 bg-linear-to-r from-sunrise-500/10 to-gleam-400/10 p-8">
            <Chip variant="warm" className="mb-4">👨‍👩‍👧 Espace parent sécurisé</Chip>
            <h1 className="font-display mb-2 text-3xl font-bold md:text-4xl">Espace Parent</h1>
            <p className="text-ink-soft">Suis la progression de {children.length > 0 ? (children.length === 1 ? `ton enfant ${activeChild?.name}` : `tes ${children.length} enfants`) : 'tes enfants'} en toute transparence.</p>
          </Card>

          {/* Children Overview */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {children.map(child => {
              const pct = totalAdventures > 0 ? Math.round((child.completedAdventureSlugs.length / totalAdventures) * 100) : 0;
              return (
                <div key={child.id} className={`cursor-pointer rounded-xl border p-5 transition-all ${child.id === activeChildId ? 'border-sunrise-500 bg-sunrise-500/10' : 'border-line bg-night-850 hover:border-line-lit'}`} onClick={() => selectChild(child.id)}>
                  <div className="mb-4 flex items-center gap-4">
                    <span className="text-4xl" aria-hidden="true">{child.avatar}</span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-lg font-bold">{child.name}</div>
                      <div className="text-xs text-ink-soft">{child.gradeLevel} • {child.age} ans</div>
                      <div className="text-xs text-gold-300">Niveau {child.level}</div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); deleteChild(child.id); }} disabled={busy} aria-label={`Supprimer le profil de ${child.name}`} className="rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-danger-500/20 hover:text-danger-400 disabled:opacity-50"><Trash2 className="h-4 w-4" /></button>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div><div className="text-lg font-bold text-gold-300">{child.xp}</div><div className="text-xs text-ink-faint">XP</div></div>
                    <div><div className="text-lg font-bold text-sunrise-400">{child.badgeSlugs.length}</div><div className="text-xs text-ink-faint">Badges</div></div>
                    <div><div className="text-lg font-bold text-success-400">{child.completedAdventureSlugs.length}</div><div className="text-xs text-ink-faint">Aventures</div></div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-ink-soft">
                    <span>Progression</span><span>{pct}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-night-600"><div className="h-full rounded-full bg-linear-to-r from-sunrise-500 to-gleam-400 transition-all" style={{ width: `${pct}%` }} /></div>
                </div>
              );
            })}
            <button onClick={() => router.push('/auth/signup')} className="flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line-lit bg-night-850 p-5 text-ink-soft transition-all hover:border-sunrise-500/50 hover:text-ink">
              <Plus className="h-8 w-8" /><span className="text-sm font-medium">Ajouter un enfant</span>
            </button>
          </div>

          {/* Global Stats */}
          {children.length > 0 && (
            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { icon: Users, label: 'Enfants', value: String(children.length), color: 'text-sunrise-400' },
                { icon: Zap, label: 'XP Total', value: String(totalXP), color: 'text-gold-300' },
                { icon: BookOpen, label: 'Aventures', value: String(totalAdvs), color: 'text-success-400' },
                { icon: Trophy, label: 'Badges', value: String(totalBadges), color: 'text-sunrise-400' },
              ].map((stat, i) => (
                <div key={i} className="rounded-xl border border-line bg-night-850 p-4 text-center">
                  <stat.icon className={`mx-auto mb-2 h-6 w-6 ${stat.color}`} aria-hidden="true" /><div className="text-2xl font-bold">{stat.value}</div><div className="text-sm text-ink-soft">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Active Child Detail */}
          {activeChild && (
            <>
              {/* This Week Report — calculé depuis adventure_completions */}
              <Card className="mb-8 p-6">
                <h2 className="font-display mb-4 flex items-center gap-2 text-xl font-bold"><BarChart3 className="h-5 w-5 text-sunrise-400" aria-hidden="true" /> Rapport — {activeChild.name}</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div>
                    <div className="mb-3 text-sm text-ink-soft">Cette semaine (7 derniers jours)</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-ink-soft">Aventures terminées</span><span className="font-bold">{weekReport.count}</span></div>
                      <div className="flex justify-between"><span className="text-ink-soft">XP gagné</span><span className="font-bold text-gold-300">+{weekReport.xp} XP</span></div>
                      <div className="flex justify-between"><span className="text-ink-soft">Badges obtenus</span><span className="font-bold text-sunrise-400">{weekReport.badges}</span></div>
                      <div className="flex justify-between"><span className="text-ink-soft">XP total</span><span className="font-bold text-gold-300">{activeChild.xp} XP</span></div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-3 text-sm text-ink-soft">Compétences développées</div>
                    <div className="flex flex-wrap gap-2">
                      {worlds
                        .filter(w => (activeChild.worldXp[w.slug] ?? 0) > 0)
                        .map(w => (
                          <Chip key={w.id} variant="success">{w.icon} {w.name}</Chip>
                        ))}
                      {Object.keys(activeChild.worldXp).length === 0 && <span className="text-sm text-ink-faint">Commence une aventure pour voir tes compétences</span>}
                    </div>
                  </div>
                  <div>
                    <div className="mb-3 text-sm text-ink-soft">Prochaine étape recommandée</div>
                    <div className="rounded-xl border border-line bg-night-900 p-4">
                      <div className="mb-1 flex items-center gap-2">
                        <Target className="h-4 w-4 text-success-400" aria-hidden="true" />
                        <span className="text-sm font-semibold">Continuer l'aventure</span>
                      </div>
                      <p className="text-xs text-ink-soft">Il reste {totalAdventures - activeChild.completedAdventureSlugs.length} aventures pour débloquer tous les mondes.</p>
                      <Link href="/dashboard" className="mt-3 inline-block text-xs font-medium text-sunrise-400 hover:text-sunrise-300">Aller au dashboard →</Link>
                    </div>
                  </div>
                </div>
              </Card>

              {/* World Progress */}
              <Card className="mb-8 p-6">
                <h2 className="font-display mb-4 flex items-center gap-2 text-xl font-bold"><TrendingUp className="h-5 w-5 text-sunrise-400" aria-hidden="true" /> Progression par monde</h2>
                <div className="space-y-3">
                  {worlds.map(world => {
                    const total = world.adventures.length;
                    const done = world.adventures.filter(av => activeChild.completedAdventureSlugs.includes(av.slug)).length;
                    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                    return (
                      <div key={world.id} className="flex items-center gap-4">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-lg ${world.gradient}`} aria-hidden="true">{world.icon}</div>
                        <div className="flex-1">
                          <div className="mb-1 flex justify-between text-sm"><span className="font-medium">{world.name}</span><span className="text-ink-soft">{done}/{total}</span></div>
                          <div className="h-2 overflow-hidden rounded-full bg-night-600"><div className="h-full rounded-full bg-linear-to-r from-sunrise-500 to-gleam-400 transition-all" style={{ width: `${pct}%` }} /></div>
                        </div>
                        <span className="w-12 text-right text-sm font-medium text-sunrise-400">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Badges */}
              <Card className="mb-8 p-6">
                <h2 className="font-display mb-4 flex items-center gap-2 text-xl font-bold"><Trophy className="h-5 w-5 text-sunrise-400" aria-hidden="true" /> Badges de {activeChild.name}</h2>
                <div className="flex flex-wrap gap-3">
                  {activeChild.badgeSlugs.length > 0 ? activeChild.badgeSlugs.map(slug => {
                    const badge = badges.find(b => b.slug === slug);
                    if (!badge) return null;
                    return (
                      <div key={slug} className="flex min-w-[80px] flex-col items-center gap-1 rounded-xl border border-line bg-night-900 p-3">
                        <span className="text-2xl" aria-hidden="true">{badge.icon}</span>
                        <span className="text-center text-xs font-medium">{badge.name}</span>
                      </div>
                    );
                  }) : <p className="text-sm text-ink-soft">Aucun badge obtenu pour le moment.</p>}
                </div>
              </Card>

              {/* Billing — prix unifiés 5 000 / 35 000 FCFA */}
              <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="p-6">
                  <h2 className="font-display mb-4 flex items-center gap-2 text-xl font-bold"><CreditCard className="h-5 w-5 text-success-400" aria-hidden="true" /> Abonnement & Paiement</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg border border-success-500/20 bg-success-500/10 p-3">
                      <div className="flex items-center gap-3"><span className="text-2xl" aria-hidden="true">🌱</span><div><div className="text-sm font-semibold">Plan Starter</div><div className="text-xs text-ink-soft">7 jours d'essai gratuit</div></div></div>
                      <span className="font-bold text-success-300">Gratuit</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-line bg-night-900 p-3">
                      <div className="flex items-center gap-3"><span className="text-2xl" aria-hidden="true">⚡</span><div><div className="text-sm font-semibold">Plan Explorateur</div><div className="text-xs text-ink-soft">5 000 FCFA/mois</div></div></div>
                      <Link href="/pricing" className={buttonVariants({ variant: 'secondary', size: 'sm' })}>Choisir</Link>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-line bg-night-900 p-3">
                      <div className="flex items-center gap-3"><span className="text-2xl" aria-hidden="true">👑</span><div><div className="text-sm font-semibold">Plan Pro</div><div className="text-xs text-ink-soft">35 000 FCFA/an</div></div></div>
                      <Link href="/pricing" className={buttonVariants({ variant: 'secondary', size: 'sm' })}>Choisir</Link>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-ink-faint">
                    <span>Paiements: 🟠 Orange Money</span><span>🟡 MTN MoMo</span><span>🔵 Wave</span>
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="font-display mb-4 flex items-center gap-2 text-xl font-bold"><Shield className="h-5 w-5 text-success-400" aria-hidden="true" /> Confidentialité & Sécurité</h2>
                  <ul className="space-y-3 text-sm text-ink-soft">
                    {['Données minimales conformes RGPD', 'Pas de publicité ciblée', 'Données chiffrées', 'Contrôle parental complet', 'Aucune donnée vendue', 'Suppression possible à tout moment'].map((item, i) => (
                      <li key={i} className="flex items-start gap-3"><span className="font-bold text-success-400" aria-hidden="true">✓</span>{item}</li>
                    ))}
                  </ul>
                  <div className="mt-4 rounded-lg border border-gleam-500/30 bg-gleam-500/10 p-3 text-xs text-gleam-300">
                    🔒 Les données de tes enfants sont protégées. Tu peux demander leur suppression à tout moment.
                  </div>
                </Card>
              </div>

              {/* Reports & Export */}
              <Card className="p-6">
                <h2 className="font-display mb-4 flex items-center gap-2 text-xl font-bold"><Download className="h-5 w-5 text-info-400" aria-hidden="true" /> Rapports & Export</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[
                    { icon: '📊', title: 'Rapport mensuel', desc: 'Télécharge le rapport de progression' },
                    { icon: '🏆', title: 'Certificats', desc: 'Génère des certificats pour les niveaux atteints' },
                    { icon: '💬', title: 'Feedback IA', desc: 'Reçois des recommandations personnalisées' },
                  ].map((item, i) => (
                    <button key={i} className="rounded-xl border border-line bg-night-900 p-4 text-left transition-colors hover:border-line-lit">
                      <div className="mb-2 text-2xl" aria-hidden="true">{item.icon}</div>
                      <div className="text-sm font-semibold">{item.title}</div>
                      <div className="mt-1 text-xs text-ink-soft">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </Card>
            </>
          )}
        </div>
      </section>
    </div>
    </PageTransition>
  );
}
