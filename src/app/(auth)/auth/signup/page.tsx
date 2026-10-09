'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Mail, Lock, User, Plus, ChevronLeft, ArrowRight } from 'lucide-react';
import { GRADES, CHILD_INTERESTS, CHILD_AVATARS } from '@/data/content';
import { createClient } from '@/lib/supabase/client';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TESTIDS } from '@/lib/testids';

// ─────────────────────────────────────────────────────────────────────────────
// Inscription en 4 étapes (parent → confirm → child → done) — îlot client.
// Habillage tokens-only. Contrats e2e verbatim (smoke.spec.ts, atteinte via
// dashboard « Ajouter un enfant ») : « Ajoute ton premier enfant »,
// placeholder « Ex: Awa, Koffi... », input[type=number], select,
// bouton « Ajouter » (exact), « Tout est prêt ! », bouton /Aller au dashboard/.
// NB : le CTA « Aller au dashboard » garde un <button> imbriqué dans le <Link>
// car la spec exige le RÔLE « button » (un <a> stylé aurait le rôle « link »).
// ─────────────────────────────────────────────────────────────────────────────

type Step = 'parent' | 'confirm' | 'child' | 'done';

const inputCls =
  'w-full rounded-xl border border-line bg-night-600 px-4 py-3 text-ink placeholder:text-ink-faint transition-colors focus:border-line-lit';
const labelCls = 'mb-1 block text-sm font-medium text-ink-soft';
const errorCls = 'rounded-lg border border-danger-500/30 bg-danger-500/10 p-3 text-sm text-danger-300';

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('parent');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [parentForm, setParentForm] = useState({ email:'', password:'', name:'', phone:'' });
  const [childForm, setChildForm] = useState({ name:'', age:'', gradeLevel:'', avatar: CHILD_AVATARS[0], interests: [] as string[], goal:'explorer' });

  // Si déjà connecté, aller directement à la création du profil enfant
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setStep('child');
    });
  }, []);

  const updateParent = (field: string, value: unknown) => setParentForm(p => ({ ...p, [field]: value }));
  const updateChild = (field: string, value: unknown) => setChildForm(p => ({ ...p, [field]: value }));
  const toggleInterest = (item: string) => {
    const list = childForm.interests.includes(item)
      ? childForm.interests.filter(i => i !== item)
      : [...childForm.interests, item];
    updateChild('interests', list);
  };

  const handleParentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentForm.email || !parentForm.password || !parentForm.name) { setError('Remplis tous les champs obligatoires'); return; }
    if (parentForm.password.length < 6) { setError('Mot de passe : 6 caractères minimum'); return; }
    setLoading(true);
    setError('');

    const supabase = createClient();
    // full_name et phone alimentent le trigger handle_new_user qui crée le profil parent
    const { data, error: authError } = await supabase.auth.signUp({
      email: parentForm.email,
      password: parentForm.password,
      options: {
        data: {
          full_name: parentForm.name,
          ...(parentForm.phone ? { phone: parentForm.phone } : {}),
        },
      },
    });

    if (authError) {
      const m = authError.message.toLowerCase();
      if (m.includes('already registered') || m.includes('already exists')) {
        setError('Un compte existe déjà avec cet email. Connecte-toi.');
      } else if (m.includes('weak') || m.includes('password')) {
        setError('Mot de passe trop simple : 6 caractères minimum.');
      } else if (m.includes('rate limit') || m.includes('too many')) {
        setError('Trop de tentatives. Réessaie dans quelques minutes.');
      } else {
        setError('Inscription impossible : ' + authError.message);
      }
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError('Inscription impossible. Réessaie.');
      setLoading(false);
      return;
    }

    // Pas de session : confirmation d'email requise (config staging/prod)
    if (!data.session) {
      setStep('confirm');
      setLoading(false);
      return;
    }

    setLoading(false);
    setStep('child');
  };

  const handleChildSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!childForm.name || !childForm.age || !childForm.gradeLevel) { setError('Remplis les champs obligatoires'); return; }
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Session expirée. Connecte-toi à nouveau.');
      setLoading(false);
      router.push('/auth/login');
      return;
    }

    const age = parseInt(childForm.age);
    const phase = ['6e','5e'].includes(childForm.gradeLevel) ? 'explorer' : ['4e','3e'].includes(childForm.gradeLevel) ? 'creator' : 'builder';

    const { error: insertError } = await supabase.from('children').insert({
      parent_id: user.id,
      name: childForm.name,
      age,
      grade_level: childForm.gradeLevel,
      avatar: childForm.avatar,
      interests: childForm.interests,
      xp: 0,
      level: 1,
      phase,
    });

    if (insertError) {
      setError('Impossible de créer le profil enfant : ' + insertError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setStep('done');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-night-950 px-4 py-12 text-ink">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="bg-linear-to-r from-sunrise-500 to-gleam-400 bg-clip-text text-2xl font-bold text-transparent">Digital Explorers</Link>
          <p className="mt-2 text-ink-soft">
            {step === 'parent' && 'Crée ton compte parent'}
            {step === 'confirm' && 'Vérifie ta boîte mail'}
            {step === 'child' && "Ajoute ton premier enfant"}
            {step === 'done' && 'Tout est prêt !'}
          </p>
        </div>
        <Card className="rounded-2xl p-8">
          <div className="mb-6 flex items-center gap-2">
            {(['parent','child','done'] as Step[]).map((s) => (
              <div key={s} className={`h-1.5 flex-1 rounded-full ${s===step?'bg-linear-to-r from-sunrise-500 to-gleam-400':'bg-night-600'}`} />
            ))}
          </div>

          {step === 'parent' && (
            <>
              <form onSubmit={handleParentSubmit} className="space-y-4">
                <div>
                  <label htmlFor="signup-name" className={labelCls}>Nom du parent *</label>
                  <div className="relative"><User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-faint" aria-hidden="true" /><input id="signup-name" type="text" value={parentForm.name} onChange={e=>updateParent('name',e.target.value)} className={`${inputCls} pl-10`} placeholder="Ton nom" required /></div>
                </div>
                <div>
                  <label htmlFor="signup-email" className={labelCls}>Email *</label>
                  <div className="relative"><Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-faint" aria-hidden="true" /><input id="signup-email" type="email" value={parentForm.email} onChange={e=>updateParent('email',e.target.value)} className={`${inputCls} pl-10`} placeholder="ton@email.com" required /></div>
                </div>
                <div>
                  <label htmlFor="signup-phone" className={labelCls}>Téléphone</label>
                  <input id="signup-phone" type="tel" value={parentForm.phone} onChange={e=>updateParent('phone',e.target.value)} className={inputCls} placeholder="+225 07 00 00 00 00" />
                </div>
                <div>
                  <label htmlFor="signup-password" className={labelCls}>Mot de passe *</label>
                  <div className="relative"><Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-faint" aria-hidden="true" /><input id="signup-password" type="password" value={parentForm.password} onChange={e=>updateParent('password',e.target.value)} className={`${inputCls} pl-10`} placeholder="6 caractères minimum" minLength={6} required /></div>
                </div>
                {error && <p className={errorCls}>{error}</p>}
                <Button type="submit" disabled={loading} className="h-12 w-full">
                  {loading ? 'Création...' : <><Heart className="h-5 w-5" /> Continuer</>}
                </Button>
              </form>
              <div className="mt-6 text-center text-sm text-ink-soft">Déjà un compte ? <Link href="/auth/login" className="font-medium text-sunrise-400 hover:text-sunrise-300">Se connecter</Link></div>
            </>
          )}

          {step === 'confirm' && (
            <div className="py-8 text-center">
              <div className="mb-4 text-5xl" aria-hidden="true">📧</div>
              <h2 className="font-display mb-2 text-xl font-bold">Compte créé !</h2>
              <p className="mb-6 text-ink-soft">Nous t'avons envoyé un email de confirmation à <span className="text-ink">{parentForm.email}</span>. Clique sur le lien qu'il contient pour activer ton compte, puis connecte-toi.</p>
              <Link href="/auth/login" className={buttonVariants()}>
                Aller à la connexion
              </Link>
            </div>
          )}

          {step === 'child' && (
            <>
              <div className="mb-6 text-center">
                <div className="mb-2 text-4xl" aria-hidden="true">{childForm.avatar}</div>
                <p className="text-sm text-ink-soft">Crée le profil de ton enfant</p>
              </div>
              <form onSubmit={handleChildSubmit} className="space-y-4">
                <div>
                  <label htmlFor="child-name" className={labelCls}>Prénom de l'enfant *</label>
                  <input id="child-name" type="text" value={childForm.name} onChange={e=>updateChild('name',e.target.value)} className={inputCls} placeholder="Ex: Awa, Koffi..." data-testid={TESTIDS.auth.childName} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="child-age" className={labelCls}>Âge *</label>
                    <input id="child-age" type="number" min={11} max={18} value={childForm.age} onChange={e=>updateChild('age',e.target.value)} className={inputCls} placeholder="14" data-testid={TESTIDS.auth.childAge} required />
                  </div>
                  <div>
                    <label htmlFor="child-grade" className={labelCls}>Classe *</label>
                    <select id="child-grade" value={childForm.gradeLevel} onChange={e=>updateChild('gradeLevel',e.target.value)} className={inputCls} data-testid={TESTIDS.auth.childGrade}>
                      <option value="" className="bg-night-850">Sélectionne...</option>
                      {GRADES.map(g => <option key={g} value={g} className="bg-night-850">{g}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-ink-soft">Avatar</label>
                  <div className="flex flex-wrap gap-2">
                    {CHILD_AVATARS.map((av,i) => (
                      <button key={i} type="button" onClick={()=>updateChild('avatar',av)} className={`flex h-10 w-10 items-center justify-center rounded-xl text-2xl transition-all ${childForm.avatar===av?'border-2 border-sunrise-500 bg-sunrise-500/10':'border border-line hover:border-line-lit'}`}>{av}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-ink-soft">Centres d'intérêt</label>
                  <div className="flex flex-wrap gap-2">
                    {CHILD_INTERESTS.map(item => (
                      <button key={item} type="button" onClick={()=>toggleInterest(item)} className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${childForm.interests.includes(item)?'border-sunrise-500 bg-sunrise-500/10 text-sunrise-300':'border-line bg-night-600 text-ink-soft hover:border-line-lit'}`}>{item}</button>
                    ))}
                  </div>
                </div>
                {error && <p className={errorCls}>{error}</p>}
                <div className="flex gap-3">
                  <Button type="button" variant="secondary" onClick={()=>router.push('/dashboard')} className="h-12 flex-1">
                    <ChevronLeft className="h-4 w-4" /> Plus tard
                  </Button>
                  <Button type="submit" disabled={loading} data-testid={TESTIDS.auth.childSubmit} className="h-12 flex-1">
                    <Plus className="h-4 w-4" /> {loading ? 'Ajout...' : 'Ajouter'}
                  </Button>
                </div>
              </form>
              <div className="mt-4 text-center text-xs text-ink-faint">Tu peux ajouter d'autres enfants depuis le dashboard</div>
            </>
          )}

          {step === 'done' && (
            <div className="py-8 text-center">
              <div className="mb-4 text-6xl" aria-hidden="true">🎉</div>
              <h2 className="font-display mb-2 text-2xl font-bold">Bienvenue !</h2>
              <p className="mb-6 text-ink-soft">Ton compte parent est prêt. Accède au dashboard pour gérer tes enfants.</p>
              {/* Rôle « button » exigé par la spec e2e — voir bannière du fichier. */}
              <Link href="/dashboard">
                <button className={buttonVariants()}>
                  Aller au dashboard <ArrowRight className="h-5 w-5 inline" />
                </button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
