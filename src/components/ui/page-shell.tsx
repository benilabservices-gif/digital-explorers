import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// PageShell — coquille de page unifiée (finit les 31 `min-h-screen` dupliqués).
// Variantes par ambiance :
// • marketing : fond obsidienne, sans contrainte — le hero impose sa mise en scène
// • app       : padding-top pour une nav fixe, colonne centrée max-w-7xl
// • parent    : sobre — colonne plus étroite, lecture confortable
// La nav reste à la charge de chaque route group (layout), pas du shell.
// ─────────────────────────────────────────────────────────────────────────────

const shells = {
  marketing: "min-h-screen bg-night-950",
  app: "min-h-screen bg-night-950 pt-24",
  parent: "min-h-screen bg-night-950",
} as const;

export interface PageShellProps extends HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof shells;
  /** largeur du contenu (app/parent) — défaut max-w-7xl */
  width?: "wide" | "narrow";
}

export function PageShell({ variant = "marketing", width = "wide", className, children, ...props }: PageShellProps) {
  if (variant === "marketing") {
    return (
      <div className={cn(shells.marketing, className)} {...props}>
        {children}
      </div>
    );
  }
  return (
    <div className={cn(shells[variant], className)} {...props}>
      <div className={cn("mx-auto w-full px-6", width === "narrow" ? "max-w-3xl" : "max-w-7xl")}>
        {children}
      </div>
    </div>
  );
}
