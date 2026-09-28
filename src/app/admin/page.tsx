'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Globe, BookOpen, Award, CreditCard, Save, Plus, Trash2, Shield, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';
import Nav from '@/components/Nav';
import { createClient } from '@/lib/supabase/client';

// ---------------------------------------------------------------------------
// Types locaux (lignes admin, format DB)
// ---------------------------------------------------------------------------
interface WorldRow {
  id: string; slug: string; name: string; icon: string; description: string;
  gradient: string; phase: string; sort_order: number; is_active: boolean;
}
interface AdvRow {
  id: string; world_id: string; slug: string; title: string; description: string;
  story: string; xp_reward: number; sort_order: number; is_published: boolean;
}
interface LessonRow {
  id: string; adventure_id: string; section_type: string; sort_order: number; title: string; content: string;
}
interface QuizRow {
  id: string; adventure_id: string; question: string; options: string[];
  correct_index: number; explanation: string | null; sort_order: number;
}
interface BadgeRow {
  id: string; slug: string; name: string; description: string; icon: string; rarity: string;
  xp_required: number; world_id: string | null; required_completions: number; sort_order: number;
}
interface ProfileRow { id: string; full_name: string; phone: string | null; role: string }
interface SubRow {
  id: string; parent_id: string; plan_code: string; status: string;
  started_at: string; expires_at: string | null;
}

type Tab = 'content' | 'lessons' | 'badges' | 'subs';

const inputCls = 'bg-[#0f172a] border border-white/10 rounded-lg px-3 py-2 text-sm w-full focus:border-violet-500 outline-none transition-colors';
const labelCls = 'text-xs text-gray-400 mb-1 block';

function nowIso() {
  return new Date().toISOString();
}

function expiryIn30Days() {
  return new Date(Date.now() + 30 * 86_400_000).toISOString();
}

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const [forbidden, setForbidden] = useState(false);
  const [tab, setTab] = useState<Tab>('content');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const [worlds, setWorlds] = useState<WorldRow[]>([]);
  const [adventures, setAdventures] = useState<AdvRow[]>([]);
  const [badges, setBadges] = useState<BadgeRow[]>([]);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [subs, setSubs] = useState<SubRow[]>([]);

  // Onglet leçons/quiz
  const [selectedAdvId, setSelectedAdvId] = useState<string | null>(null);
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [quiz, setQuiz] = useState<QuizRow[]>([]);
  const [loadingContent, setLoadingContent] = useState(false);

  function flash(ok: boolean, text: string) {
    setMsg({ ok, text });
    setTimeout(() => setMsg(null), 3500);
  }

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setAuth(false); setLoading(false); return; }
      if (cancelled) return;
      setAuth(true);

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (cancelled) return;

      if (profile?.role !== 'admin') {
        setForbidden(true);
        setLoading(false);
        router.replace('/dashboard');
        return;
      }

      const [w, a, b, p, s] = await Promise.all([
        supabase.from('worlds').select('*').order('sort_order'),
        supabase.from('adventures').select('*').order('sort_order'),
        supabase.from('badges').select('*').order('sort_order'),
        supabase.from('profiles').select('id,full_name,phone,role').order('full_name'),
        supabase.from('subscriptions').select('*').order('started_at', { ascending: false }),
      ]);
      if (cancelled) return;

      setWorlds((w.data ?? []) as unknown as WorldRow[]);
      setAdventures((a.data ?? []) as unknown as AdvRow[]);
      setBadges((b.data ?? []) as unknown as BadgeRow[]);
      setProfiles((p.data ?? []) as unknown as ProfileRow[]);
      setSubs((s.data ?? []) as unknown as SubRow[]);
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [router]);

  if (loading) {
    return <div className="min-h-screen bg-[#060810] flex items-center justify-center"><div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!auth || forbidden) {
    return (
      <div className="min-h-screen bg-[#060810] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 flex items-center justify-center mx-auto mb-6"><Shield className="w-10 h-10 text-red-400" /></div>
          <h1 className="font-display text-3xl font-bold mb-4">Accès administrateur requis</h1>
          <p className="text-gray-400 mb-8">Cette zone est réservée aux administrateurs.</p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Helpers de mise à jour locale
  // -------------------------------------------------------------------------
  const supabase = createClient();

  function patch<T extends { id: string }>(list: T[], id: string, changes: Partial<T>): T[] {
    return list.map((item) => (item.id === id ? { ...item, ...changes } : item));
  }

  async function run(action: () => PromiseLike<{ error: { message: string } | null }>, okText: string): Promise<boolean> {
    setBusy(true);
    try {
      const { error } = await action();
      if (error) { flash(false, 'Erreur : ' + error.message); return false; }
      flash(true, okText);
      return true;
    } finally {
      setBusy(false);
    }
  }

  // -------------------------------------------------------------------------
  // Onglet 1 : Mondes & Aventures
  // -------------------------------------------------------------------------
  async function saveWorld(w: WorldRow) {
    const ok = await run(
      () => supabase.from('worlds').update({
        name: w.name, icon: w.icon, description: w.description, gradient: w.gradient,
        phase: w.phase, sort_order: w.sort_order, is_active: w.is_active,
      }).eq('id', w.id),
      `Monde « ${w.name} » enregistré.`
    );
    if (ok) setWorlds((prev) => patch(prev, w.id, w));
  }

  async function createWorld(form: { slug: string; name: string; icon: string; gradient: string; phase: string; description: string }) {
    const ok = await run(
      () => supabase.from('worlds').insert({
        slug: form.slug, name: form.name, icon: form.icon || '🌐', gradient: form.gradient || 'from-blue-500 to-cyan-400',
        phase: form.phase, description: form.description, sort_order: worlds.length + 1,
      }),
      `Monde « ${form.name} » créé.`
    );
    if (ok) {
      const { data } = await supabase.from('worlds').select('*').order('sort_order');
      setWorlds((data ?? []) as unknown as WorldRow[]);
    }
  }

  async function saveAdventure(a: AdvRow) {
    const ok = await run(
      () => supabase.from('adventures').update({
        title: a.title, description: a.description, story: a.story,
        xp_reward: a.xp_reward, is_published: a.is_published, sort_order: a.sort_order,
      }).eq('id', a.id),
      `Aventure « ${a.title} » enregistrée.`
    );
    if (ok) setAdventures((prev) => patch(prev, a.id, a));
  }

  async function createAdventure(worldId: string, form: { slug: string; title: string; xp: number; description: string }) {
    const worldAdvs = adventures.filter((a) => a.world_id === worldId);
    const ok = await run(
      () => supabase.from('adventures').insert({
        world_id: worldId, slug: form.slug, title: form.title, description: form.description,
        xp_reward: form.xp, sort_order: worldAdvs.length + 1,
      }),
      `Aventure « ${form.title} » créée.`
    );
    if (ok) {
      const { data } = await supabase.from('adventures').select('*').order('sort_order');
      setAdventures((data ?? []) as unknown as AdvRow[]);
    }
  }

  // -------------------------------------------------------------------------
  // Onglet 2 : Leçons & Quiz
  // -------------------------------------------------------------------------
  async function loadAdventureContent(adventureId: string) {
    setSelectedAdvId(adventureId);
    setLoadingContent(true);
    setLessons([]);
    setQuiz([]);
    const [l, q] = await Promise.all([
      supabase.from('lessons').select('*').eq('adventure_id', adventureId).order('sort_order'),
      supabase.from('quiz_questions').select('*').eq('adventure_id', adventureId).order('sort_order'),
    ]);
    setLessons((l.data ?? []) as unknown as LessonRow[]);
    setQuiz((q.data ?? []) as unknown as QuizRow[]);
    setLoadingContent(false);
  }

  async function saveLesson(lesson: LessonRow) {
    await run(
      () => supabase.from('lessons').update({ title: lesson.title, content: lesson.content }).eq('id', lesson.id),
      `Leçon « ${lesson.title || lesson.section_type} » enregistrée.`
    );
  }

  async function saveQuizQuestion(q: QuizRow) {
    const ok = await run(
      () => supabase.from('quiz_questions').update({
        question: q.question, options: q.options, correct_index: q.correct_index, explanation: q.explanation,
      }).eq('id', q.id),
      'Question enregistrée.'
    );
    if (ok) setQuiz((prev) => patch(prev, q.id, q));
  }

  async function deleteQuizQuestion(q: QuizRow) {
    const ok = await run(() => supabase.from('quiz_questions').delete().eq('id', q.id), 'Question supprimée.');
    if (ok) setQuiz((prev) => prev.filter((x) => x.id !== q.id));
  }

  async function addQuizQuestion() {
    if (!selectedAdvId) return;
    const ok = await run(
      () => supabase.from('quiz_questions').insert({
        adventure_id: selectedAdvId, question: 'Nouvelle question ?', options: ['Option A', 'Option B', 'Option C'],
        correct_index: 0, explanation: null, sort_order: quiz.length + 1,
      }),
      'Question ajoutée.'
    );
    if (ok) {
      const { data } = await supabase.from('quiz_questions').select('*').eq('adventure_id', selectedAdvId).order('sort_order');
      setQuiz((data ?? []) as unknown as QuizRow[]);
    }
  }

  // -------------------------------------------------------------------------
  // Onglet 3 : Badges
  // -------------------------------------------------------------------------
  async function saveBadge(b: BadgeRow) {
    const ok = await run(
      () => supabase.from('badges').update({
        name: b.name, description: b.description, icon: b.icon, rarity: b.rarity,
        xp_required: b.xp_required, world_id: b.world_id, required_completions: b.required_completions,
        sort_order: b.sort_order,
      }).eq('id', b.id),
      `Badge « ${b.name} » enregistré.`
    );
    if (ok) setBadges((prev) => patch(prev, b.id, b));
  }

  async function createBadge(form: { slug: string; name: string; icon: string; rarity: string; xp: number; completions: number; description: string }) {
    const ok = await run(
      () => supabase.from('badges').insert({
        slug: form.slug, name: form.name, icon: form.icon || '🏆', rarity: form.rarity,
        xp_required: form.xp, required_completions: form.completions, description: form.description,
        sort_order: badges.length + 1,
      }),
      `Badge « ${form.name} » créé.`
    );
    if (ok) {
      const { data } = await supabase.from('badges').select('*').order('sort_order');
      setBadges((data ?? []) as unknown as BadgeRow[]);
    }
  }

  // -------------------------------------------------------------------------
  // Onglet 4 : Abonnements
  // -------------------------------------------------------------------------
  function latestSubFor(parentId: string): SubRow | null {
    return subs.find((s) => s.parent_id === parentId) ?? null;
  }

  async function activateSub(parentId: string, planCode: 'explorer' | 'pro') {
    const latest = latestSubFor(parentId);
    const expires = expiryIn30Days();
    const action = latest
      ? () => supabase.from('subscriptions').update({ plan_code: planCode, status: 'active', started_at: nowIso(), expires_at: expires }).eq('id', latest.id)
      : () => supabase.from('subscriptions').insert({ parent_id: parentId, plan_code: planCode, status: 'active', expires_at: expires });
    const ok = await run(action, `Abonnement ${planCode} activé (30 jours).`);
    if (ok) {
      const { data } = await supabase.from('subscriptions').select('*').order('started_at', { ascending: false });
      setSubs((data ?? []) as unknown as SubRow[]);
    }
  }

  async function expireSub(parentId: string) {
    const latest = latestSubFor(parentId);
    if (!latest) { flash(false, 'Aucun abonnement à expirer.'); return; }
    const ok = await run(
      () => supabase.from('subscriptions').update({ status: 'expired' }).eq('id', latest.id),
      'Abonnement expiré.'
    );
    if (ok) {
      const { data } = await supabase.from('subscriptions').select('*').order('started_at', { ascending: false });
      setSubs((data ?? []) as unknown as SubRow[]);
    }
  }

  // -------------------------------------------------------------------------
  // Rendu
  // -------------------------------------------------------------------------
  const adventureOptions = adventures
    .map((a) => {
      const world = worlds.find((w) => w.id === a.world_id);
      return { id: a.id, label: `${world ? world.name : '?'} — ${a.title} (${a.slug})` };
    })
    .sort((x, y) => x.label.localeCompare(y.label));

  return (
    <div className="min-h-screen bg-[#060810] text-white">
      <Nav />
      <section className="pt-28 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <p className="text-sm text-gray-400 mb-1 flex items-center gap-2"><Shield className="w-4 h-4 text-violet-400" /> Zone administrateur</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold">Back-office</h1>
          </div>

          {/* Message toast */}
          {msg && (
            <div className={`mb-6 flex items-center gap-2 rounded-xl border px-5 py-3 text-sm ${msg.ok ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-red-500/30 bg-red-500/10 text-red-300'}`}>
              {msg.ok ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />} {msg.text}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {([
              ['content', 'Mondes & Aventures', Globe],
              ['lessons', 'Leçons & Quiz', BookOpen],
              ['badges', 'Badges', Award],
              ['subs', 'Abonnements', CreditCard],
            ] as [Tab, string, typeof Globe][]).map(([key, label, Icon]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border ${tab === key ? 'bg-violet-500/20 border-violet-500/40 text-violet-200' : 'bg-[#111827] border-white/5 text-gray-400 hover:text-white'}`}
              >
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>

          {/* ==================== TAB: Mondes & Aventures ==================== */}
          {tab === 'content' && (
            <div className="space-y-4">
              <NewWorldForm onCreate={createWorld} busy={busy} />
              {worlds.map((w) => (
                <details key={w.id} className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden">
                  <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-white/5 transition-colors list-none">
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                    <span className="text-2xl">{w.icon}</span>
                    <span className="font-bold">{w.name}</span>
                    <span className="text-xs text-gray-500">{w.slug}</span>
                    <span className="ml-auto text-xs text-gray-500">{adventures.filter((a) => a.world_id === w.id).length} aventures</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${w.is_active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-500/20 text-gray-400'}`}>
                      {w.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </summary>
                  <div className="px-5 pb-5 space-y-4">
                    {/* Édition monde */}
                    <div className="bg-[#0f172a] rounded-xl p-4 border border-white/5">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        <div><label className={labelCls}>Nom</label><input className={inputCls} value={w.name} onChange={(e) => setWorlds((prev) => patch(prev, w.id, { name: e.target.value }))} /></div>
                        <div><label className={labelCls}>Icône (emoji)</label><input className={inputCls} value={w.icon} onChange={(e) => setWorlds((prev) => patch(prev, w.id, { icon: e.target.value }))} /></div>
                        <div>
                          <label className={labelCls}>Phase</label>
                          <select className={inputCls} value={w.phase} onChange={(e) => setWorlds((prev) => patch(prev, w.id, { phase: e.target.value }))}>
                            <option value="explorer">explorer</option><option value="creator">creator</option><option value="builder">builder</option>
                          </select>
                        </div>
                        <div className="md:col-span-2"><label className={labelCls}>Gradient (classes Tailwind)</label><input className={inputCls} value={w.gradient} onChange={(e) => setWorlds((prev) => patch(prev, w.id, { gradient: e.target.value }))} /></div>
                        <div><label className={labelCls}>Ordre</label><input type="number" className={inputCls} value={w.sort_order} onChange={(e) => setWorlds((prev) => patch(prev, w.id, { sort_order: Number(e.target.value) }))} /></div>
                        <div className="md:col-span-3"><label className={labelCls}>Description</label><textarea rows={2} className={inputCls} value={w.description} onChange={(e) => setWorlds((prev) => patch(prev, w.id, { description: e.target.value }))} /></div>
                        <label className="flex items-center gap-2 text-sm text-gray-300">
                          <input type="checkbox" checked={w.is_active} onChange={(e) => setWorlds((prev) => patch(prev, w.id, { is_active: e.target.checked }))} className="accent-violet-500" />
                          Monde actif
                        </label>
                      </div>
                      <SaveButton onClick={() => saveWorld(w)} busy={busy} />
                    </div>

                    {/* Aventures du monde */}
                    {adventures.filter((a) => a.world_id === w.id).map((a) => (
                      <details key={a.id} className="bg-[#0f172a] rounded-xl border border-white/5">
                        <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors list-none text-sm">
                          <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                          <span className="font-semibold">{a.title}</span>
                          <span className="text-xs text-gray-500">{a.slug}</span>
                          <span className="ml-auto text-xs text-violet-400">+{a.xp_reward} XP</span>
                          <span className={`text-xs ${a.is_published ? 'text-emerald-400' : 'text-gray-500'}`}>{a.is_published ? 'Publié' : 'Brouillon'}</span>
                        </summary>
                        <div className="px-4 pb-4 space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div><label className={labelCls}>Titre</label><input className={inputCls} value={a.title} onChange={(e) => setAdventures((prev) => patch(prev, a.id, { title: e.target.value }))} /></div>
                            <div><label className={labelCls}>XP</label><input type="number" className={inputCls} value={a.xp_reward} onChange={(e) => setAdventures((prev) => patch(prev, a.id, { xp_reward: Number(e.target.value) }))} /></div>
                            <div><label className={labelCls}>Ordre</label><input type="number" className={inputCls} value={a.sort_order} onChange={(e) => setAdventures((prev) => patch(prev, a.id, { sort_order: Number(e.target.value) }))} /></div>
                            <div className="md:col-span-3"><label className={labelCls}>Description</label><textarea rows={2} className={inputCls} value={a.description} onChange={(e) => setAdventures((prev) => patch(prev, a.id, { description: e.target.value }))} /></div>
                            <div className="md:col-span-3"><label className={labelCls}>Histoire (intro)</label><textarea rows={4} className={inputCls} value={a.story} onChange={(e) => setAdventures((prev) => patch(prev, a.id, { story: e.target.value }))} /></div>
                            <label className="flex items-center gap-2 text-sm text-gray-300">
                              <input type="checkbox" checked={a.is_published} onChange={(e) => setAdventures((prev) => patch(prev, a.id, { is_published: e.target.checked }))} className="accent-violet-500" />
                              Publiée
                            </label>
                          </div>
                          <SaveButton onClick={() => saveAdventure(a)} busy={busy} />
                        </div>
                      </details>
                    ))}

                    <NewAdventureForm worldId={w.id} onCreate={createAdventure} busy={busy} />
                  </div>
                </details>
              ))}
            </div>
          )}

          {/* ==================== TAB: Leçons & Quiz ==================== */}
          {tab === 'lessons' && (
            <div>
              <div className="mb-6">
                <label className={labelCls}>Aventure à éditer</label>
                <select
                  className={inputCls + ' max-w-2xl'}
                  value={selectedAdvId ?? ''}
                  onChange={(e) => { const v = e.target.value; if (v) loadAdventureContent(v); }}
                >
                  <option value="">— Choisir une aventure —</option>
                  {adventureOptions.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
                </select>
              </div>

              {loadingContent && <p className="text-gray-400 text-sm">Chargement du contenu…</p>}

              {selectedAdvId && !loadingContent && (
                <div className="space-y-6">
                  {/* Leçons */}
                  <div>
                    <h2 className="font-display text-lg font-bold mb-3 flex items-center gap-2"><BookOpen className="w-5 h-5 text-violet-400" /> Leçons ({lessons.length})</h2>
                    <div className="space-y-3">
                      {lessons.map((l, i) => (
                        <div key={l.id} className="bg-[#111827] border border-white/5 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-bold text-violet-400 bg-violet-500/10 px-2 py-1 rounded-full">{i + 1}. {l.section_type}</span>
                          </div>
                          <div className="mb-3"><label className={labelCls}>Titre</label><input className={inputCls} value={l.title} onChange={(e) => setLessons((prev) => patch(prev, l.id, { title: e.target.value }))} /></div>
                          <div className="mb-3"><label className={labelCls}>Contenu</label><textarea rows={6} className={inputCls} value={l.content} onChange={(e) => setLessons((prev) => patch(prev, l.id, { content: e.target.value }))} /></div>
                          <SaveButton onClick={() => saveLesson(l)} busy={busy} />
                        </div>
                      ))}
                      {lessons.length === 0 && <p className="text-gray-500 text-sm">Aucune leçon pour cette aventure.</p>}
                    </div>
                  </div>

                  {/* Quiz */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="font-display text-lg font-bold flex items-center gap-2"><Award className="w-5 h-5 text-yellow-400" /> Quiz ({quiz.length})</h2>
                      <button onClick={addQuizQuestion} disabled={busy} className="flex items-center gap-2 px-3 py-1.5 bg-violet-500/20 border border-violet-500/30 rounded-lg text-sm text-violet-300 hover:bg-violet-500/30 disabled:opacity-50">
                        <Plus className="w-4 h-4" /> Question
                      </button>
                    </div>
                    <div className="space-y-3">
                      {quiz.map((q, qi) => (
                        <div key={q.id} className="bg-[#111827] border border-white/5 rounded-xl p-4">
                          <div className="mb-3"><label className={labelCls}>Question {qi + 1}</label><textarea rows={2} className={inputCls} value={q.question} onChange={(e) => setQuiz((prev) => patch(prev, q.id, { question: e.target.value }))} /></div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                            {q.options.map((opt, oi) => (
                              <div key={oi} className="flex items-center gap-2">
                                <input type="radio" name={`correct-${q.id}`} checked={q.correct_index === oi} onChange={() => setQuiz((prev) => patch(prev, q.id, { correct_index: oi }))} className="accent-emerald-500" title="Bonne réponse" />
                                <input className={inputCls} value={opt} onChange={(e) => setQuiz((prev) => patch(prev, q.id, { options: q.options.map((o, j) => (j === oi ? e.target.value : o)) }))} />
                              </div>
                            ))}
                          </div>
                          <div className="mb-3"><label className={labelCls}>Explication</label><textarea rows={2} className={inputCls} value={q.explanation ?? ''} onChange={(e) => setQuiz((prev) => patch(prev, q.id, { explanation: e.target.value }))} /></div>
                          <div className="flex items-center gap-3">
                            <SaveButton onClick={() => saveQuizQuestion(q)} busy={busy} />
                            <button onClick={() => deleteQuizQuestion(q)} disabled={busy} className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-300 hover:bg-red-500/20 disabled:opacity-50">
                              <Trash2 className="w-4 h-4" /> Supprimer
                            </button>
                          </div>
                        </div>
                      ))}
                      {quiz.length === 0 && <p className="text-gray-500 text-sm">Aucune question pour cette aventure.</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB: Badges ==================== */}
          {tab === 'badges' && (
            <div className="space-y-4">
              <NewBadgeForm onCreate={createBadge} busy={busy} />
              {badges.map((b) => (
                <div key={b.id} className="bg-[#111827] border border-white/5 rounded-xl p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                    <div><label className={labelCls}>Nom</label><input className={inputCls} value={b.name} onChange={(e) => setBadges((prev) => patch(prev, b.id, { name: e.target.value }))} /></div>
                    <div><label className={labelCls}>Icône</label><input className={inputCls} value={b.icon} onChange={(e) => setBadges((prev) => patch(prev, b.id, { icon: e.target.value }))} /></div>
                    <div>
                      <label className={labelCls}>Rareté</label>
                      <select className={inputCls} value={b.rarity} onChange={(e) => setBadges((prev) => patch(prev, b.id, { rarity: e.target.value }))}>
                        <option value="common">common</option><option value="rare">rare</option><option value="epic">epic</option><option value="legendary">legendary</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Monde (optionnel)</label>
                      <select className={inputCls} value={b.world_id ?? ''} onChange={(e) => setBadges((prev) => patch(prev, b.id, { world_id: e.target.value || null }))}>
                        <option value="">— Aucun —</option>
                        {worlds.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                      </select>
                    </div>
                    <div><label className={labelCls}>XP requis</label><input type="number" className={inputCls} value={b.xp_required} onChange={(e) => setBadges((prev) => patch(prev, b.id, { xp_required: Number(e.target.value) }))} /></div>
                    <div><label className={labelCls}>Complétions monde requis</label><input type="number" className={inputCls} value={b.required_completions} onChange={(e) => setBadges((prev) => patch(prev, b.id, { required_completions: Number(e.target.value) }))} /></div>
                    <div><label className={labelCls}>Ordre</label><input type="number" className={inputCls} value={b.sort_order} onChange={(e) => setBadges((prev) => patch(prev, b.id, { sort_order: Number(e.target.value) }))} /></div>
                    <div className="flex items-end"><span className="text-xs text-gray-500">slug : {b.slug}</span></div>
                    <div className="md:col-span-4"><label className={labelCls}>Description</label><textarea rows={2} className={inputCls} value={b.description} onChange={(e) => setBadges((prev) => patch(prev, b.id, { description: e.target.value }))} /></div>
                  </div>
                  <SaveButton onClick={() => saveBadge(b)} busy={busy} />
                </div>
              ))}
            </div>
          )}

          {/* ==================== TAB: Abonnements ==================== */}
          {tab === 'subs' && (
            <div className="bg-[#111827] border border-white/5 rounded-2xl overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-white/5">
                    <th className="px-4 py-3 font-medium">Parent</th>
                    <th className="px-4 py-3 font-medium">Plan actuel</th>
                    <th className="px-4 py-3 font-medium">Statut</th>
                    <th className="px-4 py-3 font-medium">Expire le</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.filter((p) => p.role === 'parent').map((p) => {
                    const s = latestSubFor(p.id);
                    return (
                      <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="px-4 py-3">
                          <div className="font-semibold">{p.full_name || '(sans nom)'}</div>
                          <div className="text-xs text-gray-500">{p.phone ?? ''}</div>
                        </td>
                        <td className="px-4 py-3"><span className="capitalize text-violet-300">{s?.plan_code ?? 'starter'}</span></td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${s?.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : s?.status === 'trial' ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-500/20 text-gray-400'}`}>
                            {s?.status ?? '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400">{s?.expires_at ? new Date(s.expires_at).toLocaleDateString('fr-FR') : '—'}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2 justify-end flex-wrap">
                            <button onClick={() => activateSub(p.id, 'explorer')} disabled={busy} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 disabled:opacity-50">Activer Explorer</button>
                            <button onClick={() => activateSub(p.id, 'pro')} disabled={busy} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 disabled:opacity-50">Activer Pro</button>
                            <button onClick={() => expireSub(p.id)} disabled={busy} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 disabled:opacity-50">Expirer</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {profiles.filter((p) => p.role === 'parent').length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">Aucun parent inscrit.</td></tr>
                  )}
                </tbody>
              </table>
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

// ---------------------------------------------------------------------------
// Petits composants locaux
// ---------------------------------------------------------------------------
function SaveButton({ onClick, busy }: { onClick: () => void; busy: boolean }) {
  return (
    <button onClick={onClick} disabled={busy} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-sm font-semibold text-emerald-300 hover:bg-emerald-500/30 disabled:opacity-50 transition-colors">
      <Save className="w-4 h-4" /> Enregistrer
    </button>
  );
}

function NewWorldForm({ onCreate, busy }: { onCreate: (f: { slug: string; name: string; icon: string; gradient: string; phase: string; description: string }) => void; busy: boolean }) {
  const [open, setOpen] = useState(false);
  const [slug, setSlug] = useState('');
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🌐');
  const [gradient, setGradient] = useState('from-blue-500 to-cyan-400');
  const [phase, setPhase] = useState('explorer');
  const [description, setDescription] = useState('');

  function submit() {
    if (!slug || !name) return;
    onCreate({ slug, name, icon, gradient, phase, description });
    setSlug(''); setName(''); setDescription(''); setOpen(false);
  }

  return (
    <div className="bg-[#111827] border border-dashed border-white/10 rounded-2xl p-4">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 text-sm font-semibold text-violet-300 hover:text-violet-200">
        <Plus className="w-4 h-4" /> Nouveau monde
      </button>
      {open && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          <div><label className={labelCls}>Slug (unique)</label><input className={inputCls} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="ex : robotique" /></div>
          <div><label className={labelCls}>Nom</label><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><label className={labelCls}>Icône</label><input className={inputCls} value={icon} onChange={(e) => setIcon(e.target.value)} /></div>
          <div><label className={labelCls}>Gradient</label><input className={inputCls} value={gradient} onChange={(e) => setGradient(e.target.value)} /></div>
          <div>
            <label className={labelCls}>Phase</label>
            <select className={inputCls} value={phase} onChange={(e) => setPhase(e.target.value)}>
              <option value="explorer">explorer</option><option value="creator">creator</option><option value="builder">builder</option>
            </select>
          </div>
          <div className="md:col-span-3"><label className={labelCls}>Description</label><textarea rows={2} className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)} /></div>
          <div><button onClick={submit} disabled={busy || !slug || !name} className="px-4 py-2 bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50">Créer le monde</button></div>
        </div>
      )}
    </div>
  );
}

function NewAdventureForm({ worldId, onCreate, busy }: { worldId: string; onCreate: (worldId: string, f: { slug: string; title: string; xp: number; description: string }) => void; busy: boolean }) {
  const [open, setOpen] = useState(false);
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [xp, setXp] = useState(100);
  const [description, setDescription] = useState('');

  function submit() {
    if (!slug || !title) return;
    onCreate(worldId, { slug, title, xp, description });
    setSlug(''); setTitle(''); setDescription(''); setOpen(false);
  }

  return (
    <div className="bg-[#0f172a] border border-dashed border-white/10 rounded-xl p-3">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 text-sm font-semibold text-violet-300 hover:text-violet-200">
        <Plus className="w-4 h-4" /> Nouvelle aventure
      </button>
      {open && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3">
          <div><label className={labelCls}>Slug (unique)</label><input className={inputCls} value={slug} onChange={(e) => setSlug(e.target.value)} /></div>
          <div><label className={labelCls}>Titre</label><input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div><label className={labelCls}>XP</label><input type="number" className={inputCls} value={xp} onChange={(e) => setXp(Number(e.target.value))} /></div>
          <div className="md:col-span-4"><label className={labelCls}>Description</label><textarea rows={2} className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)} /></div>
          <div><button onClick={submit} disabled={busy || !slug || !title} className="px-4 py-2 bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50">Créer l&apos;aventure</button></div>
        </div>
      )}
    </div>
  );
}

function NewBadgeForm({ onCreate, busy }: { onCreate: (f: { slug: string; name: string; icon: string; rarity: string; xp: number; completions: number; description: string }) => void; busy: boolean }) {
  const [open, setOpen] = useState(false);
  const [slug, setSlug] = useState('');
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🏆');
  const [rarity, setRarity] = useState('common');
  const [xp, setXp] = useState(0);
  const [completions, setCompletions] = useState(0);
  const [description, setDescription] = useState('');

  function submit() {
    if (!slug || !name) return;
    onCreate({ slug, name, icon, rarity, xp, completions, description });
    setSlug(''); setName(''); setDescription(''); setOpen(false);
  }

  return (
    <div className="bg-[#111827] border border-dashed border-white/10 rounded-2xl p-4">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 text-sm font-semibold text-violet-300 hover:text-violet-200">
        <Plus className="w-4 h-4" /> Nouveau badge
      </button>
      {open && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
          <div><label className={labelCls}>Slug (unique)</label><input className={inputCls} value={slug} onChange={(e) => setSlug(e.target.value)} /></div>
          <div><label className={labelCls}>Nom</label><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><label className={labelCls}>Icône</label><input className={inputCls} value={icon} onChange={(e) => setIcon(e.target.value)} /></div>
          <div>
            <label className={labelCls}>Rareté</label>
            <select className={inputCls} value={rarity} onChange={(e) => setRarity(e.target.value)}>
              <option value="common">common</option><option value="rare">rare</option><option value="epic">epic</option><option value="legendary">legendary</option>
            </select>
          </div>
          <div><label className={labelCls}>XP requis</label><input type="number" className={inputCls} value={xp} onChange={(e) => setXp(Number(e.target.value))} /></div>
          <div><label className={labelCls}>Complétions monde requis</label><input type="number" className={inputCls} value={completions} onChange={(e) => setCompletions(Number(e.target.value))} /></div>
          <div className="md:col-span-2"><label className={labelCls}>Description</label><input className={inputCls} value={description} onChange={(e) => setDescription(e.target.value)} /></div>
          <div><button onClick={submit} disabled={busy || !slug || !name} className="px-4 py-2 bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50">Créer le badge</button></div>
        </div>
      )}
    </div>
  );
}
