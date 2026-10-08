import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// 404 global — tokens uniquement. S'applique à toutes les URL non résolues
// (les pages notFound() des groupes remontent jusqu'ici).

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div
          aria-hidden
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-line bg-night-850 font-display text-2xl font-bold text-ink"
        >
          404
        </div>
        <h1 className="mb-3 font-display text-3xl font-bold text-ink">Page introuvable</h1>
        <p className="mb-8 text-ink-soft">
          Cette page n'existe pas (ou plus). Reprenons l'exploration.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className={cn(buttonVariants({ variant: 'primary' }))}>
            Accueil
          </Link>
          <Link href="/worlds" className={cn(buttonVariants({ variant: 'secondary' }))}>
            Les mondes
          </Link>
        </div>
      </div>
    </div>
  );
}
