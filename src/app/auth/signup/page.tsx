'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Mail, Lock, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const GRADES = ['6e','5e','4e','3e','2nde','1ère','Terminale'];
const INTERESTS = ['Jeux vidéo','Dessin','Musique','Sport','Science','Programmation','Réseaux sociaux','Cinéma','Lecture','Entrepreneuriat','Environnement','Robotique','Photographie'];

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email:'', password:'', pseudonym:'', age:'', gradeLevel:'', interests:[], goal:'' });

  const updateForm = (field: string, value: unknown) => { setForm(p => ({ ...p, [field]: value })); setError(''); };
  const toggleItem = (list: string[], item: string) => list.includes(item) ? list.filter(i => i !== item) : [...list, item];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.pseudonym || !form.age || !form.gradeLevel) { setError('Remplis tous les champs'); return; }
    if (form.password.length < 6) { setError('Mot de passe: 6 caractères minimum'); return; }
    setLoading(true);
    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { pseudonym: form.pseudonym, age: parseInt(form.age), gradeLevel: form.gradeLevel, interests: form.interests } },
    });
    if (signUpError) { setError(signUpError.message); setLoading(false); return; }
    if (data.user) {
      const phase = ['6e','5e'].includes(form.gradeLevel) ? 'explorer' : ['4e','3e'].includes(form.gradeLevel) ? 'creator' : 'builder';
      const profile = { id: data.user.id, pseudonym: form.pseudonym, age: parseInt(form.age), gradeLevel: form.gradeLevel, phase, xp: 0, level: 1, interests: form.interests };
      localStorage.setItem('de_profile', JSON.stringify(profile));
      localStorage.setItem('de_auth', 'true');
      router.push('/dashboard');
    }
  };

  const handleGoogle = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { queryParams: { access_type: 'offline', prompt: 'consent' }, redirectTo: window.location.origin + '/auth/onboarding' },
    });
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen bg-[#060810] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] bg-clip-text text-transparent">Digital Explorers</Link>
          <p className="text-gray-400 mt-2">Crée ton profil</p>
        </div>
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-8">
          <button onClick={handleGoogle} className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-all mb-6">
            <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continuer avec Google
          </button>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500">ou par email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input type="email" value={form.email} onChange={e=>updateForm('email',e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="ton@email.com" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input type="password" value={form.password} onChange={e=>updateForm('password',e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="6 caractères minimum" minLength={6} required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Pseudonyme *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input type="text" value={form.pseudonym} onChange={e=>updateForm('pseudonym',e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Ex: Awa, Koffi..." required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Âge *</label>
                <input type="number" min={11} max={18} value={form.age} onChange={e=>updateForm('age',e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="14" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Classe *</label>
                <select value={form.gradeLevel} onChange={e=>updateForm('gradeLevel',e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none">
                  <option value="" className="bg-[#0f172a]">Sélectionne...</option>
                  {GRADES.map(g => <option key={g} value={g} className="bg-[#0f172a]">{g}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Centres d intérêt</label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map(item => (
                  <button key={item} type="button" onClick={()=>updateForm('interests',toggleItem(form.interests,item))} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${form.interests.includes(item)?'bg-gradient-to-r from-violet-500 to-purple-500 text-white':'bg-[#0f172a] text-gray-300 border border-white/10 hover:border-violet-500/50'}`}>{item}</button>
                ))}
              </div>
            </div>
            {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg p-3">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? 'Création...' : <>Commencer l aventure <Heart className="w-5 h-5" /></>}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-400">
            Deja un compte ? <Link href="/auth/login" className="text-violet-400 hover:underline">Se connecter</Link>
          </div>
          <div className="mt-4 text-center"><Link href="/" className="text-sm text-gray-500 hover:text-gray-300">← Retour à l accueil</Link></div>
        </div>
      </div>
    </div>
  );
}
