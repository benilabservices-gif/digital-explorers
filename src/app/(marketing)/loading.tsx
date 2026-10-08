import { Skeleton } from '@/components/ui/skeleton';

// Squelette (marketing) — s'affiche sous la SiteNav pendant le rendu serveur
// des pages publiques (session lue dans le layout).

export default function MarketingLoading() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-16 pt-36">
      <Skeleton className="mb-6 h-9 w-72 rounded-full" />
      <Skeleton className="mb-4 h-16 w-full max-w-2xl" />
      <Skeleton className="mb-12 h-5 w-full max-w-xl" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    </div>
  );
}
