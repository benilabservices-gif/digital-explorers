import type { ReactElement } from "react";
import { GUIDES_BY_ID, type GuideId } from "@/data/characters";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Avatar — portrait géométrique des guides, dessiné en code (SVG).
// Remplace les emojis dans les contextes premium (nav, dashboard, badges) ;
// l'emoji reste le rendu ludique du contenu aventure.
// La teinte vient de la donnée personnage (characters.ts) via currentColor :
// aucun hex littéral ici — traits du visage en token nuit.
// ─────────────────────────────────────────────────────────────────────────────

const INK = "var(--color-night-950)";

function guideShape(id: GuideId): ReactElement {
  switch (id) {
    // Awa — Créative : tête ronde, double arc, diamant au front
    case "awa":
      return (
        <g>
          <path d="M12 34a20 20 0 0 1 40 0v14a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6V34Z" fill="currentColor" />
          <path d="M12 34a20 20 0 0 1 40 0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
          <circle cx="26" cy="34" r="2.6" fill={INK} />
          <circle cx="38" cy="34" r="2.6" fill={INK} />
          <path d="M26 42q6 5 12 0" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
          <rect x="29.4" y="24.6" width="5.2" height="5.2" transform="rotate(45 32 27.2)" fill={INK} opacity="0.85" />
        </g>
      );
    // Koffi — Logique : tête carrée, grille, pixel au front
    case "koffi":
      return (
        <g>
          <rect x="13" y="16" width="38" height="38" rx="10" fill="currentColor" />
          <rect x="13" y="16" width="38" height="38" rx="10" fill="none" stroke={INK} strokeWidth="0" />
          <path d="M13 28h38M13 42h38M32 16v38" stroke={INK} strokeWidth="1.4" opacity="0.28" />
          <rect x="29" y="23" width="6" height="6" rx="1" fill={INK} />
          <circle cx="25.5" cy="36" r="2.6" fill={INK} />
          <circle cx="38.5" cy="36" r="2.6" fill={INK} />
          <path d="M26 44h12" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
        </g>
      );
    // Sami — Stratège : tête hexagonale, visière, éclair de partie
    case "sami":
      return (
        <g>
          <path d="M32 12l17 10v20l-17 10-17-10V22l17-10Z" fill="currentColor" />
          <path d="M15 26h34" stroke={INK} strokeWidth="2.2" opacity="0.35" />
          <circle cx="25.5" cy="35" r="2.6" fill={INK} />
          <circle cx="38.5" cy="35" r="2.6" fill={INK} />
          <path d="M30 44l4-4-3-1 4-4" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    // Nadia — Entrepreneure : tête trapèze, couronne à chevrons montants
    case "nadia":
      return (
        <g>
          <path d="M17 20h30l3 30a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6l3-30Z" fill="currentColor" />
          <path d="M20 14l6 6 6-6 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
          <circle cx="26" cy="36" r="2.6" fill={INK} />
          <circle cx="38" cy="36" r="2.6" fill={INK} />
          <path d="M26 44q6 4 12 0" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
        </g>
      );
    // Yann — Scientifique : tête ronde, orbites atomiques
    case "yann":
      return (
        <g>
          <circle cx="32" cy="34" r="17" fill="currentColor" />
          <circle cx="32" cy="34" r="17" fill="none" stroke={INK} strokeWidth="0" />
          <ellipse cx="32" cy="34" rx="24" ry="9" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" transform="rotate(-18 32 34)" />
          <circle cx="26" cy="32" r="2.6" fill={INK} />
          <circle cx="38" cy="32" r="2.6" fill={INK} />
          <path d="M26 41q6 4.5 12 0" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
          <circle cx="52" cy="22" r="2.6" fill="currentColor" />
        </g>
      );
  }
}

export interface AvatarProps {
  id: GuideId;
  /** taille rendue en px (carré) — défaut 40 */
  size?: number;
  /** tuile de fond nuit (nav, cartes) — défaut true */
  tile?: boolean;
  className?: string;
}

export function Avatar({ id, size = 40, tile = true, className }: AvatarProps) {
  const guide = GUIDES_BY_ID[id];
  return (
    <span
      role="img"
      aria-label={`${guide.name} — ${guide.trait}`}
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        tile && "border border-line bg-night-800",
        className,
      )}
      style={{ color: guide.color, width: size, height: size }}
    >
      <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden focusable="false">
        {guideShape(id)}
      </svg>
    </span>
  );
}
