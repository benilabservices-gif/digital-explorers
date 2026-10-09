'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Calendar, Trophy, Zap, Crown, CheckCircle, RefreshCw, Target, Flame } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageTransition } from '@/components/motion/page-transition';
import { createClient } from '@/lib/supabase/client';
import { fetchChildrenWithProgress, findActiveChild, type ChildData } from '@/lib/children';
import { fetchChallenges, type ChallengeInfo } from '@/lib/content-queries';
import { getActiveChildId, setActiveChildId as persistActiveChildId } from '@/lib/active-child';
import { dailyChallengeIndex, weeklyChallengeIndex } from '@/lib/game';

// ─────────────────────────────────────────────────────────────────────────────
// Défis & quêtes — îlot client (mutation /api/challenges/complete, overlay de
// résultat, sélecteur d'enfant). Habillage tokens-only : quotidien = ambre
// gleam, hebdomadaire = or (récompense), erreurs = danger.
// ─────────────────────────────────────────────────────────────────────────────

interface CompletionResult {
  alreadyCompleted: boolean;
  xpAwarded: number;
  newXp: number;
  newLevel: number;
  leveledUp: boolean;
}

export default function ChallengesPage() {
  const [children, setChildren] = useState<ChildData[]>([]);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [challenges, setChallenges] = useState<ChallengeInfo[]>([]);
  /** complétions de défis par enfant : child_id -> slugs de défis terminés */
  const [doneByChild, setDoneByChild] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [submittingSlug, setSubmittingSlug] = useState<string | null>(null);
  const [result, setResult] = useState<CompletionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      if (cancelled) return;

      const kids = await fetchChildrenWithProgress(supabase);
      const challengeRows = await fetchChallenges(supabase);

      const done: Record<string, string[]> = {};
      if (kids.length > 0) {
        const { data: completions } = await supabase
          .from('challenge_completions')
          .select('child_id,challenges(slug)')
          .in('child_id', kids.map((k) => k.id));
        for (const row of completions ?? []) {
          if (!row.challenges) continue;
          (done[row.child_id] ??= []).push(row.challenges.slug);
        }
      }
      if (cancelled) return;

      setChildren(kids);
      setChallenges(challengeRows);
      setDoneByChild(done);
      const pointer = getActiveChildId();
      setActiveChildId(kids.length > 0 ? (kids.find((k) => k.id === pointer)?.id ?? kids[0].id) : null);
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, []);

  // Overlay de résultat : focus piégé au montage + Escape pour fermer (a11y).
  useEffect(() => {
    if (!result) return;
    overlayRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setResult(null);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [result]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-night-950"><div className="h-12 w-12 animate-spin rounded-full border-4 border-sunrise-500 border-t-transparent" /></div>;
  }

  const child = findActiveChild(children, activeChildId);
  const doneSlugs = new Set(child ? (doneByChild[child.id] ?? []) : []);
  // Rotation déterministe par date — mêmes indices que le dashboard.
  const dailies = challenges.filter((c) => c.type === 'daily');
  const weeklies = challenges.filter((c) => c.type === 'weekly');
  const daily = dailies.length > 0 ? dailies[dailyChallengeIndex(new Date(), dailies.length)] : null;
  const weekly = weeklies.length > 0 ? weeklies[weeklyChallengeIndex(new Date(), weeklies.length)] : null;

  function selectChild(id: string) {
    setActiveChildId(id);
    persistActiveChildId(id);
  }

  async function markDone(challenge: ChallengeInfo) {
    if (!child || submittingSlug) return;
    setSubmittingSlug(challenge.slug);
    setError(null);
    try {
      const res = await fetch('/api/challenges/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId: child.id, challengeSlug: challenge.slug }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error === 'plan_limit' ? 'Limite du plan atteinte.' : "Impossible d'enregistrer ce défi. Réessaie.");
        return;
      }
      const r = data as CompletionResult;
      const childId = child.id;
      setChildren((prev) => prev.map((c) => (c.id === childId ? { ...c, xp: r.newXp, level: r.newLevel } : c)));
      setDoneByChild((prev) => ({ ...prev, [childId]: [...(prev[childId] ?? []), challenge.slug] }));
      setResult(r);
    } catch {
      setError("Impossible d'enregistrer ce défi. Réessaie.");
    } finally {
      setSubmittingSlug(null);
    }
  }

  function challengeCard(c: ChallengeInfo, featured: 'daily' | 'weekly' | null) {
    const done = doneSlugs.has(c.slug);
    const isDaily = c.type === 'daily';
    const submitting = submittingSlug === c.slug;
    return (
      <div
        key={c.slug}
        className={`rounded-2xl border p-6 ${
          featured === 'daily'
            ? 'border-gleam-500/20 bg-linear-to-r from-gleam-500/10 to-gold-400/10'
            : featured === 'weekly'
              ? 'border-gold-400/20 bg-linear-to-r from-gold-400/10 to-gold-300/10'
              : 'border-line bg-night-850'
        }`}
      >
        <div className="mb-3 flex items-center gap-2">
          {isDaily ? <Calendar className="h-5 w-5 text-gleam-400" /> : <Trophy className="h-5 w-5 text-gold-400" />}
          <span className={`text-sm font-semibold uppercase tracking-wider ${isDaily ? 'text-gleam-300' : 'text-gold-300'}`}>
            {featured === 'daily' ? 'Défi du jour' : featured === 'weekly' ? 'Quête de la semaine' : isDaily ? 'Défi quotidien' : 'Quête hebdomadaire'}
          </span>
          {featured && <span className="ml-auto flex items-center gap-1 text-xs text-ink-faint"><Flame className="h-3.5 w-3.5 text-gold-400" /> En vedette</span>}
        </div>
        <h3 className="mb-2 text-xl font-bold">{c.title}</h3>
        <p className="mb-4 whitespace-pre-line text-sm text-ink-soft">{c.description}</p>
        <div className="mb-4 flex items-center gap-3 text-xs text-ink-faint">
          <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5 text-gold-300" /> +{c.xpReward} XP</span>
          {c.worldSlug && (
            <Link href={`/worlds/${c.worldSlug}`} className="text-sunrise-400 hover:text-sunrise-300">Explorer le monde →</Link>
          )}
        </div>
        {!child ? (
          <Link href="/auth/signup" className={buttonVariants({ size: 'sm' })}>Créer un profil enfant</Link>
        ) : done ? (
          <div className="flex items-center gap-2 text-sm font-semibold text-success-300"><CheckCircle className="h-5 w-5" /> Terminé — +{c.xpReward} XP gagnés</div>
        ) : (
          <button
            onClick={() => markDone(c)}
            disabled={submitting}
            className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 ${
              isDaily
                ? 'border-gleam-500/30 bg-gleam-500/10 text-gleam-300 hover:bg-gleam-500/20'
                : 'border-gold-400/30 bg-gold-400/10 text-gold-300 hover:bg-gold-400/20'
            }`}
          >
            {submitting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <CheckCircle className="h-4 w-4" />}
            Marquer comme terminé (+{c.xpReward} XP)
          </button>
        )}
      </div>
    );
  }

  return (
    <PageTransition>
    <div className="min-h-screen bg-night-950 text-ink">
      <section className="px-6 pb-8 pt-28">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="mb-1 text-sm text-ink-faint">Gagne de l'XP chaque jour</p>
              <h1 className="font-display text-3xl font-bold md:text-4xl">Défis & Quêtes</h1>
              <p className="mt-2 flex items-center gap-2 text-sm text-ink-faint"><RefreshCw className="h-4 w-4 text-gleam-400" /> Rotation quotidienne et hebdomadaire — un nouveau défi chaque jour !</p>
            </div>
            {children.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {children.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => selectChild(c.id)}
                    className={`flex min-w-[140px] items-center gap-3 rounded-2xl border px-4 py-3 transition-all ${c.id === activeChildId ? 'border-sunrise-500 bg-sunrise-500/10' : 'border-line bg-night-850 hover:border-line-lit'}`}
                  >
                    <span className="text-2xl">{c.avatar}</span>
                    <div className="text-left">
                      <div className="text-sm font-bold">{c.name}</div>
                      <div className="text-xs text-gold-300">{c.xp} XP</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-danger-500/30 bg-danger-500/10 px-5 py-3 text-sm text-danger-300">{error}</div>
          )}

          {/* Pas d'enfant */}
          {!child && (
            <Card className="mb-8 p-6 text-center">
              <p className="mb-4 text-ink-soft">Crée d'abord le profil de ton explorateur pour relever les défis.</p>
              <Link href="/auth/signup" className={buttonVariants()}>Créer un profil enfant</Link>
            </Card>
          )}

          {/* Défis en vedette (rotation du jour / de la semaine) */}
          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {daily ? challengeCard(daily, 'daily') : <Card className="p-6 text-sm text-ink-soft">Aucun défi quotidien disponible.</Card>}
            {weekly ? challengeCard(weekly, 'weekly') : <Card className="p-6 text-sm text-ink-soft">Aucune quête hebdomadaire disponible.</Card>}
          </div>

          {/* Tous les défis */}
          {challenges.length > 0 && (
            <div>
              <h2 className="font-display mb-4 flex items-center gap-2 text-xl font-bold"><Target className="h-5 w-5 text-sunrise-400" /> Tous les défis ({challenges.length})</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {challenges.map((c) => challengeCard(c, null))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* REWARD OVERLAY — dialog modal : focus initial + Escape pour fermer */}
      {result && (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Défi terminé"
          tabIndex={-1}
          className="fixed inset-0 z-50 flex items-center justify-center bg-night-950/80 p-6 focus:outline-none"
        >
          <Card variant="raised" className="w-full max-w-sm rounded-3xl p-8 text-center">
            <div className="mb-4 text-6xl" aria-hidden="true">🎉</div>
            {result.alreadyCompleted ? (
              <p className="mb-4 text-ink-soft">Tu avais déjà relevé ce défi — aucun XP supplémentaire.</p>
            ) : (
              <>
                {result.leveledUp && (
                  <div className="mb-4 flex items-center justify-center gap-2 text-gold-300">
                    <Crown className="h-6 w-6" /><span className="text-xl font-bold">Niveau {result.newLevel} atteint !</span>
                  </div>
                )}
                <div className="mb-2 flex items-center justify-center gap-2 text-gold-300">
                  <Zap className="h-5 w-5" />
                  <span className="text-lg font-bold">+{result.xpAwarded} XP</span>
                </div>
                <div className="mb-6 text-sm text-ink-soft">Total : {result.newXp} XP — Niveau {result.newLevel}</div>
              </>
            )}
            <div className="flex gap-3">
              <Link href="/dashboard" className={`${buttonVariants()} flex-1`}>Dashboard</Link>
              <Button variant="secondary" onClick={() => setResult(null)} className="flex-1">Continuer</Button>
            </div>
          </Card>
        </div>
      )}

    </div>
    </PageTransition>
  );
}
