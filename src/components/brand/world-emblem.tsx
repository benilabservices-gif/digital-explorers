import type { ReactElement } from "react";
import type { WorldSlug } from "@/data/content";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// WorldEmblem — emblème géométrique des 7 mondes, dessiné en code.
// Tracé en currentColor : se teinte à la couleur du monde (world-accent),
// à la marque (text-sunrise-*) ou au contexte (text-ink-soft).
// ─────────────────────────────────────────────────────────────────────────────

function emblem(slug: WorldSlug): ReactElement {
  switch (slug) {
    // Web & Digital — globe en réseaux : méridiens + nœuds
    case "web-digital":
      return (
        <g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <circle cx="32" cy="32" r="20" />
          <ellipse cx="32" cy="32" rx="9" ry="20" />
          <path d="M12 32h40M32 12v40" />
          <circle cx="45" cy="19" r="3.4" fill="currentColor" stroke="none" />
          <circle cx="19" cy="45" r="2.4" fill="currentColor" stroke="none" />
        </g>
      );
    // IA — réseau de neurones : nœuds reliés
    case "artificial-intelligence":
      return (
        <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <circle cx="32" cy="14" r="4.5" />
          <circle cx="14" cy="38" r="4.5" />
          <circle cx="50" cy="38" r="4.5" />
          <circle cx="32" cy="52" r="4.5" />
          <path d="M29 18L17 34M35 18l12 16M18.5 41l10 8M45.5 41l-10 8M20 36l-4 0" strokeWidth="1.8" opacity="0.8" />
          <circle cx="32" cy="32" r="6" strokeWidth="2.4" />
        </g>
      );
    // Coding — chevrons de code dans un écran
    case "coding":
      return (
        <g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="8" y="14" width="48" height="36" rx="6" />
          <path d="M8 44l8 10h32l8-10" opacity="0.5" strokeWidth="2" />
          <path d="M26 25l-7 7 7 7M38 25l7 7-7 7" />
        </g>
      );
    // Blockchain — trois blocs chaînés
    case "blockchain":
      return (
        <g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round">
          <rect x="10" y="10" width="18" height="18" rx="4" />
          <rect x="36" y="18" width="18" height="18" rx="4" />
          <rect x="18" y="38" width="18" height="18" rx="4" />
          <path d="M28 19l8 4-4 4" strokeLinecap="round" />
          <path d="M45 36l-9 6" strokeLinecap="round" />
        </g>
      );
    // Digital Creator — palette en losanges
    case "digital-creator":
      return (
        <g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round">
          <rect x="32" y="8" width="17" height="17" transform="rotate(45 40.5 16.5)" />
          <rect x="21" y="30" width="13" height="13" transform="rotate(45 27.5 36.5)" opacity="0.75" />
          <rect x="40" y="34" width="20" height="20" transform="rotate(45 50 44)" opacity="0.55" />
        </g>
      );
    // Cyber Hero — bouclier + verrou
    case "cyber-hero":
      return (
        <g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round">
          <path d="M32 8l20 7v14c0 13-8.5 21.5-20 27C20.5 50.5 12 42 12 29V15l20-7Z" />
          <rect x="25" y="27" width="14" height="11" rx="2.5" />
          <path d="M28 27v-4a4 4 0 0 1 8 0v4" strokeLinecap="round" />
        </g>
      );
    // Innovation — fusée en orbite
    case "innovation-entrepreneurship":
      return (
        <g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M32 10c8 6 11 15 8 24l-8 8-8-8c-3-9 0-18 8-24Z" />
          <circle cx="32" cy="26" r="4" />
          <path d="M24 38l-6 8 8-2M40 38l6 8-8-2" />
          <path d="M12 52a26 26 0 0 0 40 0" opacity="0.55" strokeWidth="2" />
        </g>
      );
  }
}

export interface WorldEmblemProps {
  slug: WorldSlug;
  /** taille rendue en px (carré) — défaut 48 */
  size?: number;
  className?: string;
}

export function WorldEmblem({ slug, size = 48, className }: WorldEmblemProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      aria-hidden
      focusable="false"
    >
      {emblem(slug)}
    </svg>
  );
}
