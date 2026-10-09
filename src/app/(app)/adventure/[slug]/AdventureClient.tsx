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
// Contrats e2e — testids centralisés (src/lib/testids.ts) : adventure.progress
// (« 1/N »), adventure.next (Suivant|Aller au quiz), QuizStep (adventure.quiz /
// quizOption / validate), RewardOverlay (adventure.rewardsOverlay, +XP, lien
// « Dashboard » adventure.overlayDashboard), StoryIntro (adventure.skipIntro).
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, BookOpen, Lightbulb, Play, Rocket, Sparkles, Target, FlaskConical, Hammer } from 'lucide-react';
import AICoach from '@/components/AICoach';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { TESTIDS } from '@/lib/testids';
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

// Icônes par type de section — palette sémantique tokens-only :
// info (récit/réflexion), gleam (découverte/construction), sunrise (jeu),
// success (expérience/mission), danger (projet — passage à l'action).
const SECTION_ICONS: Record<string, { icon: React.ReactNode; label: string }> = {
  story: { icon: <BookOpen className="h-5 w-5 text-info-400" />, label: 'Histoire' },
  discover: { icon: <Lightbulb className="h-5 w-5 text-gleam-400" />, label: 'Découvre' },
  play: { icon: <Sparkles className="h-5 w-5 text-sunrise-400" />, label: 'Joue' },
  experiment: { icon: <FlaskConical className="h-5 w-5 text-success-400" />, label: 'Expérimente' },
  build: { icon: <Hammer className="h-5 w-5 text-gleam-500" />, label: 'Construis' },
  mission: { icon: <Target className="h-5 w-5 text-success-500" />, label: 'Mission' },
  reflect: { icon: <Lightbulb className="h-5 w-5 text-info-300" />, label: 'Réflexion' },
  project: { icon: <Play className="h-5 w-5 text-danger-400" />, label: 'Projet' },
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
        <div className="flex items-center justify-between text-sm text-ink-soft mb-2">
          <span>Progression</span>
          <div className="flex items-center gap-3">
            <SfxToggle />
            <span data-testid={TESTIDS.adventure.progress}>{Math.min(currentStep + 1, totalSteps)}/{totalSteps}</span>
          </div>
        </div>
        <div className="h-2 bg-night-600 rounded-full overflow-hidden">
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
        <div className="mb-6 rounded-2xl border border-sunrise-500/40 bg-sunrise-500/10 p-5">
          <div className="flex items-start gap-3">
            <Rocket className="h-5 w-5 text-sunrise-400 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-sunrise-300 mb-1">Limite du plan {planLimit.planCode === 'starter' ? 'Starter' : planLimit.planCode} atteinte</p>
              <p className="text-sm text-ink-soft mb-3">
                {planLimit.reason === 'adventures_limit'
                  ? "Tu as déjà terminé les 3 aventures gratuites du plan Starter."
                  : "Le plan Starter donne accès à un seul monde."}
                {' '}Passe à Explorateur pour continuer à explorer !
              </p>
              <Link href="/pricing" className={buttonVariants({ size: 'sm' })}>
                Voir les abonnements
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Pas d'enfant : inviter à en créer un */}
      {!child && (
        <Card className="mb-6 p-6 text-center">
          <p className="text-ink-soft mb-4">Crée d'abord le profil de ton explorateur pour commencer l'aventure.</p>
          <Link href="/onboarding" className={buttonVariants()}>Créer un profil enfant</Link>
        </Card>
      )}

      {/* Step content : quiz extrait, sinon lecteur immersif (Phase 2) */}
      {child && (
        <Card className="p-6 mb-6 min-h-[200px]">
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
                <div className="text-ink-soft text-sm">Contenu en cours de rédaction — la version enrichie arrive très bientôt !</div>
              ) : interactive ? (
                <InteractiveHost key={sec.id} config={interactive} blocks={blocks} guide={theme.guide} />
              ) : sec.section_type === 'mission' ? (
                <MissionCard key={sec.id} blocks={blocks} />
              ) : (
                <LessonScene key={sec.id} blocks={blocks} guide={theme.guide} />
              )}
            </>
          ) : (
            <div className="text-ink-soft text-sm">Contenu en cours de rédaction — la version enrichie arrive très bientôt !</div>
          )}
        </Card>
      )}

      {/* Navigation */}
      {child && !result && (
        <div className="flex justify-between">
          <Button variant="secondary" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}>
            ← Précédent
          </Button>
          {onQuizStep ? null : (
            <Button onClick={() => setCurrentStep(currentStep + 1)} data-testid={TESTIDS.adventure.next}>
              {currentStep === lessons.length - 1 && hasQuiz ? 'Aller au quiz' : 'Suivant'} <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}

      {/* Terminer l'aventure (dernière étape) */}
      {child && isLastStep && !result && (
        <div className="mt-6">
          {onQuizStep ? (
            !quizDone && (
              <Button onClick={validateQuiz} disabled={!allAnswered() || submitting} size="lg" className="w-full">
                {submitting ? 'Validation…' : alreadyDone ? 'Rejouer le quiz' : 'Terminer l\'aventure'} <ArrowRight className="h-5 w-5" />
              </Button>
            )
          ) : (
            <Button onClick={handleComplete} disabled={submitting} size="lg" className="w-full">
              {submitting ? 'Enregistrement…' : alreadyDone ? 'Revoir mes récompenses' : 'Terminer l\'aventure'} <ArrowRight className="h-5 w-5" />
            </Button>
          )}
        </div>
      )}

      <AICoach worldName={adventure.world.name} adventureTitle={adventure.title} />
    </>
  );
}
