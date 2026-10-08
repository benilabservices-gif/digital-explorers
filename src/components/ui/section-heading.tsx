import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// SectionHeading — en-tête de section unifié (marketing & app).
// Surtitre en accent marque (petites capitales), titre en Bricolage Grotesque.
// ─────────────────────────────────────────────────────────────────────────────

export interface SectionHeadingProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "title"
> {
  /** surtitre — catégorie de la section (ex. « Les 7 mondes ») */
  eyebrow?: string;
  /** titre principal (rendu en display, ReactNode autorisé pour les dégradés) */
  title: ReactNode;
  /** description optionnelle sous le titre */
  description?: string;
  /** alignement : gauche (défaut) ou centré (sections marketing) */
  align?: "left" | "center";
}

export function SectionHeading({
  className,
  eyebrow,
  title,
  description,
  align = "left",
  ...props
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
      {...props}
    >
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-wider text-sunrise-400">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-display-md font-bold tracking-tight text-ink">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-base leading-relaxed text-ink-soft">
          {description}
        </p>
      )}
    </div>
  );
}
