'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Award, FolderOpen, Zap, Crown, Rocket, Plus, UserPlus, Gift, Sparkles, Target, Calendar, Trophy, GitBranch, ChevronRight } from 'lucide-react';
import { SKILL_TREE } from '@/data/challenges';
import { isWorldReady } from '@/data/content';
import AICoach from '@/components/AICoach';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatTile } from '@/components/ui/stat-tile';
import { EmptyState } from '@/components/ui/empty-state';
import { createClient } from '@/lib/supabase/client';
import { fetchChildrenWithProgress, findActiveChild, type ChildData } from '@/lib/children';
import {
  fetchBadges,
  fetchCurrentPlan,
  fetchChallenges,
  fetchDigitalBridges,
  fetchWorldsWithAdventures,
  type PlanInfo,
  type WorldWithAdventures,
} from '@/lib/content-queries';
import { getActiveChildId, setActiveChildId as persistActiveChildId } from '@/lib/active-child';
import { TESTIDS } from '@/lib/testids';
import { dailyChallengeIndex, getLevelTitle, weeklyChallengeIndex, type BadgeLike } from '@/lib/game';

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard enfant/parent — îlot client : un seul effet de chargement
// (children + mondes + badges + bridges + défis + plan), pointeur d'enfant
// actif en cookie. Habillage tokens-only « Carnet de l'Explorateur » :
// or = XP/niveaux (récompenses), corail = marque/badges, vert = progression.
// Contrats e2e verbatim : « Tableau de bord parental », « Ajouter un enfant »,
// « 👋 Bonjour {name} ! », « {xp} XP », « {done}/{total} aventures ».
// ─────────────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const [children, setChildren] = useState<ChildData[]>([]);
  const [worlds, setWorlds] = useState<WorldWithAdventures[]>([]);
  const [badges, setBadges] = useState<BadgeLike[]>([]);
  const [bridges, setBridges] = useState<{ id: string; name: string; description: string; targetUrl: string; icon: string }[]>([]);
  const [challenges, setChallenges] = useState<{ id: string; type: 'daily' | 'weekly'; slug: string; title: string; description: string; worldSlug: string | null; xpReward: number }[]>([]);
  const [plan, setPlan] = useState<PlanInfo | null>(null);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      if (cancelled) return;

      const [kids, worldRows, badgeRows, bridgeRows, challengeRows, planInfo] = await Promise.all([
        fetchChildrenWithProgress(supabase),
        fetchWorldsWithAdventures(supabase),
        fetchBadges(supabase),
        fetchDigitalBridges(supabase),
        fetchChallenges(supabase),
        fetchCurrentPlan(supabase, user.id),
      ]);
      if (cancelled) return;

      setChildren(kids);
      setWorlds(worldRows);
      setBadges(badgeRows);
      setBridges(bridgeRows);
      setChallenges(challengeRows);
      setPlan(planInfo);
      const pointer = getActiveChildId();
      setActiveChildId(kids.length > 0 ? (kids.find(k => k.id === pointer)?.id ?? kids[0].id) : null);
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [router]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-night-950"><div className="h-12 w-12 animate-spin rounded-full border-4 border-sunrise-500 border-t-transparent" /></div>;
  }

  const child = findActiveChild(children, activeChildId);
  // MVP : seuls les mondes « prêts » (contenu importé) comptent dans le total.
  const totalAdventures = worlds.reduce((sum, w) => sum + (isWorldReady(w.slug) ? w.adventures.length : 0), 0);

  // Défis : rotation déterministe par date depuis la table challenges.
  const dailies = challenges.filter(c => c.type === 'daily');
  const weeklies = challenges.filter(c => c.type === 'weekly');
  const daily = dailies.length > 0 ? dailies[dailyChallengeIndex(new Date(), dailies.length)] : null;
  const weekly = weeklies.length > 0 ? weeklies[weeklyChallengeIndex(new Date(), weeklies.length)] : null;

  function addChild() {
    router.push('/auth/signup');
  }

  function selectChild(id: string) {
    setActiveChildId(id);
    persistActiveChildId(id); // pointeur cookie (ID uniquement)
  }

  const totalDone = child?.completedAdventureSlugs.length ?? 0;
  const totalXp = child?.xp ?? 0;
  const childBadges = child ? child.badgeSlugs : [];
  const totalLevel = child?.level ?? 1;

  // Prochaine aventure suggérée : première non terminée, par ordre des mondes.
  const nextAct = (() => {
    if (!child) return null;
    for (const world of worlds) {
      if (!isWorldReady(world.slug)) continue;
      const unfinished = world.adventures.filter(adv => !child.completedAdventureSlugs.includes(adv.slug));
      if (unfinished.length > 0) return { world, adventure: unfinished[0] };
    }
    return null;
  })();

  return (
    <div className="min-h-screen bg-night-950 text-ink">
      <section className="px-6 pb-8 pt-28">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm text-ink-faint">Tableau de bord parental</p>
              <h1 className="font-display text-3xl font-bold md:text-4xl">Mes enfants</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={addChild} data-testid={TESTIDS.child.add} className="text-sm">
                <Plus className="h-4 w-4" /> Ajouter un enfant
              </Button>
            </div>
          </div>

          {/* Children selector */}
          <div data-testid={TESTIDS.child.selector} className="mb-8 flex gap-3 overflow-x-auto pb-2">
            {children.map(c => (
              <button key={c.id} onClick={() => selectChild(c.id)}
                className={`flex min-w-[160px] items-center gap-3 rounded-2xl border px-4 py-3 transition-all ${c.id === activeChildId ? 'border-sunrise-500 bg-sunrise-500/10' : 'border-line bg-night-850 hover:border-line-lit'}`}>
                <span className="text-3xl">{c.avatar}</span>
                <div className="text-left">
                  <div className="text-sm font-bold">{c.name}</div>
                  <div className="text-xs text-ink-soft">{c.gradeLevel} • Nv.{c.level}</div>
                  <div className="text-xs text-gold-300">{c.xp} XP</div>
                </div>
              </button>
            ))}
            <button onClick={addChild} className="flex min-w-[120px] items-center gap-2 rounded-2xl border border-dashed border-line-lit px-4 py-3 text-ink-faint transition-all hover:border-sunrise-500/50 hover:text-ink">
              <UserPlus className="h-5 w-5" /> <span className="text-sm">Ajouter</span>
            </button>
          </div>

          {!child ? (
            <EmptyState
              className="my-10"
              icon={<span className="text-3xl">👨‍👩‍👧</span>}
              title="Aucun enfant ajouté"
              description="Commence par ajouter ton enfant pour suivre sa progression."
              action={<Button onClick={addChild} data-testid={TESTIDS.child.add}>Ajouter un enfant</Button>}
            />
          ) : (
            <>
              {/* Hero */}
              <Card className="relative mb-8 overflow-hidden rounded-2xl border-sunrise-500/20 bg-linear-to-r from-sunrise-500/10 to-gleam-400/10 p-6 md:p-8">
                <div className="orb absolute -top-1/2 right-0 h-64 w-64 translate-x-1/2 bg-sunrise-500/10" aria-hidden="true" />
                <div className="relative flex items-center gap-6">
                  <div className="text-6xl">{child.avatar}</div>
                  <div className="flex-1">
                    <p data-testid={TESTIDS.dashboard.greeting} className="mb-1 text-sm text-sunrise-300">👋 Bonjour {child.name} !</p>
                    <h2 className="font-display mb-1 text-2xl font-bold md:text-3xl">{getLevelTitle(child.xp)} — Niveau {child.level}</h2>
                    <p className="text-ink-soft">{child.gradeLevel} • {child.age} ans • Phase {child.phase}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                      <span className="flex items-center gap-1"><Crown className="h-4 w-4 text-gold-300" /> Nv.{child.level}</span>
                      <span data-testid={TESTIDS.dashboard.xp} className="flex items-center gap-1"><Zap className="h-4 w-4 text-gold-300" /> {child.xp} XP</span>
                      <span className="flex items-center gap-1"><Award className="h-4 w-4 text-sunrise-400" /> {childBadges.length} badges</span>
                      <span data-testid={TESTIDS.dashboard.progress} className="flex items-center gap-1"><TrendingUp className="h-4 w-4 text-success-400" /> {totalDone}/{totalAdventures} aventures</span>
                    </div>
                  </div>
                  <div className="hidden text-right md:block">
                    <div className="font-display text-4xl font-bold text-gold-300">Nv.{child.level}</div>
                    <div className="text-sm text-ink-soft">{child.xp} / {child.level * 500} XP</div>
                    <div className="mt-2 h-2 w-32 overflow-hidden rounded-full bg-night-600"><div className="h-full rounded-full bg-linear-to-r from-gold-400 to-gold-300" style={{ width: `${((child.xp % 500) / 500) * 100}%` }} /></div>
                  </div>
                </div>
              </Card>

              {/* NEXT ACTION — PRIMARY CTA */}
              {nextAct && (
                <div className="mb-8">
                  <div className="flex flex-col items-start gap-4 rounded-2xl border border-success-500/20 bg-linear-to-r from-success-500/10 to-success-400/10 p-6 sm:flex-row sm:items-center">
                    <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-3xl ${nextAct.world.gradient}`}>{nextAct.world.icon}</div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <Target className="h-5 w-5 text-success-400" />
                        <span className="text-sm font-semibold uppercase tracking-wider text-success-300">Ta prochaine mission</span>
                      </div>
                      <h3 className="mb-1 text-xl font-bold">{nextAct.adventure.title}</h3>
                      <p className="text-sm text-ink-soft">{nextAct.adventure.description}</p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-ink-faint">
                        <span className="text-gold-300">+{nextAct.adventure.xpReward} XP</span>
                        <span>•</span>
                        <span>{nextAct.world.name}</span>
                      </div>
                    </div>
                    <Link href={`/adventure/${nextAct.adventure.slug}`} className={buttonVariants()}>
                      <Sparkles className="h-5 w-5" /> Continuer
                    </Link>
                  </div>
                </div>
              )}

              {/* DAILY CHALLENGE (rotation depuis la table challenges) */}
              <div className="mb-8">
                <div className="rounded-2xl border border-gleam-500/20 bg-linear-to-r from-gleam-500/10 to-gold-400/10 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gleam-400" />
                    <span className="text-sm font-semibold uppercase tracking-wider text-gleam-300">Défi du jour</span>
                  </div>
                  <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <p className="flex-1 text-ink-soft">{daily ? `${daily.title} — ${daily.description}` : "Aucun défi disponible pour le moment."}</p>
                    {daily && (
                      <Link href={daily.worldSlug ? `/worlds/${daily.worldSlug}` : '/challenges'} className={buttonVariants({ variant: 'secondary', size: 'sm' })}>
                        Relever le défi (+{daily.xpReward} XP)
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* STATS */}
              <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                <StatTile icon={<Crown className="h-5 w-5 text-gold-300" />} label="Niveau" value={`Nv. ${totalLevel}`} tone="gold" />
                <StatTile icon={<Zap className="h-5 w-5 text-gold-300" />} label="XP Total" value={`${totalXp} XP`} tone="gold" />
                <StatTile icon={<Award className="h-5 w-5 text-sunrise-400" />} label="Badges" value={`${childBadges.length}/${badges.length}`} tone="brand" />
                <StatTile icon={<FolderOpen className="h-5 w-5 text-ink-soft" />} label="Aventures" value={`${totalDone}/${totalAdventures}`} tone="muted" />
              </div>

              {/* WORLDS PROGRESS + WEEKLY QUEST */}
              <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="p-6 lg:col-span-2">
                  <h2 className="font-display mb-4 flex items-center gap-2 text-xl font-bold"><TrendingUp className="h-5 w-5 text-sunrise-400" /> Progression par monde</h2>
                  <div className="space-y-3">
                    {worlds.map(world => {
                      const ready = isWorldReady(world.slug);
                      const total = world.adventures.length;
                      const done = world.adventures.filter(av => child.completedAdventureSlugs.includes(av.slug)).length;
                      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                      const locked = !ready || (child.xp < 100 && world.phase !== 'explorer');
                      return (
                        <div key={world.id} className={`rounded-xl border border-line bg-night-900 p-4 transition-colors ${locked ? 'opacity-50' : 'hover:border-line-lit'} ${!ready ? 'grayscale' : ''}`}>
                          <div className="mb-3 flex items-center gap-4">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-lg ${world.gradient}`}>{world.icon}</div>
                            <div className="flex-1">
                              <div className="text-sm font-bold">{world.name}</div>
                              <div className="text-xs text-ink-soft">{ready ? `${done}/${total} aventures${locked ? ' 🔒' : ''}` : 'Bientôt disponible 🔒'}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-sunrise-400">{ready ? `${pct}%` : '—'}</div>
                              {ready && !locked && done < total && (
                                <Link href={`/adventure/${world.adventures.find(a => !child.completedAdventureSlugs.includes(a.slug))?.slug}`} className="text-xs text-ink-faint hover:text-ink">Continuer →</Link>
                              )}
                            </div>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-night-600"><div className="h-full rounded-full bg-linear-to-r from-sunrise-500 to-gleam-400 transition-all" style={{ width: `${pct}%` }} /></div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                <div className="space-y-6">
                  {/* Weekly Quest (rotation depuis la table challenges) */}
                  <Card className="p-6">
                    <h2 className="font-display mb-4 flex items-center gap-2 text-xl font-bold"><Trophy className="h-5 w-5 text-gold-400" /> Quête de la semaine</h2>
                    <div className="space-y-3">
                      {weekly ? (
                        <div className="rounded-xl border border-line bg-night-900 p-3">
                          <div className="mb-1 text-sm font-semibold">{weekly.title}</div>
                          <div className="mb-2 text-xs text-ink-soft">{weekly.description}</div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gold-300">+{weekly.xpReward} XP</span>
                            <Link href="/challenges" className="text-sunrise-400 hover:text-sunrise-300">Voir les défis →</Link>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-ink-soft">Aucune quête disponible.</p>
                      )}
                    </div>
                  </Card>

                  {/* Digital Bridge (table digital_bridges) */}
                  <Card className="p-6">
                    <h2 className="font-display mb-4 flex items-center gap-2 text-xl font-bold"><Rocket className="h-5 w-5 text-sunrise-400" /> Digital Bridge</h2>
                    <div className="space-y-3">
                      {bridges.map(bridge => (
                        <a key={bridge.id} href={bridge.targetUrl} target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-line bg-night-900 p-3 transition-all hover:border-sunrise-400/30 hover:bg-night-700">
                          <div className="mb-1 text-lg">{bridge.icon}</div>
                          <div className="text-sm font-semibold">{bridge.name}</div>
                          <div className="text-xs text-ink-soft">{bridge.description}</div>
                        </a>
                      ))}
                    </div>
                  </Card>

                  {/* Plan (depuis subscriptions) */}
                  <div className="rounded-xl border border-gleam-500/20 bg-linear-to-br from-gleam-500/10 to-gold-400/10 p-5">
                    <div className="mb-2 flex items-center gap-2"><Gift className="h-5 w-5 text-gleam-400" /><span className="font-bold">Plan actuel</span></div>
                    <div className="font-display mb-1 text-2xl font-bold text-gleam-300">
                      {plan ? `${plan.name}${plan.priceFcfa > 0 ? ` — ${plan.priceFcfa.toLocaleString('fr-FR')} FCFA/${plan.period}` : ' — Gratuit'}` : 'Starter — Gratuit'}
                    </div>
                    <p className="mb-3 text-xs text-ink-soft">
                      {plan && plan.code !== 'starter'
                        ? `Actif jusqu'au ${plan.expiresAt ? new Date(plan.expiresAt).toLocaleDateString('fr-FR') : '—'}.`
                        : 'Accès limité. Passe à Explorateur pour tout débloquer.'}
                    </p>
                    <Link href="/pricing" className={buttonVariants({ variant: 'secondary', size: 'sm', className: 'w-full' })}>Voir les tarifs</Link>
                  </div>
                </div>
              </div>

              {/* SKILL TREE — XP réel par monde (child.worldXp) */}
              <div className="mb-8">
                <h2 className="font-display mb-4 flex items-center gap-2 text-xl font-bold"><GitBranch className="h-5 w-5 text-success-400" /> Arbre des compétences</h2>
                <Card className="p-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {worlds.slice(0, 3).map(world => {
                      const skills = SKILL_TREE[world.slug] || [];
                      const worldXp = child.worldXp[world.slug] ?? 0;
                      return (
                        <div key={world.id} className="rounded-xl border border-line bg-night-900 p-4">
                          <div className="mb-3 flex items-center gap-2">
                            <span className="text-xl">{world.icon}</span>
                            <span className="text-sm font-bold">{world.name}</span>
                            <span className="ml-auto text-xs text-gold-300">{worldXp} XP</span>
                          </div>
                          <div className="space-y-2">
                            {skills.map(skill => {
                              const levelIdx = worldXp >= 300 ? 3 : worldXp >= 150 ? 2 : worldXp >= 50 ? 1 : 0;
                              return (
                                <div key={skill.id} className="flex items-center gap-2">
                                  <span className="text-sm">{skill.icon}</span>
                                  <span className="flex-1 text-xs text-ink-soft">{skill.name}</span>
                                  <div className="flex gap-0.5">
                                    {skill.levels.map((_, i) => (
                                      <div key={i} className={`h-2 w-2 rounded-full ${i <= levelIdx ? 'bg-sunrise-500' : 'bg-night-600'}`} />
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>

              {/* BADGES (depuis la table badges) */}
              <div className="mb-8">
                <h2 className="font-display mb-4 flex items-center gap-2 text-xl font-bold"><span aria-hidden="true">🏆</span> Badges obtenus ({childBadges.length}/{badges.length})</h2>
                <Card className="p-5">
                  {childBadges.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {childBadges.map(slug => {
                        const badge = badges.find(b => b.slug === slug);
                        if (!badge) return null;
                        return (
                          <Badge key={slug} rarity={badge.rarity}>
                            <span aria-hidden="true">{badge.icon}</span> {badge.name}
                          </Badge>
                        );
                      })}
                    </div>
                  ) : (
                    <EmptyState
                      icon={<Award className="h-7 w-7 text-gold-400" />}
                      title="Aucun badge pour le moment."
                      description="Termine des aventures pour en gagner !"
                    />
                  )}
                </Card>
              </div>

              {/* Quick Adventures */}
              <div>
                <h2 className="font-display mb-4 flex items-center gap-2 text-xl font-bold"><span aria-hidden="true">🎯</span> Continuer l'aventure</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {worlds.filter(world => isWorldReady(world.slug)).flatMap(world =>
                    world.adventures.filter(adv => !child.completedAdventureSlugs.includes(adv.slug)).slice(0, 2).map(adv => (
                      <Link key={`${world.slug}-${adv.slug}`} href={`/adventure/${adv.slug}`} className="group flex items-center gap-4 rounded-xl border border-line bg-night-850 p-4 transition-all hover:border-line-lit hover:bg-night-800">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-2xl ${world.gradient}`}>{world.icon}</div>
                        <div className="min-w-0 flex-1"><div className="mb-0.5 text-xs text-ink-faint">{world.name}</div><div className="truncate font-semibold">{adv.title}</div><div className="truncate text-sm text-ink-soft">{adv.description}</div></div>
                        <div className="shrink-0 text-right"><div className="text-sm font-medium text-gold-300">+{adv.xpReward} XP</div><ChevronRight className="h-5 w-5 text-ink-faint transition-colors group-hover:text-sunrise-400" /></div>
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
    </div>
  );
}
