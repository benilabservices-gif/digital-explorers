'use client';

// ─────────────────────────────────────────────────────────────────────────────
// AdventureClient — cœur interactif de /adventure/[slug] (Phase 2).
//
// La coquille serveur (page.tsx) fournit métadonnées, thème, filigrane,
// breadcrumb et en-tête ; cet îlot conserve TOUTE la mécanique : lecteur de
// leçons, mini-jeux, quiz, complétion (/api/adventures/complete), récompenses.
// Les données d'aventure et d'enfant actif viennent du serveur (props) — plus
// de gates/chargement côté client.
//
// Contrats e2e préservés : « 1/N », boutons Suivant|Aller au quiz, QuizStep
// (div.space-y-2), « Valider mes réponses », overlay RewardOverlay
// (div.fixed.inset-0, +XP, bouton « Dashboard »), StoryIntro « Passer ».
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, BookOpen, Lightbulb, Play, Rocket, Sparkles, Target, FlaskConical, Hammer } from 'lucide-react';
import AICoach from '@/components/AICoach';
import LessonScene from '@/components/adventure/LessonScene';
import InteractiveHost from '@/components/adventure/InteractiveHost';
import MissionCard from '@/components/adventure/MissionCard';
import QuizStep from '@/components/adventure/QuizStep';
import RewardOverlay, { type RewardResult } from '@/components/adventure/RewardOverlay';
import SfxToggle from '@/components/rewards/SfxToggle';
import StoryOpening from '@/components/adventure/StoryOpening';
import StoryIntro from '@/components/adventure/StoryIntro';
import { parseLesson } from '@/lib/lesson-parser';
import { getWorldTheme } from '@/data/world-themes';
import { getInteractive } from '@/data/interactives';
import { createClient } from '@/lib/supabase/client';
import type { ChildData } from '@/lib/children';
import type { AdventurePageData } from '@/lib/queries/adventures';

interface QuizQuestion {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string | null;
}

interface LessonSection {
  id: string;
  section_type: 'story' | 'discover' | 'play' | 'experiment' | 'build' | 'mission' | 'reflect' | 'project';
  title: string;
  content: string;
}

type PlanLimit = { reason: 'adventures_limit' | 'worlds_limit'; planCode: string };

const SECTION_ICONS: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  story: { icon: <BookOpen className="w-5 h-5 text-blue-400" />, color: 'text-blue-400', label: 'Histoire' },
  discover: { icon: <Lightbulb className="w-5 h-5 text-yellow-400" />, color: 'text-yellow-400', label: 'Découvre' },
  play: { icon: <Sparkles className="w-5 h-5 text-pink-400" />, color: 'text-pink-400', label: 'Joue' },
  experiment: { icon: <FlaskConical className="w-5 h-5 text-teal-400" />, color: 'text-teal-400', label: 'Expérimente' },
  build: { icon: <Hammer className="w-5 h-5 text-orange-400" />, color: 'text-orange-400', label: 'Construis' },
  mission: { icon: <Target className="w-5 h-5 text-emerald-400" />, color: 'text-emerald-400', label: 'Mission' },
  reflect: { icon: <Lightbulb className="w-5 h-5 text-purple-400" />, color: 'text-purple-400', label: 'Réflexion' },
  project: { icon: <Play className="w-5 h-5 text-red-400" />, color: 'text-red-400', label: 'Projet' },
};

export interface AdventureClientProps {
  adventure: AdventurePageData;
  child: ChildData | null;
  alreadyDone: boolean;
}

export default function AdventureClient({ adventure, child, alreadyDone }: AdventureClientProps) {
  const router = useRouter();
  const [lessons, setLessons] = useState<LessonSection[]>([]);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [quizDone, setQuizDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<RewardResult | null>(null);
  const [planLimit, setPlanLimit] = useState<PlanLimit | null>(null);
  // Ouverture cinématique (Phase 5) : passée → on entre dans l'aventure.
  const [introDone, setIntroDone] = useState(false);

  const theme = getWorldTheme(adventure.world.slug);

  // Blocs parsés de la section courante (Phase 2 — lecteur immersif).
  const blocks = useMemo(() => {
    const s = lessons[currentStep];
    return s ? parseLesson(s.content) : [];
  }, [lessons, currentStep]);

  // Interactif associé à la section courante (Phase 3 — mini-jeux & terrains de jeu).
  const interactive = useMemo(() => {
    return getInteractive(adventure.slug, lessons[currentStep]?.section_type ?? '');
  }, [adventure.slug, lessons, currentStep]);

  // Quiz et leçons sont chargés par adventure_id au montage (mondes prêts
  // uniquement — la coquille serveur filtre déjà les mondes en rédaction).
  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;
    (async () => {
      const { data: adv } = await supabase
        .from('adventures')
        .select('id')
        .eq('slug', adventure.slug)
        .maybeSingle();
      if (!adv) return;

      const [{ data: lessonRows }, { data: quizRows }] = await Promise.all([
        supabase
          .from('lessons')
          .select('id,section_type,title,content')
          .eq('adventure_id', adv.id)
          .order('sort_order'),
        supabase
          .from('quiz_questions')
          .select('question,options,correct_index,explanation')
          .eq('adventure_id', adv.id)
          .order('sort_order'),
      ]);
      if (cancelled) return;

      setLessons(
        ((lessonRows ?? []) as unknown as { id: string; section_type: LessonSection['section_type']; title: string; content: string }[]).map((l) => ({
          id: l.id,
          section_type: l.section_type,
          title: l.title,
          content: l.content,
        }))
      );
      setQuiz(
        ((quizRows ?? []) as unknown as { question: string; options: string[] | null; correct_index: number; explanation: string | null }[]).map((q) => ({
          question: q.question,
          options: (q.options ?? []) as string[],
          correct_index: q.correct_index,
          explanation: q.explanation,
        }))
      );
    })();
    return () => { cancelled = true; };
  }, [adventure.slug]);

  const hasQuiz = quiz.length > 0;
  const totalSteps = lessons.length + (hasQuiz ? 1 : 0); // le quiz est la dernière étape
  const quizStepIndex = lessons.length;
  const onQuizStep = hasQuiz && currentStep === quizStepIndex;
  const isLastStep = currentStep === totalSteps - 1;

  function allAnswered(): boolean {
    return quiz.every((_, qi) => answers[qi] !== undefined);
  }

  async function handleComplete() {
    if (!child || submitting) return;
    setSubmitting(true);
    setPlanLimit(null);
    try {
      const res = await fetch('/api/adventures/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId: child.id,
          adventureSlug: adventure.slug,
          answers: quiz.map((_, qi) => answers[qi] ?? -1),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data);
        setQuizDone(true);
      } else if (res.status === 403 && data.error === 'plan_limit') {
        setPlanLimit({ reason: data.reason, planCode: data.planCode });
      } else if (res.status === 400 && (data.error === 'answers_incomplete' || data.error === 'answers_mismatch')) {
        setPlanLimit(null);
      } else {
        console.error('complétion impossible', data);
      }
    } catch (err) {
      console.error('complétion impossible', err);
    } finally {
      setSubmitting(false);
    }
  }

  function validateQuiz() {
    if (!allAnswered()) return;
    if (hasQuiz) {
      setQuizDone(true);
      if (isLastStep) handleComplete();
    }
  }

  // Rejouer le quiz : reset local, l'XP reste unique (idempotence serveur).
  function replayQuiz() {
    setAnswers({});
    setQuizDone(false);
    setResult(null);
  }

  const sec = lessons[currentStep];
  const meta = sec ? SECTION_ICONS[sec.section_type] : undefined;

  return (
    <>
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
          <span>Progression</span>
          <div className="flex items-center gap-3">
            <SfxToggle />
            <span>{Math.min(currentStep + 1, totalSteps)}/{totalSteps}</span>
          </div>
        </div>
        <div className="h-2 bg-[#1e293b] rounded-full overflow-hidden">
          <div className="h-full world-progress-fill rounded-full transition-all" style={{ width: `${(Math.min(currentStep + 1, totalSteps) / Math.max(totalSteps, 1)) * 100}%` }} />
        </div>
      </div>

      {/* Ouverture cinématique (Phase 5) : plein écran au démarrage,
          « Passer » pour entrer — le panneau inline reste ensuite à l'étape 0. */}
      {currentStep === 0 && adventure.story && child && !introDone && (
        <StoryIntro
          guide={theme.guide}
          story={adventure.story}
          onDone={() => setIntroDone(true)}
        />
      )}

      {/* Ouverture narrative : le guide raconte l'histoire de l'aventure */}
      {currentStep === 0 && adventure.story && (
        <StoryOpening guide={theme.guide} story={adventure.story} />
      )}

      {/* REWARD OVERLAY (composant extrait — contrats e2e préservés) */}
      {result && (
        <RewardOverlay
          result={result}
          hasQuiz={hasQuiz}
          onContinue={() => { setResult(null); router.push('/dashboard'); }}
        />
      )}

      {/* PLAN LIMIT MESSAGE */}
      {planLimit && (
        <div className="mb-6 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5">
          <div className="flex items-start gap-3">
            <Rocket className="w-5 h-5 text-amber-400 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-amber-300 mb-1">Limite du plan {planLimit.planCode === 'starter' ? 'Starter' : planLimit.planCode} atteinte</p>
              <p className="text-sm text-gray-300 mb-3">
                {planLimit.reason === 'adventures_limit'
                  ? "Tu as déjà terminé les 3 aventures gratuites du plan Starter."
                  : "Le plan Starter donne accès à un seul monde."}
                {' '}Passe à Explorateur pour continuer à explorer !
              </p>
              <Link href="/pricing" className="inline-block px-5 py-2 bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] rounded-full text-sm font-semibold hover:opacity-90">
                Voir les abonnements
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Pas d'enfant : inviter à en créer un */}
      {!child && (
        <div className="bg-[#111827] border border-white/5 rounded-xl p-6 mb-6 text-center">
          <p className="text-gray-300 mb-4">Crée d'abord le profil de ton explorateur pour commencer l'aventure.</p>
          <Link href="/onboarding"><button className="px-6 py-3 bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] rounded-xl font-semibold hover:opacity-90">Créer un profil enfant</button></Link>
        </div>
      )}

      {/* Step content : quiz extrait, sinon lecteur immersif (Phase 2) */}
      {child && (
        <div className="bg-[#111827] border border-white/5 rounded-xl p-6 mb-6 min-h-[200px]">
          {onQuizStep ? (
            <QuizStep
              quiz={quiz}
              answers={answers}
              onAnswer={(qi, oi) => setAnswers(prev => ({ ...prev, [qi]: oi }))}
              quizDone={quizDone}
              showRewards={quizDone && Boolean(result)}
              canValidate={allAnswered()}
              onValidate={validateQuiz}
              onReplay={replayQuiz}
            />
          ) : sec ? (
            <>
              <div className="flex items-center gap-2 mb-3">
                {meta?.icon}
                <span className="text-sm world-accent font-medium uppercase tracking-wider">{meta?.label ?? sec.section_type}</span>
              </div>
              <h2 className="font-bold text-lg mb-4">{sec.title}</h2>
              {blocks.length === 0 ? (
                <div className="text-gray-400 text-sm">Contenu en cours de rédaction — la version enrichie arrive très bientôt !</div>
              ) : interactive ? (
                <InteractiveHost key={sec.id} config={interactive} blocks={blocks} guide={theme.guide} />
              ) : sec.section_type === 'mission' ? (
                <MissionCard key={sec.id} blocks={blocks} />
              ) : (
                <LessonScene key={sec.id} blocks={blocks} guide={theme.guide} />
              )}
            </>
          ) : (
            <div className="text-gray-400 text-sm">Contenu en cours de rédaction — la version enrichie arrive très bientôt !</div>
          )}
        </div>
      )}

      {/* Navigation */}
      {child && !result && (
        <div className="flex justify-between">
          <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}
            className="px-5 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 disabled:opacity-30 transition-all">
            ← Précédent
          </button>
          {onQuizStep ? null : (
            <button onClick={() => setCurrentStep(currentStep + 1)} className="px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold transition-colors flex items-center gap-2">
              {currentStep === lessons.length - 1 && hasQuiz ? 'Aller au quiz' : 'Suivant'} <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Terminer l'aventure (dernière étape) */}
      {child && isLastStep && !result && (
        <div className="mt-6">
          {onQuizStep ? (
            !quizDone && (
              <button onClick={validateQuiz} disabled={!allAnswered() || submitting} className="w-full px-6 py-4 bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50">
                {submitting ? 'Validation…' : alreadyDone ? 'Rejouer le quiz' : 'Terminer l\'aventure'} <ArrowRight className="w-5 h-5" />
              </button>
            )
          ) : (
            <button onClick={handleComplete} disabled={submitting} className="w-full px-6 py-4 bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50">
              {submitting ? 'Enregistrement…' : alreadyDone ? 'Revoir mes récompenses' : 'Terminer l\'aventure'} <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      <AICoach worldName={adventure.world.name} adventureTitle={adventure.title} />
    </>
  );
}
