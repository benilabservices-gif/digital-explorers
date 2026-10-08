import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Badge — récompense (à ne pas confondre avec Chip, simple étiquette).
// L'or est réservé à la rareté « legendary » — règle DA « or = récompenses ».
// ─────────────────────────────────────────────────────────────────────────────

export type BadgeRarity = "common" | "rare" | "epic" | "legendary";

const badgeVariants = cva(
  "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium",
  {
    variants: {
      rarity: {
        common: "bg-night-800 border-line text-ink-soft",
        rare: "bg-info-500/10 border-info-400/40 text-info-300",
        epic: "bg-violet-400/10 border-violet-400/40 text-violet-300",
        legendary:
          "bg-gold-400/10 border-gold-400/50 text-gold-300 shadow-glow-gold",
      },
    },
    defaultVariants: {
      rarity: "common",
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, rarity, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ rarity }), className)} {...props} />;
}
