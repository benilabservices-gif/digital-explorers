'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Mail, Lock, User, Plus, ChevronLeft, ArrowRight } from 'lucide-react';
import { GRADES, CHILD_INTERESTS, CHILD_AVATARS } from '@/data/content';
import { createClient } from '@/lib/supabase/client';

type Step = 'parent' | 'confirm' | 'child' | 'done';

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
    <div className="min-h-screen bg-[#060810] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] bg-clip-text text-transparent">Digital Explorers</Link>
          <p className="text-gray-400 mt-2">
            {step === 'parent' && 'Crée ton compte parent'}
            {step === 'confirm' && 'Vérifie ta boîte mail'}
            {step === 'child' && "Ajoute ton premier enfant"}
            {step === 'done' && 'Tout est prêt !'}
          </p>
        </div>
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            {(['parent','child','done'] as Step[]).map((s) => (
              <div key={s} className={`flex-1 h-1.5 rounded-full ${s===step?'bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6]':'bg-white/10'}`} />
            ))}
          </div>

          {step === 'parent' && (
            <>
              <form onSubmit={handleParentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Nom du parent *</label>
                  <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" /><input type="text" value={parentForm.name} onChange={e=>updateParent('name',e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Ton nom" required /></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email *</label>
                  <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" /><input type="email" value={parentForm.email} onChange={e=>updateParent('email',e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="ton@email.com" required /></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Téléphone</label>
                  <input type="tel" value={parentForm.phone} onChange={e=>updateParent('phone',e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="+225 07 00 00 00 00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Mot de passe *</label>
                  <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" /><input type="password" value={parentForm.password} onChange={e=>updateParent('password',e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="6 caractères minimum" minLength={6} required /></div>
                </div>
                {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg p-3">{error}</p>}
                <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? 'Création...' : <><Heart className="w-5 h-5" /> Continuer</>}
                </button>
              </form>
              <div className="mt-6 text-center text-sm text-gray-400">Déjà un compte ? <Link href="/auth/login" className="text-violet-400 hover:underline">Se connecter</Link></div>
            </>
          )}

          {step === 'confirm' && (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">📧</div>
              <h2 className="font-display text-xl font-bold mb-2">Compte créé !</h2>
              <p className="text-gray-400 mb-6">Nous t&apos;avons envoyé un email de confirmation à <span className="text-white">{parentForm.email}</span>. Clique sur le lien qu&apos;il contient pour activer ton compte, puis connecte-toi.</p>
              <Link href="/auth/login">
                <button className="px-8 py-3 bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] rounded-full font-semibold hover:opacity-90 transition-opacity">
                  Aller à la connexion
                </button>
              </Link>
            </div>
          )}

          {step === 'child' && (
            <>
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">{childForm.avatar}</div>
                <p className="text-sm text-gray-400">Crée le profil de ton enfant</p>
              </div>
              <form onSubmit={handleChildSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Prénom de l&apos;enfant *</label>
                  <input type="text" value={childForm.name} onChange={e=>updateChild('name',e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Ex: Awa, Koffi..." required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Âge *</label>
                    <input type="number" min={11} max={18} value={childForm.age} onChange={e=>updateChild('age',e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="14" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Classe *</label>
                    <select value={childForm.gradeLevel} onChange={e=>updateChild('gradeLevel',e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none">
                      <option value="" className="bg-[#0f172a]">Sélectionne...</option>
                      {GRADES.map(g => <option key={g} value={g} className="bg-[#0f172a]">{g}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Avatar</label>
                  <div className="flex flex-wrap gap-2">
                    {CHILD_AVATARS.map((av,i) => (
                      <button key={i} type="button" onClick={()=>updateChild('avatar',av)} className={`text-2xl w-10 h-10 rounded-xl flex items-center justify-center transition-all ${childForm.avatar===av?'border-2 border-violet-400 bg-violet-500/20':'border border-white/10 hover:border-white/30'}`}>{av}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Centres d&apos;intérêt</label>
                  <div className="flex flex-wrap gap-2">
                    {CHILD_INTERESTS.map(item => (
                      <button key={item} type="button" onClick={()=>toggleInterest(item)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${childForm.interests.includes(item)?'bg-gradient-to-r from-violet-500 to-purple-500 text-white':'bg-[#0f172a] text-gray-300 border border-white/10 hover:border-violet-500/50'}`}>{item}</button>
                    ))}
                  </div>
                </div>
                {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg p-3">{error}</p>}
                <div className="flex gap-3">
                  <button type="button" onClick={()=>router.push('/dashboard')} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-all flex items-center justify-center gap-2"><ChevronLeft className="w-4 h-4" /> Plus tard</button>
                  <button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> {loading ? 'Ajout...' : 'Ajouter'}</button>
                </div>
              </form>
              <div className="mt-4 text-center text-xs text-gray-500">Tu peux ajouter d&apos;autres enfants depuis le dashboard</div>
            </>
          )}

          {step === 'done' && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="font-display text-2xl font-bold mb-2">Bienvenue !</h2>
              <p className="text-gray-400 mb-6">Ton compte parent est prêt. Accède au dashboard pour gérer tes enfants.</p>
              <Link href="/dashboard">
                <button className="px-8 py-3 bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] rounded-full font-semibold hover:opacity-90 transition-opacity">
                  Aller au dashboard <ArrowRight className="w-5 h-5 inline" />
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
