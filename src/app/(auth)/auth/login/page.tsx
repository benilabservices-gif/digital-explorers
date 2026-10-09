'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TESTIDS } from '@/lib/testids';
import { PageTransition } from '@/components/motion/page-transition';

// ─────────────────────────────────────────────────────────────────────────────
// Connexion parent — îlot client. Habillage tokens-only « Carnet de
// l'Explorateur » : obsidienne + surfaces nuit, CTA soleil levant, erreurs
// danger. Contrats e2e verbatim (smoke.spec.ts) : placeholders
// « ton@email.com » / « •••••••• », bouton « Se connecter » → /dashboard.
// ─────────────────────────────────────────────────────────────────────────────

function traduireErreurAuth(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials')) return 'Email ou mot de passe incorrect.';
  if (m.includes('email not confirmed')) return 'Confirme ton adresse email avant de te connecter.';
  if (m.includes('rate limit') || m.includes('too many')) return 'Trop de tentatives. Réessaie dans quelques minutes.';
  return 'Connexion impossible. Réessaie.';
}

const inputCls =
  'w-full rounded-xl border border-line bg-night-600 px-4 py-3 text-ink placeholder:text-ink-faint transition-colors focus:border-line-lit';
const labelCls = 'mb-1 block text-sm font-medium text-ink-soft';

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
    <PageTransition>
    <div className="flex min-h-screen items-center justify-center bg-night-950 px-4 py-12 text-ink">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="bg-linear-to-r from-sunrise-500 to-gleam-400 bg-clip-text text-2xl font-bold text-transparent">Digital Explorers</Link>
          <p className="mt-2 text-ink-soft">Connecte-toi pour suivre ta famille</p>
        </div>
        <Card className="rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className={labelCls}>Email</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={inputCls}
                placeholder="ton@email.com"
                data-testid={TESTIDS.auth.loginEmail}
                required
              />
            </div>
            <div>
              <label htmlFor="login-password" className={labelCls}>Mot de passe</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`${inputCls} pr-12`}
                  placeholder="••••••••"
                  data-testid={TESTIDS.auth.loginPassword}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint transition-colors hover:text-ink"
                >
                  {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
            </div>
            {error && <p className="rounded-lg border border-danger-500/30 bg-danger-500/10 p-3 text-sm text-danger-300">{error}</p>}
            <Button type="submit" disabled={loading} data-testid={TESTIDS.auth.loginSubmit} className="h-12 w-full">
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-ink-soft">
            Pas encore de compte ? <Link href="/auth/signup" className="font-medium text-sunrise-400 hover:text-sunrise-300">Créer mon compte parent</Link>
          </div>
          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-ink-faint transition-colors hover:text-ink-soft">← Retour à l'accueil</Link>
          </div>
        </Card>
      </div>
    </div>
    </PageTransition>
  );
}
