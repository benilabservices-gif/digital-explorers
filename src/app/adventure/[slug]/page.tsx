'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, CheckCircle, XCircle, Star, Trophy, ArrowRight, Sparkles, BookOpen, Play, Target, Lightbulb, Zap, Crown, Rocket, FlaskConical, Hammer } from 'lucide-react';
import Nav from '@/components/Nav';
import AICoach from '@/components/AICoach';
import { createClient } from '@/lib/supabase/client';
import { fetchChildrenWithProgress, findActiveChild, type ChildData } from '@/lib/children';
import { getActiveChildId } from '@/lib/active-child';

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

interface AdventureData {
  slug: string;
  title: string;
  description: string;
  story: string;
  xpReward: number;
  world: { slug: string; name: string; icon: string; gradient: string };
}

interface CompleteResult {
  alreadyCompleted: boolean;
  xpAwarded: number;
  quizScore: number;
  quizMax: number;
  newXp: number;
  newLevel: number;
  leveledUp: boolean;
  newBadges: { slug: string; name: string; icon: string }[];
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

export default function AdventureSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const [child, setChild] = useState<ChildData | null>(null);
  const [adventure, setAdventure] = useState<AdventureData | null>(null);
  const [lessons, setLessons] = useState<LessonSection[]>([]);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [quizDone, setQuizDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<CompleteResult | null>(null);
  const [planLimit, setPlanLimit] = useState<PlanLimit | null>(null);
  const [alreadyDone, setAlreadyDone] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load(slugParam: string) {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!user) { setLoading(false); return; }
      setAuth(true);

      // Enfant actif : pointeur localStorage (ID) + données DB.
      const [children, { data: advRow }] = await Promise.all([
        fetchChildrenWithProgress(supabase),
        supabase
          .from('adventures')
          .select('slug,title,description,story,xp_reward,worlds(slug,name,icon,gradient)')
          .eq('slug', slugParam)
          .eq('is_published', true)
          .maybeSingle(),
      ]);
      if (cancelled) return;

      const active = findActiveChild(children, getActiveChildId());
      setChild(active);

      if (!advRow || !advRow.worlds) { setLoading(false); return; }
      const w = advRow.worlds as { slug: string; name: string; icon: string; gradient: string };
      setAdventure({
        slug: advRow.slug,
        title: advRow.title,
        description: advRow.description,
        story: advRow.story,
        xpReward: advRow.xp_reward,
        world: { slug: w.slug, name: w.name, icon: w.icon, gradient: w.gradient },
      });
      if (active) setAlreadyDone(active.completedAdventureSlugs.includes(advRow.slug));
      setLoading(false);
    }

    params.then((p) => { if (!cancelled) load(p.slug); });
    return () => { cancelled = true; };
  }, [params]);

  // Quiz et leçons sont chargés par adventure_id une fois l'aventure connue.
  useEffect(() => {
    if (!adventure) return;
    const supabase = createClient();
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
  }, [adventure]);

  if (loading) {
    return <div className="min-h-screen bg-[#060810] flex items-center justify-center"><div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!auth) {
    return (
      <div className="min-h-screen bg-[#060810] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-6"><Shield className="w-10 h-10 text-violet-400" /></div>
          <h1 className="font-display text-3xl font-bold mb-4">Accès réservé</h1>
          <p className="text-gray-400 mb-8">Connecte-toi pour accéder à cette aventure.</p>
          <Link href="/auth/signup"><button className="px-8 py-3 bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] rounded-full font-semibold hover:opacity-90">Créer mon compte</button></Link>
        </div>
      </div>
    );
  }

  if (!adventure) {
    return (
      <div className="min-h-screen bg-[#060810] text-white flex items-center justify-center">
        <div className="text-center"><h1 className="text-2xl font-bold mb-2">Aventure non trouvée</h1><Link href="/dashboard" className="text-violet-400 hover:underline">Retour au dashboard</Link></div>
      </div>
    );
  }

  const hasQuiz = quiz.length > 0;
  const totalSteps = lessons.length + (hasQuiz ? 1 : 0);
  const quizStepIndex = lessons.length; // le quiz est la dernière étape
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
          adventureSlug: adventure!.slug,
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

  const sec = lessons[currentStep];
  const meta = sec ? SECTION_ICONS[sec.section_type] : undefined;

  return (
    <div className="min-h-screen bg-[#060810] text-white pb-32">
      <Nav />
      <div className="pt-24 px-6 max-w-3xl mx-auto">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>Progression</span>
            <span>{Math.min(currentStep + 1, totalSteps)}/{totalSteps}</span>
          </div>
          <div className="h-2 bg-[#1e293b] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all" style={{ width: `${(Math.min(currentStep + 1, totalSteps) / Math.max(totalSteps, 1)) * 100}%` }} />
          </div>
        </div>

        {/* Breadcrumb */}
        <Link href={`/worlds/${adventure.world.slug}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {adventure.world.icon} {adventure.world.name}
        </Link>

        {/* Adventure header */}
        <div className={`rounded-2xl p-6 mb-6 bg-gradient-to-r ${adventure.world.gradient} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative">
            <div className="text-4xl mb-2">{adventure.world.icon}</div>
            <h1 className="text-2xl font-bold mb-1">{adventure.title}</h1>
            <p className="text-white/80 text-sm">{adventure.description}</p>
            <div className="mt-3 flex items-center gap-3 text-sm text-white/60">
              <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400" /> +{adventure.xpReward} XP</span>
              {alreadyDone && <span className="flex items-center gap-1 text-emerald-300"><CheckCircle className="w-4 h-4" /> Terminée</span>}
            </div>
          </div>
        </div>

        {/* REWARD OVERLAY */}
        {result && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6">
            <div className="bg-[#111827] border border-violet-500/30 rounded-3xl p-8 max-w-sm w-full text-center">
              <div className="text-6xl mb-4">🎉</div>
              {result.alreadyCompleted ? (
                <p className="text-gray-300 mb-4">Tu avais déjà terminé cette aventure — aucun XP supplémentaire.</p>
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
                  {hasQuiz && (
                    <div className="mb-4 text-sm text-gray-400">
                      Quiz : {result.quizScore}/{result.quizMax}
                    </div>
                  )}
                  {result.newBadges.length > 0 && (
                    <div className="mb-6">
                      <div className="text-sm text-gray-400 mb-2">Nouveaux badges :</div>
                      <div className="flex justify-center gap-3">
                        {result.newBadges.map(b => (
                          <div key={b.slug} className="flex flex-col items-center">
                            <span className="text-3xl">{b.icon}</span>
                            <span className="text-xs text-gray-400 mt-1">{b.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
              <div className="flex gap-3">
                <Link href="/dashboard"><button className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-xl font-bold transition-colors">Dashboard</button></Link>
                <button onClick={() => { setResult(null); router.push('/dashboard'); }} className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-bold transition-colors">Continuer</button>
              </div>
            </div>
          </div>
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
            <p className="text-gray-300 mb-4">Crée d&apos;abord le profil de ton explorateur pour commencer l&apos;aventure.</p>
            <Link href="/onboarding"><button className="px-6 py-3 bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] rounded-xl font-semibold hover:opacity-90">Créer un profil enfant</button></Link>
          </div>
        )}

        {/* Step content */}
        {child && (
          <div className="bg-[#111827] border border-white/5 rounded-xl p-6 mb-6 min-h-[200px]">
            {onQuizStep ? (
              <div>
                <div className="flex items-center gap-2 mb-4"><Sparkles className="w-5 h-5 text-violet-400" /><span className="font-bold text-violet-300">Quiz</span></div>
                {quiz.map((q, qi) => (
                  <div key={qi} className="mb-6">
                    <p className="font-semibold mb-3">{qi + 1}. {q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((opt, oi) => (
                        <button key={oi} onClick={() => !quizDone && setAnswers(prev => ({ ...prev, [qi]: oi }))}
                          className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                            answers[qi] === oi ? 'border-violet-500 bg-violet-500/20' :
                            quizDone && oi === q.correct_index ? 'border-emerald-500 bg-emerald-500/20' :
                            quizDone && answers[qi] === oi && oi !== q.correct_index ? 'border-red-500 bg-red-500/20' :
                            'border-white/10 hover:border-white/30'
                          }`}>
                          {opt}
                          {quizDone && oi === q.correct_index && <CheckCircle className="w-4 h-4 inline text-emerald-400 ml-2" />}
                          {quizDone && answers[qi] === oi && oi !== q.correct_index && <XCircle className="w-4 h-4 inline text-red-400 ml-2" />}
                        </button>
                      ))}
                    </div>
                    {quizDone && q.explanation && (
                      <p className="mt-2 text-sm text-gray-400">💡 {q.explanation}</p>
                    )}
                  </div>
                ))}
                {quizDone && result && (
                  <div className="flex items-center gap-2 text-emerald-400"><Trophy className="w-5 h-5" /><span>Récompenses ajoutées à ton profil !</span></div>
                )}
                {!quizDone && (
                  <button onClick={validateQuiz} disabled={!allAnswered()} className="px-6 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 rounded-xl font-semibold transition-colors">
                    Valider mes réponses
                  </button>
                )}
              </div>
            ) : sec ? (
              <>
                <div className="flex items-center gap-2 mb-3">
                  {meta?.icon}
                  <span className="text-sm text-violet-400 font-medium uppercase tracking-wider">{meta?.label ?? sec.section_type}</span>
                </div>
                <h2 className="font-bold text-lg mb-3">{sec.title}</h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">{sec.content}</p>
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
      </div>
      <AICoach worldName={adventure.world.name} adventureTitle={adventure.title} />
    </div>
  );
}
