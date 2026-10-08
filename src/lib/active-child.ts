// Sélecteur d'enfant actif : simple préférence d'interface (ID uniquement).
// Toutes les données de l'enfant viennent de la base — ce pointeur ne sert
// qu'à se souvenir de la sélection entre les pages.
//
// Phase 2 : le pointeur vit dans un COOKIE (et non plus localStorage) pour
// que les composants serveur (RSC) puissent le lire via cookies() au rendu.
// Ce module reste la seule façade d'écriture côté client ; les composants
// serveur lisent via src/lib/queries/children.ts.

/** Cookie partagé avec les requêtes serveur — définie ici, importée côté serveur. */
export const ACTIVE_CHILD_COOKIE = 'de_active_child';

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function readCookie(name: string): string | null {
  // document.cookie n'est pas exposé sur tous les environnements (SSR)
  if (typeof document === 'undefined') return null;
  const prefix = name + '=';
  for (const part of document.cookie.split(';')) {
    const entry = part.trim();
    if (entry.startsWith(prefix)) return decodeURIComponent(entry.slice(prefix.length));
  }
  return null;
}

export function getActiveChildId(): string | null {
  if (typeof document === 'undefined') return null;
  try {
    return readCookie(ACTIVE_CHILD_COOKIE);
  } catch {
    return null;
  }
}

export function setActiveChildId(id: string | null): void {
  if (typeof document === 'undefined') return;
  try {
    if (id) {
      document.cookie = `${ACTIVE_CHILD_COOKIE}=${encodeURIComponent(id)}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
    } else {
      document.cookie = `${ACTIVE_CHILD_COOKIE}=; path=/; max-age=0; samesite=lax`;
    }
  } catch {
    // cookies indisponibles : la sélection devient un simple état en mémoire
  }
}
