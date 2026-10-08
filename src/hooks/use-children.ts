'use client';

// ─────────────────────────────────────────────────────────────────────────────
// Hook client — enfants du compte courant (Phase 2).
//
// Livré avec la couche données ; les îlots interactifs (AICoach, quiz…) le
// consommeront au fil de la refonte des pages (Phase 4). Les données restent
// protégées par RLS : un visiteur sans session reçoit une liste vide.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { fetchChildrenWithProgress, type ChildData } from '@/lib/children';

export interface UseChildrenResult {
  children: ChildData[];
  loading: boolean;
}

export function useChildren(): UseChildrenResult {
  const [children, setChildren] = useState<ChildData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    fetchChildrenWithProgress(supabase)
      .then((kids) => {
        if (cancelled) return;
        setChildren(kids);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { children, loading };
}
