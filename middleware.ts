import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  // Chemins qui ne nécessitent pas d'authentification
  const publicPaths = [
    '/auth/login',
    '/auth/error',
    '/api/auth',
    '/api/debug',
  ];

  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path) || 
    request.nextUrl.pathname === '/'
  );

  // Redirection vers la page de connexion si non authentifié
  if (!token && !isPublicPath) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Redirection vers le dashboard si déjà authentifié et sur une page publique
  if (token && (request.nextUrl.pathname === '/' || request.nextUrl.pathname.startsWith('/auth'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

// Configuration des chemins où le middleware sera appliqué
export const config = {
  matcher: [
    // Appliquer à toutes les routes sauf les assets statiques,
    // les chemins d'API qui ne sont pas /api/auth et les fichiers public
    '/((?!_next/static|_next/image|favicon.ico|public/|uploads/).*)',
  ]
}; 