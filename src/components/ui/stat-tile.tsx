import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

// ─────────────────────────────────────────────────────────────────────────────
// StatTile — tuile statistique unifiée (dashboard, rapports parent, marketing).
// `value` en Bricolage (font-display) pour une hiérarchie très contrastée.
// ─────────────────────────────────────────────────────────────────────────────

export interface StatTileProps extends HTMLAttributes<HTMLDivElement> {
  /** valeur chiffrée (XP, niveau, aventures…) */
  value: ReactNode;
  /** libellé sous la valeur */
  label: string;
  /** icône lucide ou emoji (optionnel) */
  icon?: ReactNode;
  /** hue d'accent de la valeur : marque (défaut) ou or (récompenses) */
  tone?: "brand" | "gold" | "muted";
}

const toneValue: Record<NonNullable<StatTileProps["tone"]>, string> = {
  brand: "text-sunrise-400",
  gold: "text-gold-300",
  muted: "text-ink",
};

export function StatTile({ className, value, label, icon, tone = "brand", ...props }: StatTileProps) {
  return (
    <Card variant="flat" className={cn("flex items-center gap-4 p-4", className)} {...props}>
      {icon && (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-night-800 text-xl" aria-hidden>
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <div className={cn("font-display text-2xl font-bold leading-none", toneValue[tone])}>
          {value}
        </div>
        <div className="mt-1 truncate text-sm text-ink-soft">{label}</div>
      </div>
    </Card>
  );
}
