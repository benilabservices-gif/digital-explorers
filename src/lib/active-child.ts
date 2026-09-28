// Sélecteur d'enfant actif : simple préférence d'interface (ID uniquement).
// Toutes les données de l'enfant viennent de la base — ce pointeur ne sert
// qu'à se souvenir de la sélection entre les pages.

const KEY = 'de_active_child_id';

export function getActiveChildId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setActiveChildId(id: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (id) window.localStorage.setItem(KEY, id);
    else window.localStorage.removeItem(KEY);
  } catch {
    // stockage indisponible : la sélection devient un simple état en mémoire
  }
}
