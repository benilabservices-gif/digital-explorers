'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function traduireErreurAuth(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials')) return 'Email ou mot de passe incorrect.';
  if (m.includes('email not confirmed')) return 'Confirme ton adresse email avant de te connecter.';
  if (m.includes('rate limit') || m.includes('too many')) return 'Trop de tentatives. Réessaie dans quelques minutes.';
  return 'Connexion impossible. Réessaie.';
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError('Remplis tous les champs'); return; }
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(traduireErreurAuth(authError.message));
      setLoading(false);
      return;
    }

    // router.refresh() pour que les composants serveur voient les nouveaux cookies de session
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#060810] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] bg-clip-text text-transparent">Digital Explorers</Link>
          <p className="text-gray-400 mt-2">Connecte-toi pour suivre ta famille</p>
        </div>
        <div className="bg-[#111827] border border-white/5 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="ton@email.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Mot de passe</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#0f172a] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 pr-12" placeholder="••••••••" required minLength={6} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">{showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}</button>
              </div>
            </div>
            {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg p-3">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50">
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-400">Pas encore de compte ? <Link href="/auth/signup" className="text-violet-400 hover:underline">Créer mon compte parent</Link></div>
          <div className="mt-4 text-center"><Link href="/" className="text-sm text-gray-500 hover:text-gray-300">← Retour à l&apos;accueil</Link></div>
        </div>
      </div>
    </div>
  );
}
