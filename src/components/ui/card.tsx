import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Card — primitive de surface unique (3 niveaux de surfaces « nuit »).
// • flat       : surface 1, bordure standard — contenu statique
// • raised     : surface 2 — panneaux, sections mises en avant
// • interactive: surface 1 + bordure lumineuse au survol + léger lever
// Le padding n'est PAS inclus : la page le pilote (className="p-6").
// ─────────────────────────────────────────────────────────────────────────────

const cardVariants = cva("rounded-xl border", {
  variants: {
    variant: {
      flat: "bg-night-850 border-line",
      raised: "bg-night-800 border-line shadow-card",
      interactive:
        "bg-night-850 border-line transition-all duration-250 ease-out-soft hover:border-line-lit hover:bg-night-800 hover:-translate-y-1 hover:shadow-lift",
    },
  },
  defaultVariants: {
    variant: "flat",
  },
});

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function Card({ className, variant, ...props }: CardProps) {
  return <div className={cn(cardVariants({ variant }), className)} {...props} />;
}
