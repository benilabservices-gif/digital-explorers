import { Skeleton } from '@/components/ui/skeleton';

// Squelette (app) — pages immersives enfant (dashboard, mondes, défis…).
// S'affiche sous la SiteNav pendant le rendu serveur (session + données).

export default function AppLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-16 pt-28">
      <Skeleton className="mb-3 h-5 w-48" />
      <Skeleton className="mb-2 h-10 w-64" />
      <Skeleton className="mb-10 h-4 w-full max-w-md" />
      <Skeleton className="mb-8 h-40 w-full rounded-2xl" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
