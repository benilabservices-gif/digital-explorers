'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Mail, Lock, User } from 'lucide-react';

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
    const phase = ['6e','5e'].includes(form.gradeLevel) ? 'explorer' : ['4e','3e'].includes(form.gradeLevel) ? 'creator' : 'builder';
    const profile = { id:'local_'+Date.now(), pseudonym:form.pseudonym, age:parseInt(form.age), gradeLevel:form.gradeLevel, phase, xp:0, level:1, interests:form.interests };
    localStorage.setItem('de_profile', JSON.stringify(profile));
    localStorage.setItem('de_auth', 'true');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Digital Explorers</Link>
          <p className="text-gray-400 mt-2">Crée ton profil</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input type="email" value={form.email} onChange={e=>updateForm('email',e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="ton@email.com" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input type="password" value={form.password} onChange={e=>updateForm('password',e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="6 caractères minimum" minLength={6} required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Pseudonyme *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input type="text" value={form.pseudonym} onChange={e=>updateForm('pseudonym',e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Ex: Awa, Koffi..." required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Âge *</label>
                <input type="number" min={11} max={18} value={form.age} onChange={e=>updateForm('age',e.target.value)} className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="14" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Classe *</label>
                <select value={form.gradeLevel} onChange={e=>updateForm('gradeLevel',e.target.value)} className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none">
                  <option value="" className="bg-zinc-800">Sélectionne...</option>
                  {GRADES.map(g => <option key={g} value={g} className="bg-zinc-800">{g}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Centres d intérêt</label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map(item => (
                  <button key={item} type="button" onClick={()=>updateForm('interests',toggleItem(form.interests,item))} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${form.interests.includes(item)?'bg-gradient-to-r from-indigo-500 to-purple-500 text-white':'bg-zinc-800 text-gray-300 border border-zinc-700 hover:border-indigo-500/50'}`}>{item}</button>
                ))}
              </div>
            </div>
            {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg p-3">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? 'Creation...' : <>Commencer l aventure <Heart className="w-5 h-5" /></>}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-400">
            Deja un compte ? <Link href="/auth/login" className="text-indigo-400 hover:underline">Se connecter</Link>
          </div>
          <div className="mt-4 text-center"><Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300">← Retour à l accueil</Link></div>
        </div>
      </div>
    </div>
  );
}
