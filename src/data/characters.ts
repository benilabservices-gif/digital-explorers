// ---------------------------------------------------------------------------
// Source unique des 5 guides compagnons — « La Team ».
// Consommée par la home (marketing) et par les thèmes de monde
// (src/data/world-themes.ts) qui dérivent leur guide d'ici.
// L'emoji reste le rendu ludique (contenu aventure) ; les contextes premium
// (nav, dashboard, badges) utilisent l'avatar géométrique SVG
// (src/components/brand/avatar.tsx) à partir de l'`id`.
// ---------------------------------------------------------------------------

export type GuideId = "awa" | "koffi" | "sami" | "nadia" | "yann";

export interface Guide {
  id: GuideId;
  name: string;
  /** emoji ludique — rendu dans le contenu de jeu */
  emoji: string;
  /** identité cœur du personnage (marketing) */
  trait: string;
  /** phrase signature */
  tagline: string;
  /** teinte d'avatar (donnée de thème, pas une classe utilitaire) */
  color: string;
  /** classes de dégradé Tailwind (usage marketing historique home) */
  bg: string;
}

export const GUIDES: Guide[] = [
  {
    id: "awa",
    name: "Awa",
    emoji: "👩🏾",
    trait: "Créative",
    tagline: "Je dessine le monde tel que je le rêve.",
    color: "#ec4899",
    bg: "from-pink-500/20 to-rose-500/10",
  },
  {
    id: "koffi",
    name: "Koffi",
    emoji: "👦🏾",
    trait: "Logique",
    tagline: "Chaque problème a son algorithme.",
    color: "#10b981",
    bg: "from-emerald-500/20 to-teal-500/10",
  },
  {
    id: "sami",
    name: "Sami",
    emoji: "👦🏿",
    trait: "Stratège",
    tagline: "Je vois le niveau avant de jouer le premier coup.",
    color: "#3b82f6",
    bg: "from-blue-500/20 to-cyan-500/10",
  },
  {
    id: "nadia",
    name: "Nadia",
    emoji: "👩🏿",
    trait: "Entrepreneure",
    tagline: "Une idée qui ne se partage pas ne change rien.",
    color: "#8b5cf6",
    bg: "from-violet-500/20 to-purple-500/10",
  },
  {
    id: "yann",
    name: "Yann",
    emoji: "👦🏽",
    trait: "Scientifique",
    tagline: "Je pose « pourquoi » jusqu'à comprendre.",
    color: "#f59e0b",
    bg: "from-amber-500/20 to-orange-500/10",
  },
];

export const GUIDES_BY_ID: Record<GuideId, Guide> = Object.fromEntries(
  GUIDES.map((g) => [g.id, g]),
) as Record<GuideId, Guide>;

/** Recherche un guide par prénom (insensible à la casse) — utilitaire narratif. */
export function getGuideByName(name: string): Guide | undefined {
  const needle = name.trim().toLowerCase();
  return GUIDES.find((g) => g.name.toLowerCase() === needle);
}
