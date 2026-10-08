import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Chip — petit label statique (étiquette de monde, phase, meta-info).
// Pour une action interactive, utiliser Button (ghost/secondary).
// ─────────────────────────────────────────────────────────────────────────────

const chipVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border text-xs font-medium",
  {
    variants: {
      variant: {
        neutral: "bg-night-800 border-line text-ink-soft",
        warm: "bg-sunrise-500/10 border-sunrise-500/30 text-sunrise-300",
        gold: "bg-gold-400/10 border-gold-400/30 text-gold-300",
        success: "bg-success-400/10 border-success-400/30 text-success-300",
        outline: "bg-transparent border-line-lit text-ink-soft",
      },
      size: {
        sm: "px-2.5 py-0.5 text-[11px]",
        md: "px-3 py-1",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "md",
    },
  },
);

export interface ChipProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof chipVariants> {}

export function Chip({ className, variant, size, ...props }: ChipProps) {
  return <span className={cn(chipVariants({ variant, size }), className)} {...props} />;
}
