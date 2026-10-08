import { Skeleton } from '@/components/ui/skeleton';

// Squelette (auth) — formulaire centré (login/signup/onboarding).

export default function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Skeleton className="mx-auto mb-6 h-16 w-16 rounded-2xl" />
        <Skeleton className="mb-3 h-8 w-2/3 mx-auto" />
        <Skeleton className="mb-10 h-4 w-1/2 mx-auto" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
