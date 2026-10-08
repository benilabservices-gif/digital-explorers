'use client';

// ─────────────────────────────────────────────────────────────────────────────
// Hook client — enfant actif (Phase 2).
//
// Compose useChildren + le pointeur de sélection (cookie `de_active_child`,
// partagé avec les composants serveur). selectChild(id) écrit le cookie pour
// que la prochaine navigation serveur rende le bon enfant dès le départ.
// Livré avec la couche données ; consommé par les îlots en Phase 4.
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useState } from 'react';
import { findActiveChild, type ChildData } from '@/lib/children';
import { getActiveChildId, setActiveChildId } from '@/lib/active-child';
import { useChildren } from './use-children';

export interface UseActiveChildResult {
  children: ChildData[];
  /** Enfant actif — cookie s'il est valide, sinon premier enfant. */
  child: ChildData | null;
  activeChildId: string | null;
  /** Sélectionne l'enfant actif et persiste le pointeur (null = aucun). */
  selectChild: (id: string | null) => void;
  loading: boolean;
}

export function useActiveChild(): UseActiveChildResult {
  const { children, loading } = useChildren();
  const [activeChildId, setActiveChildIdState] = useState<string | null>(null);

  // Initialisation : pointeur (cookie) s'il est valide, sinon premier enfant.
  useEffect(() => {
    if (loading) return;
    const pointer = getActiveChildId();
    setActiveChildIdState(children.find((c) => c.id === pointer)?.id ?? children[0]?.id ?? null);
  }, [loading, children]);

  const selectChild = useCallback((id: string | null) => {
    setActiveChildIdState(id);
    setActiveChildId(id);
  }, []);

  const child = findActiveChild(children, activeChildId);

  return { children, child, activeChildId, selectChild, loading };
}
