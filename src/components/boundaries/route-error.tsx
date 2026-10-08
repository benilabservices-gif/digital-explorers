'use client';

// ─────────────────────────────────────────────────────────────────────────────
// RouteError — fallback partagé des error.tsx par route group (Phase 2).
//
// Next 16 : error.tsx reçoit { error, retry } — retry() relance le rendu du
// segment (re-fetch inclus). Ce composant log l'erreur et propose deux
// sorties : réessayer, ou rentrer à l'accueil.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export interface RouteErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
  /** Contexte affiché, p. ex. « L'espace parent ». */
  title: string;
}

export function RouteError({ error, retry, title }: RouteErrorProps) {
  useEffect(() => {
    console.error(`[Erreur — ${title}]`, error);
  }, [error, title]);

  return (
    <div role="alert" className="flex min-h-[60vh] items-center justify-center px-6 py-16">
      <div className="max-w-md text-center">
        <div
          aria-hidden
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-line bg-night-850 text-3xl"
        >
          🧭
        </div>
        <h1 className="mb-3 font-display text-3xl font-bold text-ink">
          Oups, la page a fait un faux pas
        </h1>
        <p className="mb-2 text-ink-soft">
          {title} n'a pas pu s'afficher correctement.
        </p>
        <p className="mb-8 text-xs text-ink-faint">
          {error.digest ? `Référence : ${error.digest}` : 'Réessaie dans un instant.'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button onClick={retry}>Réessayer</Button>
          <Button variant="secondary" onClick={() => (window.location.href = '/')}>
            Accueil
          </Button>
        </div>
      </div>
    </div>
  );
}
