import { ViewTransition, type ReactNode } from 'react';

/** Enveloppe le contenu d'une page pour activer les transitions de vue
 *  (View Transitions API) lors des navigations. Le fondu est défini dans
 *  globals.css (`::view-transition-old/new(.page-swap)`), sur les tokens
 *  --motion-* — et neutralisé sous prefers-reduced-motion: reduce.
 *
 *  À poser dans chaque `page.tsx`, pas dans les layouts (persistants). */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition name="page" share="page-swap" enter="page-enter" default="none">
      {children}
    </ViewTransition>
  );
}
