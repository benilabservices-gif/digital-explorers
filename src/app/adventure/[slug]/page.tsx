'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, CheckCircle, XCircle, Star, Trophy, ArrowRight, Sparkles, BookOpen, Play, Target, Lightbulb } from 'lucide-react';
import { WORLDS } from '@/data/content';
import type { Adventure } from '@/data/content';
import Nav from '@/components/Nav';
import AICoach from '@/components/AICoach';

type SectionType = 'story' | 'discover' | 'quiz' | 'mission' | 'project' | 'reward';

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

interface Section {
  id: string;
  section_type: SectionType;
  order_num: number;
  title: string;
  content: string;
  quiz_questions?: QuizQuestion[];
}

// Rich quiz content for each adventure
const QUIZ_CONTENT: Record<string, QuizQuestion[]> = {
  'internet-discover': [
    { question: "Qu'est-ce qu'Internet ?", options: ["Un jeu vidéo", "Un réseau mondial d'ordinateurs connectés", "Un téléphone portable", "Un site web"], correct: 1 },
    { question: "Combien de personnes utilisent Internet dans le monde ?", options: ["100 millions", "1 milliard", "Plus de 5 milliards", "10 milliards"], correct: 2 },
    { question: "Quel pays a créé ARPANET, le prédécesseur d'Internet ?", options: ["France", "Allemagne", "États-Unis", "Brésil"], correct: 2 },
  ],
  'search-master': [
    { question: "Quel type de site est le plus fiable pour des informations ?", options: ["Un blog personnel", "Un site .gov ou .edu", "Un réseau social", "Un forum anonyme"], correct: 1 },
    { question: "Pour vérifier une information, que dois-tu faire ?", options: ["Croire le premier résultat", "Chercher sur plusieurs sites", "Partager sans vérifier", "Ignorer la date"], correct: 1 },
    { question: "Quel indice aide à vérifier la fiabilité d'un site ?", options: ["Le nombre de publicité", "La présence du cadenas HTTPS", "La couleur du site", "La taille de la police"], correct: 1 },
  ],
  'html-basics': [
    { question: "Que signifie HTML ?", options: ["HyperText Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyper Transfer Markup Language"], correct: 0 },
    { question: "Quelle balise crée un titre principal ?", options: ["<text>", "<h1>", "<title>", "<header>"], correct: 1 },
    { question: "Quelle balise crée un paragraphe ?", options: ["<p>", "<par>", "<text>", "<block>"], correct: 0 },
  ],
  'ia-decouverte': [
    { question: "Qu'est-ce que l'IA ?", options: ["Un robot physique", "Une technologie qui permet aux machines d'apprendre", "Un jeu vidéo", "Un réseau social"], correct: 1 },
    { question: "L'IA peut-elle créer des images ?", options: ["Non, jamais", "Oui, avec des outils comme DALL-E", "Seulement en noir et blanc", "Oui mais c'est interdit"], correct: 1 },
    { question: "Quel est un exemple d'IA dans la vie quotidienne ?", options: ["Un stylo", "Siri ou Alexa", "Une montre analogique", "Un livre papier"], correct: 1 },
  ],
  'prompting-mastery': [
    { question: "Quel est le meilleur prompt ?", options: ["Dis quelque chose", "Explique l'IA en 3 points avec des exemples africains", "Qu'est-ce que l'IA ?", "Parle-moi d'IA"], correct: 1 },
    { question: "Un bon prompt doit être :", options: ["Vague", "Précis et contextuel", "Très long", "En anglais uniquement"], correct: 1 },
    { question: "Pourquoi le contexte est-il important dans un prompt ?", options: ["Ce n'est pas important", "Il aide l'IA à comprendre ce qu'on attend", "Les prompts n'ont pas besoin de contexte", "C'est juste pour faire joli"], correct: 1 },
  ],
  'ai-ethics': [
    { question: "Pourquoi l'IA peut-elle avoir des biais ?", options: ["Elle est cassée", "Elle apprend de données humaines qui peuvent être biaisées", "C'est un virus", "L'IA n'a pas de biais"], correct: 1 },
    { question: "Qu'est-ce qu'un biais dans l'IA ?", options: ["Une fonctionnalité utile", "Une discrimination automatique dans les résultats", "Un type de programme", "Un bug technique"], correct: 1 },
    { question: "Comment utiliser l'IA de manière éthique ?", options: ["L'utiliser sans réfléchir", "Vérifier les résultats et protéger les données", "Ne jamais l'utiliser", "Partager toutes les données personnelles"], correct: 1 },
  ],
  'algo-logique': [
    { question: "Qu'est-ce qu'un algorithme ?", options: ["Un type de jeu", "Une suite d'instructions pour résoudre un problème", "Un langage de programmation", "Un ordinateur"], correct: 1 },
    { question: "Lequel est un exemple d'algorithme ?", options: ["Une recette de cuisine", "Un arbre", "Une pierre", "Un nuage"], correct: 0 },
    { question: "Pourquoi les algorithmes sont-ils importants en programmation ?", options: ["Ils ne le sont pas", "Ils permettent de décomposer les problèmes en étapes simples", "Ils rendent le code plus lent", "Ils sont optionnels"], correct: 1 },
  ],
  'html-css-firsts': [
    { question: "À quoi sert CSS ?", options: ["Structurer le contenu", "Styliser et mettre en page", "Créer des bases de données", "Faire des calculs"], correct: 1 },
    { question: "Quelle propriété CSS change la couleur du texte ?", options: ["font-size", "color", "background", "margin"], correct: 1 },
    { question: "HTML et CSS travaillent ensemble pour :", options: ["Rien", "Créer des pages web structurées et belles", "Jouer des vidéos", "Gérer des emails"], correct: 1 },
  ],
  'python-basics': [
    { question: "Pourquoi Python est populaire ?", options: ["Parce qu'il est difficile", "Parce qu'il est simple et puissant", "Parce qu'il ne fonctionne que sur Mac", "Parce qu'il est ancien"], correct: 1 },
    { question: "Quelle fonction affiche du texte en Python ?", options: ["print()", "show()", "display()", "echo()"], correct: 0 },
    { question: "Python est utilisé dans quel domaine ?", options: ["Cuisine uniquement", "IA, data science, automatisation", "Jeux vidéo uniquement", "Cuisine et jardinage"], correct: 1 },
  ],
};

// Default quiz if no specific content
const DEFAULT_QUIZ: QuizQuestion[] = [
  { question: "As-tu bien compris ce chapitre ?", options: ["Oui, je comprends", "Pas vraiment", "Pas encore"], correct: 0 },
  { question: "Qu'est-ce que tu as appris aujourd'hui ?", options: ["Beaucoup de choses", "Quelques notions", "Peu de choses"], correct: 0 },
];

export default function AdventureSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const [child, setChild] = useState<any>(null);
  const [adventure, setAdventure] = useState<Adventure | null>(null);
  const [world, setWorld] = useState<any>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizDone, setQuizDone] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [slug, setSlug] = useState('');

  useEffect(() => {
    params.then(p => setSlug(p.slug));
    const token = localStorage.getItem('de_auth');
    if (token) setAuth(true);
    else { setLoading(false); return; }
    
    const active = localStorage.getItem('de_active_child');
    if (active) setChild(JSON.parse(active));
    setLoading(false);
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    for (const w of WORLDS) {
      const adv = w.adventures?.find((a: any) => a.slug === slug);
      if (adv) {
        setAdventure(adv);
        setWorld(w);
        
        const quizQuestions = QUIZ_CONTENT[slug] || DEFAULT_QUIZ;
        const secs: Section[] = [
          { id: 's1', section_type: 'story', order_num: 1, title: '📖 L\'histoire', content: adv.story },
          { id: 's2', section_type: 'discover', order_num: 2, title: '🔍 Découvre', content: adv.description + ' ' + adv.story.slice(0, 100) + '...' },
          { id: 's3', section_type: 'quiz', order_num: 3, title: '🧠 Quiz — Teste tes connaissances', content: 'Réponds aux questions pour vérifier ta compréhension.', quiz_questions: quizQuestions },
          { id: 's4', section_type: 'mission', order_num: 4, title: '🎯 Mission', content: `Applique ce que tu as appris : ${adv.description}. Réalise cette mission pour compléter l'aventure.` },
          { id: 's5', section_type: 'project', order_num: 5, title: '🛠️ Projet', content: `Crée quelque chose avec tes nouvelles compétences. ${adv.title} t'a appris l'essentiel.` },
          { id: 's6', section_type: 'reward', order_num: 6, title: '🏆 Récompense', content: `Bravo ! Tu as terminé "${adv.title}". +${adv.xp_reward} XP débloqués !` },
        ];
        setSections(secs);
        break;
      }
    }
  }, [slug]);

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

  if (!adventure || !world) {
    return (
      <div className="min-h-screen bg-[#060810] text-white flex items-center justify-center">
        <div className="text-center"><h1 className="text-2xl font-bold mb-2">Aventure non trouvée</h1><Link href="/dashboard" className="text-violet-400 hover:underline">Retour au dashboard</Link></div>
      </div>
    );
  }

  const sec = sections[currentSection];
  const isQuiz = sec?.section_type === 'quiz';
  const isReward = sec?.section_type === 'reward';
  const isLast = currentSection === sections.length - 1;

  function handleQuizSubmit() {
    if (quizAnswer === null) return;
    const questions = sec.quiz_questions || [];
    if (questions[quizAnswer]?.correct === quizAnswer) {
      setQuizScore(s => s + 1);
    }
    setQuizDone(true);
  }

  function handleComplete() {
    if (!child) return;
    const updatedChildren = JSON.parse(localStorage.getItem('de_children') || '[]');
    const childIdx = updatedChildren.findIndex((c: any) => c.id === child.id);
    if (childIdx >= 0) {
      const c = updatedChildren[childIdx];
      if (!c.adventuresCompleted.includes(adventure.slug)) {
        c.adventuresCompleted = [...c.adventuresCompleted, adventure.slug];
        c.xp = (c.xp || 0) + adventure.xp_reward;
        c.level = Math.floor(c.xp / 500) + 1;
      }
      updatedChildren[childIdx] = c;
      localStorage.setItem('de_children', JSON.stringify(updatedChildren));
      localStorage.setItem('de_active_child', JSON.stringify(c));
      setChild(c);
    }
    setCompleted(true);
  }

  return (
    <div className="min-h-screen bg-[#060810] text-white pb-32">
      <Nav />
      <div className="pt-24 px-6 max-w-3xl mx-auto">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>Progression</span>
            <span>{currentSection + 1}/{sections.length}</span>
          </div>
          <div className="h-2 bg-[#1e293b] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all" style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }} />
          </div>
        </div>

        {/* Breadcrumb */}
        <Link href={`/worlds/${world.slug}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {world.icon} {world.name}
        </Link>

        {/* Adventure header */}
        <div className={`rounded-2xl p-6 mb-6 bg-gradient-to-r ${world.gradient} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative">
            <div className="text-4xl mb-2">{world.icon}</div>
            <h1 className="text-2xl font-bold mb-1">{adventure.title}</h1>
            <p className="text-white/80 text-sm">{adventure.description}</p>
            <div className="mt-3 flex items-center gap-3 text-sm text-white/60">
              <span className="flex items-center gap-1"><Target className="w-4 h-4" /> Niv. {adventure.id.includes('a1') ? '1' : adventure.id.includes('a2') ? '2' : '1'}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400" /> +{adventure.xp_reward} XP</span>
            </div>
          </div>
        </div>

        {/* Section content */}
        <div className="bg-[#111827] border border-white/5 rounded-xl p-6 mb-6 min-h-[200px]">
          {isQuiz ? (
            <div>
              <div className="flex items-center gap-2 mb-4"><Sparkles className="w-5 h-5 text-violet-400" /><span className="font-bold text-violet-300">Quiz</span></div>
              {(sec.quiz_questions || DEFAULT_QUIZ).map((q: QuizQuestion, qi: number) => (
                <div key={qi} className="mb-6">
                  <p className="font-semibold mb-3">{qi + 1}. {q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((opt, oi) => (
                      <button key={oi} onClick={() => !quizDone && setQuizAnswer(oi)}
                        className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                          quizAnswer === oi ? 'border-violet-500 bg-violet-500/20' :
                          quizDone && oi === q.correct ? 'border-emerald-500 bg-emerald-500/20' :
                          quizDone && quizAnswer === oi && oi !== q.correct ? 'border-red-500 bg-red-500/20' :
                          'border-white/10 hover:border-white/30'
                        }`}>
                        {opt}
                        {quizDone && oi === q.correct && <CheckCircle className="w-4 h-4 inline text-emerald-400 ml-2" />}
                        {quizDone && quizAnswer === oi && oi !== q.correct && <XCircle className="w-4 h-4 inline text-red-400 ml-2" />}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {!quizDone ? (
                <button onClick={handleQuizSubmit} disabled={quizAnswer === null} className="px-6 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 rounded-xl font-semibold transition-colors">
                  Valider
                </button>
              ) : (
                <div className="flex items-center gap-2 text-emerald-400"><Trophy className="w-5 h-5" /><span>Quiz terminé ! Score: {quizScore}/{(sec.quiz_questions || DEFAULT_QUIZ).length}</span></div>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-3">
                {sec.section_type === 'story' && <BookOpen className="w-5 h-5 text-blue-400" />}
                {sec.section_type === 'discover' && <Lightbulb className="w-5 h-5 text-yellow-400" />}
                {sec.section_type === 'mission' && <Target className="w-5 h-5 text-emerald-400" />}
                {sec.section_type === 'project' && <Play className="w-5 h-5 text-orange-400" />}
                {sec.section_type === 'reward' && <Trophy className="w-5 h-5 text-purple-400" />}
                <span className="text-sm text-violet-400 font-medium uppercase tracking-wider">{sec.section_type}</span>
              </div>
              <h2 className="font-bold text-lg mb-3">{sec.title}</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">{sec.content}</p>
            </>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button onClick={() => setCurrentSection(Math.max(0, currentSection - 1))} disabled={currentSection === 0}
            className="px-5 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 disabled:opacity-30 transition-all">
            ← Précédent
          </button>
          {isLast && completed ? (
            <Link href="/dashboard"><button className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-xl font-semibold transition-colors flex items-center gap-2">
              Terminer ✓
            </button></Link>
          ) : isLast ? (
            <button onClick={handleComplete} className="px-6 py-3 bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
              Terminer l'aventure <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button onClick={() => setCurrentSection(currentSection + 1)} className="px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold transition-colors flex items-center gap-2">
              Suivant <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <AICoach worldName={world.name} adventureTitle={adventure.title} />
    </div>
  );
}
