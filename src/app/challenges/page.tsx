'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Calendar, Trophy, Zap, Crown, CheckCircle, RefreshCw, Target, Flame } from 'lucide-react';
import Nav from '@/components/Nav';
import { createClient } from '@/lib/supabase/client';
import { fetchChildrenWithProgress, findActiveChild, type ChildData } from '@/lib/children';
import { fetchChallenges, type ChallengeInfo } from '@/lib/content-queries';
import { getActiveChildId, setActiveChildId as persistActiveChildId } from '@/lib/active-child';
import { dailyChallengeIndex, weeklyChallengeIndex } from '@/lib/game';

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
  const [auth, setAuth] = useState(false);
  const [submittingSlug, setSubmittingSlug] = useState<string | null>(null);
  const [result, setResult] = useState<CompletionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setAuth(false); setLoading(false); return; }
      if (cancelled) return;
      setAuth(true);

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

  if (loading) {
    return <div className="min-h-screen bg-[#060810] flex items-center justify-center"><div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!auth) {
    return (
      <div className="min-h-screen bg-[#060810] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-6"><Target className="w-10 h-10 text-amber-400" /></div>
          <h1 className="font-display text-3xl font-bold mb-4">Accès réservé</h1>
          <p className="text-gray-400 mb-8">Connecte-toi pour voir les défis et gagner de l&apos;XP.</p>
          <Link href="/auth/login"><button className="px-8 py-3 bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] rounded-full font-semibold hover:opacity-90">Se connecter</button></Link>
        </div>
      </div>
    );
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
        className={`rounded-2xl p-6 border ${
          featured === 'daily'
            ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20'
            : featured === 'weekly'
              ? 'bg-gradient-to-r from-yellow-500/10 to-amber-600/10 border-yellow-500/20'
              : 'bg-[#111827] border-white/5'
        }`}
      >
        <div className="flex items-center gap-2 mb-3">
          {isDaily ? <Calendar className="w-5 h-5 text-amber-400" /> : <Trophy className="w-5 h-5 text-yellow-400" />}
          <span className={`text-sm font-semibold uppercase tracking-wider ${isDaily ? 'text-amber-300' : 'text-yellow-300'}`}>
            {featured === 'daily' ? 'Défi du jour' : featured === 'weekly' ? 'Quête de la semaine' : isDaily ? 'Défi quotidien' : 'Quête hebdomadaire'}
          </span>
          {featured && <span className="ml-auto text-xs text-gray-500 flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-orange-400" /> En vedette</span>}
        </div>
        <h3 className="text-xl font-bold mb-2">{c.title}</h3>
        <p className="text-gray-400 text-sm mb-4 whitespace-pre-line">{c.description}</p>
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-violet-400" /> +{c.xpReward} XP</span>
          {c.worldSlug && (
            <Link href={`/worlds/${c.worldSlug}`} className="text-violet-400 hover:text-violet-300">Explorer le monde →</Link>
          )}
        </div>
        {!child ? (
          <Link href="/auth/signup"><button className="px-5 py-2.5 bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] rounded-full text-sm font-semibold hover:opacity-90">Créer un profil enfant</button></Link>
        ) : done ? (
          <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm"><CheckCircle className="w-5 h-5" /> Terminé — +{c.xpReward} XP gagnés</div>
        ) : (
          <button
            onClick={() => markDone(c)}
            disabled={submitting}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 disabled:opacity-50 ${
              isDaily
                ? 'bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30'
                : 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/30'
            }`}
          >
            {submitting ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            Marquer comme terminé (+{c.xpReward} XP)
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060810] text-white">
      <Nav />
      <section className="pt-28 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-sm text-gray-400 mb-1">Gagne de l&apos;XP chaque jour</p>
              <h1 className="font-display text-3xl md:text-4xl font-bold">Défis & Quêtes</h1>
              <p className="text-sm text-gray-500 mt-2 flex items-center gap-2"><RefreshCw className="w-4 h-4 text-amber-400" /> Rotation quotidienne et hebdomadaire — un nouveau défi chaque jour !</p>
            </div>
            {children.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {children.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => selectChild(c.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all min-w-[140px] ${c.id === activeChildId ? 'border-violet-500 bg-violet-500/10' : 'border-white/10 bg-[#111827] hover:border-white/20'}`}
                  >
                    <span className="text-2xl">{c.avatar}</span>
                    <div className="text-left">
                      <div className="font-bold text-sm">{c.name}</div>
                      <div className="text-xs text-violet-400">{c.xp} XP</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm text-red-300">{error}</div>
          )}

          {/* Pas d'enfant */}
          {!child && (
            <div className="bg-[#111827] border border-white/5 rounded-xl p-6 mb-8 text-center">
              <p className="text-gray-300 mb-4">Crée d&apos;abord le profil de ton explorateur pour relever les défis.</p>
              <Link href="/auth/signup"><button className="px-6 py-3 bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] rounded-xl font-semibold hover:opacity-90">Créer un profil enfant</button></Link>
            </div>
          )}

          {/* Défis en vedette (rotation du jour / de la semaine) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {daily ? challengeCard(daily, 'daily') : <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 text-gray-400 text-sm">Aucun défi quotidien disponible.</div>}
            {weekly ? challengeCard(weekly, 'weekly') : <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 text-gray-400 text-sm">Aucune quête hebdomadaire disponible.</div>}
          </div>

          {/* Tous les défis */}
          {challenges.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-violet-400" /> Tous les défis ({challenges.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {challenges.map((c) => challengeCard(c, null))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* REWARD OVERLAY */}
      {result && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6">
          <div className="bg-[#111827] border border-violet-500/30 rounded-3xl p-8 max-w-sm w-full text-center">
            <div className="text-6xl mb-4">🎉</div>
            {result.alreadyCompleted ? (
              <p className="text-gray-300 mb-4">Tu avais déjà relevé ce défi — aucun XP supplémentaire.</p>
            ) : (
              <>
                {result.leveledUp && (
                  <div className="mb-4 flex items-center justify-center gap-2 text-yellow-400">
                    <Crown className="w-6 h-6" /><span className="font-bold text-xl">Niveau {result.newLevel} atteint !</span>
                  </div>
                )}
                <div className="mb-2 flex items-center justify-center gap-2 text-violet-300">
                  <Zap className="w-5 h-5" />
                  <span className="font-bold text-lg">+{result.xpAwarded} XP</span>
                </div>
                <div className="mb-6 text-sm text-gray-400">Total : {result.newXp} XP — Niveau {result.newLevel}</div>
              </>
            )}
            <div className="flex gap-3">
              <Link href="/dashboard"><button className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-xl font-bold transition-colors">Dashboard</button></Link>
              <button onClick={() => setResult(null)} className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-bold transition-colors">Continuer</button>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
          <p>© 2026 Digital Explorers — BENILAB. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
