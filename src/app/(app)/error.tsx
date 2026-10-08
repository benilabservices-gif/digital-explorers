'use client';

import { RouteError } from '@/components/boundaries/route-error';

export default function AppError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return <RouteError error={error} retry={retry} title="Cet espace aventurier" />;
}
