'use client';

import { RouteError } from '@/components/boundaries/route-error';

export default function ParentError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return <RouteError error={error} retry={retry} title="L'espace parent" />;
}
