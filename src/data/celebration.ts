// ---------------------------------------------------------------------------
// Palette des confettis — données de thème « récompenses ».
// canvas-confetti exige des couleurs réelles (pas de variables CSS), les
// valeurs hex vivent donc ici comme données de thème, au même titre que les
// accents de mondes (src/data/world-themes.ts).
// Synchronisées avec les tokens @theme de globals.css :
//   gold-* (or — récompenses), sunrise-* / gleam-* (marque soleil levant), ink.
// ---------------------------------------------------------------------------

/** Salves standards (victoire mini-jeu, aventure, badge). */
export const CELEBRATION_COLORS: string[] = [
  "#ff8f5e", // sunrise-500 — corail
  "#ffc766", // gleam-400 — ambre
  "#fbbf24", // gold-400 — or
  "#fde68a", // gold-300 — or clair
  "#eff4ff", // ink — étincelles
];

/** Passage de niveau : gerbe 100 % or (règle DA « or = récompenses »). */
export const LEVELUP_COLORS: string[] = [
  "#fbbf24", // gold-400
  "#fde68a", // gold-300
  "#e8a104", // gold-500
];
