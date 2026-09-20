'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Mail, Lock, User, Plus, ChevronLeft, ArrowRight } from 'lucide-react';
import { GRADES, CHILD_INTERESTS, CHILD_AVATARS } from '@/data/content';

type Step = 'parent' | 'child' | 'done';

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('parent');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

undefined = useState({ email:'', password:'', name:'', phone:'' });
  const [childForm, setChildForm] = useState({ name:'', age:'', gradeLevel:'', avatar: CHILD_AVATARS[0], interests:[], goal:'explorer' });

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
    if (parentForm.password.length < 6) { setError('Mot de passe: 6 caractères minimum'); return; }
    setLoading(true);
    setError('');
    
    // Simulate API delay
    await new Promise(r => setTimeout(r, 800));
    
    // Store parent info with expiration (30 days)
    const expiresIn = Date.now() + (30 * 24 * 60 * 60 * 1000);
    localStorage.setItem('de_auth', 'true');
    localStorage.setItem('de_auth_expires', expiresIn.toString());
    localStorage.setItem('de_parent_email', parentForm.email);
    localStorage.setItem('de_parent_name', parentForm.name);
    localStorage.setItem('de_parent_id', 'parent_' + Date.now());
    localStorage.setItem('de_children', '[]');
    localStorage.setItem('de_plan', 'starter');
    setLoading(false);
    setStep('child');
  };

  const handleChildSubmit = () => {
    if (!childForm.name || !childForm.age || !childForm.gradeLevel) { setError('Remplis les champs obligatoires'); return; }
    
    const age = parseInt(childForm.age);
    const phase = ['6e','5e'].includes(childForm.gradeLevel) ? 'explorer' : ['4e','3e'].includes(childForm.gradeLevel) ? 'creator' : 'builder';
    const child = {
      id: 'child_' + Date.now(),
      name: childForm.name,
      age,
      gradeLevel: childForm.gradeLevel,
      avatar: childForm.avatar,
      xp: 0,
      level: 1,
      phase,
      badges: [],
      adventuresCompleted: [],
      interests: childForm.interests,
      createdAt: new Date().toISOString(),
    };
    
    const children = JSON.parse(localStorage.getItem('de_children') || '[]');
    children.push(child);
    localStorage.setItem('de_children', JSON.stringify(children));
    localStorage.setItem('de_active_child', JSON.stringify(child));
    setStep('done');
  };

  const handleGoogle = () => {
    const expiresIn = Date.now() + (30 * 24 * 60 * 60 * 1000);
    localStorage.setItem('de_auth', 'true');
    localStorage.setItem('de_auth_expires', expiresIn.toString());
    localStorage.setItem('de_parent_email', 'parent@google.com');
    localStorage.setItem('de_parent_name', 'Parent Google');
    localStorage.setItem('de_parent_id', 'parent_google_' + Date.now());
    localStorage.setItem('de_children', '[]');
    localStorage.setItem('de_plan', 'starter');
    setStep('child');
  };

  return (
    <div className="min-h-screen bg-[#060810] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] bg-clip-text text-transparent">Digital Explorers</Link>
          <p className="text-gray-400 mt-2">
            {step === 'parent' && 'Crée ton compte parent'}
            {step === 'child' && "Ajoute ton premier enfant"}
            {step === 'done' && 'Tout est prêt !'}
          </p>
        </div>
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            {(['parent','child','done'] as Step[]).map((s,i) => (
              <div key={s} className={`flex-1 h-1.5 rounded-full ${s===step?'bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6]':'bg-white/10'}`} />
            ))}
          </div>

          {step === 'parent' && (
            <>
              <button onClick={handleGoogle} className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-all mb-6">
                <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continuer avec Google
              </button>
              <div className="flex items-center gap-3 mb-6"><div className="flex-1 h-px bg-white/10" /><span className="text-xs text-gray-500">ou par email</span><div className="flex-1 h-px bg-white/10" /></div>
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

          {step === 'child' && (
            <>
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">{childForm.avatar}</div>
                <p className="text-sm text-gray-400">Crée le profil de ton enfant</p>
              </div>
              <form onSubmit={(e)=>{e.preventDefault();handleChildSubmit();}} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Prénom de l'enfant *</label>
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Centres d intérêt</label>
                  <div className="flex flex-wrap gap-2">
                    {CHILD_INTERESTS.map(item => (
                      <button key={item} type="button" onClick={()=>toggleInterest(item)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${childForm.interests.includes(item)?'bg-gradient-to-r from-violet-500 to-purple-500 text-white':'bg-[#0f172a] text-gray-300 border border-white/10 hover:border-violet-500/50'}`}>{item}</button>
                    ))}
                  </div>
                </div>
                {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg p-3">{error}</p>}
                <div className="flex gap-3">
                  <button type="button" onClick={()=>setStep('parent')} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-all flex items-center justify-center gap-2"><ChevronLeft className="w-4 h-4" /> Retour</button>
                  <button type="submit" className="flex-1 bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Ajouter</button>
                </div>
              </form>
              <div className="mt-4 text-center text-xs text-gray-500">Tu peux ajouter d'autres enfants depuis le dashboard</div>
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
