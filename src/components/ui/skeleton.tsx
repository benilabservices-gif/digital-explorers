import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton — placeholder de chargement (loading.tsx, flux en cours).
// ─────────────────────────────────────────────────────────────────────────────

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-lg bg-night-700", className)}
      {...props}
    />
  );
}
