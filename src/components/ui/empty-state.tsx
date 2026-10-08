import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Motif } from "@/components/brand/motif";

// ─────────────────────────────────────────────────────────────────────────────
// EmptyState — état vide unifié, habillé du motif géométrique de la marque.
// `action` reçoit typiquement un <Button> ou un <Link> de la page.
// ─────────────────────────────────────────────────────────────────────────────

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  /** emoji ou icône lucide affichée en médaillon */
  icon?: ReactNode;
  /** phrase courte et directe (jeune public) */
  title: string;
  /** explication d'une ligne */
  description?: string;
  /** action principale optionnelle */
  action?: ReactNode;
}

export function EmptyState({ className, icon, title, description, action, ...props }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-line bg-night-850 px-6 py-14 text-center",
        className,
      )}
      {...props}
    >
      {/* bandeau motif discret en haut et bas du bloc */}
      <Motif
        variant="kente"
        className="absolute inset-x-0 top-0 h-1.5 opacity-40"
        aria-hidden
      />
      <Motif
        variant="waves"
        className="absolute inset-x-0 bottom-0 h-1.5 opacity-25"
        aria-hidden
      />
      {icon && (
        <div
          aria-hidden
          className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-line bg-night-800 text-3xl"
        >
          {icon}
        </div>
      )}
      <h3 className="font-display text-xl font-bold text-ink">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-base leading-relaxed text-ink-soft">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
