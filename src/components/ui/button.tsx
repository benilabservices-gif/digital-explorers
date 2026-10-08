import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Button — primitive d'action unique.
// • primary   : dégradé « soleil levant » (corail → ambre), texte nuit — CTA
// • secondary : surface nuit + bordure, survol bordure lumineuse
// • ghost     : transparent, survol surface
// • gold      : or — RÉSERVÉ aux récompenses (LevelUp, badges rares)
// Micro-interactions : press (scale), hover (lever), focus visible global
// (globals.css). Pour un lien stylé bouton : <Link className={buttonVariants(…)}>.
// ─────────────────────────────────────────────────────────────────────────────

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap select-none transition-all duration-250 ease-out-soft active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-linear-to-r from-sunrise-500 to-gleam-400 text-night-950 font-semibold shadow-glow-sunrise hover:from-sunrise-400 hover:to-gleam-300 hover:-translate-y-0.5",
        secondary:
          "bg-night-850 text-ink border border-line hover:border-line-lit hover:bg-night-800 hover:-translate-y-0.5",
        ghost:
          "text-ink-soft hover:text-ink hover:bg-night-800",
        gold:
          "bg-linear-to-r from-gold-400 to-gold-300 text-night-950 font-semibold shadow-glow-gold hover:-translate-y-0.5",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-base",
        lg: "h-14 px-8 text-lg",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
