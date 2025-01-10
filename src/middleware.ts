import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Database } from './lib/database.types';

export async function middleware(request: NextRequest) {
  try {
    // Abaikan rute yang tidak perlu middleware
    if (
      request.nextUrl.pathname.startsWith('/_next') ||
      request.nextUrl.pathname.startsWith('/api') ||
      request.nextUrl.pathname.startsWith('/static') ||
      request.nextUrl.pathname === '/'
    ) {
      return NextResponse.next();
    }

    console.log('Middleware executing for path:', request.nextUrl.pathname);
    
    const res = NextResponse.next();
    const supabase = createMiddlewareClient<Database>({ req: request, res });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    console.log('Session status in middleware:', session ? 'Active' : 'No session');

    // Get current path
    const currentPath = request.nextUrl.pathname;
    const baseUrl = request.nextUrl.origin;

    // Daftar rute yang memerlukan autentikasi
    const protectedRoutes = ['/dashboard', '/profile', '/riwayat'];
    const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));

    // Jika user tidak terautentikasi dan mencoba mengakses halaman yang dilindungi
    if (!session && isProtectedRoute) {
      console.log('Unauthorized access attempt, redirecting to auth...');
      return NextResponse.redirect(new URL('/auth', baseUrl));
    }

    // Jika user sudah terautentikasi dan mencoba mengakses halaman auth
    if (session && currentPath === '/auth') {
      console.log('Authenticated user accessing auth page, redirecting to dashboard...');
      return NextResponse.redirect(new URL('/dashboard', baseUrl));
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};