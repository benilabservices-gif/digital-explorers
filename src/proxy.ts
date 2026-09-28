import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Routes nécessitant une session ; /auth/login redirige vers le dashboard si déjà connecté.
// /auth/signup reste accessible connecté : la page gère ce cas (étape enfant) et sert
// aussi à ajouter un autre enfant depuis le dashboard.
const PROTECTED_PREFIXES = ['/dashboard', '/parent', '/portfolio', '/challenges', '/admin'];
const AUTH_PAGES = ['/auth/login'];

export async function proxy(request: NextRequest) {
  // Tant que les variables d'environnement Supabase ne sont pas configurées (.env.local),
  // on laisse passer les requêtes pour ne pas crasher le serveur de dev.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT : ne pas insérer de logique entre createServerClient et getUser(),
  // sinon le refresh du token en amont peut échouer de manière aléatoire.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Non connecté sur une route protégée -> login
  if (!user && PROTECTED_PREFIXES.some((prefix) => path.startsWith(prefix))) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  // Déjà connecté sur /auth/login -> dashboard
  if (user && AUTH_PAGES.some((page) => path === page)) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
