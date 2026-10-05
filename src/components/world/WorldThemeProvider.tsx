'use client';

import type { CSSProperties, ReactNode } from 'react';
import { getWorldTheme } from '@/data/world-themes';

/**
 * Injecte les variables CSS du monde (--world-accent, --world-accent-soft,
 * --world-glow, --world-bg-glow) autour d'un sous-arbre, pour teinter les
 * composants (texte, bordures, progressions, encadrés) à la couleur du monde.
 *
 * Utilisation :
 *   <WorldThemeProvider slug={slug} className="relative min-h-screen">
 *     --world-accent devient utilisable partout en dessous :
 *     className="world-accent", "world-bg-soft", "world-border"…
 *   </WorldThemeProvider>
 */
export default function WorldThemeProvider({
  slug,
  children,
  className,
}: {
  slug: string;
  children: ReactNode;
  className?: string;
}) {
  const theme = getWorldTheme(slug);
  const style = {
    '--world-accent': theme.accent,
    '--world-accent-soft': theme.accentSoft,
    '--world-glow': theme.glow,
    '--world-bg-glow': theme.bgGlow,
  } as CSSProperties;

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
