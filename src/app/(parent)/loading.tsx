import { Skeleton } from '@/components/ui/skeleton';

// Squelette (parent) — espace parent & back-office.

export default function ParentLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-16 pt-28">
      <Skeleton className="mb-3 h-5 w-40" />
      <Skeleton className="mb-8 h-10 w-56" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
