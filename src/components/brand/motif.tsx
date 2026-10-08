import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Motif — bandeau géométrique inspiré des tissus wax/kente, dessiné en code.
// Usages : séparateurs de sections, liserés de cartes, empty-states.
// Tracé en currentColor — la page choisit la teinte (world-accent, sunrise…).
// Trois variantes :
//   kente  — losanges alternés (séparateur principal)
//   waves  — ondulations (rythme, transitions)
//   zigzag — éclairs ascendants (énergie, gamification)
// ─────────────────────────────────────────────────────────────────────────────

const PATTERNS = {
  kente: (
    <pattern id="de-motif-kente" width="24" height="12" patternUnits="userSpaceOnUse">
      <path d="M0 6l6-5 6 5-6 5-6-5Z" fill="currentColor" />
      <path d="M12 6l6-5 6 5-6 5-6-5Z" fill="currentColor" opacity="0.45" />
      <path d="M0 0h24" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    </pattern>
  ),
  waves: (
    <pattern id="de-motif-waves" width="24" height="12" patternUnits="userSpaceOnUse">
      <path
        d="M0 8c4-6 8-6 12 0s8 6 12 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </pattern>
  ),
  zigzag: (
    <pattern id="de-motif-zigzag" width="16" height="12" patternUnits="userSpaceOnUse">
      <path d="M0 10L5 3l5 7 5-7" fill="none" stroke="currentColor" strokeWidth="2" />
    </pattern>
  ),
} as const;

export interface MotifProps extends React.SVGProps<SVGSVGElement> {
  variant: keyof typeof PATTERNS;
}

export function Motif({ variant, className, ...props }: MotifProps) {
  return (
    <svg
      viewBox="0 0 240 12"
      preserveAspectRatio="none"
      className={cn("block h-2 w-full", className)}
      aria-hidden
      focusable="false"
      {...props}
    >
      <defs>{PATTERNS[variant]}</defs>
      <rect width="240" height="12" fill={`url(#de-motif-${variant})`} />
    </svg>
  );
}
