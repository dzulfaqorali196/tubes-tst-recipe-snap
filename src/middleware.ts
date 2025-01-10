import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  try {
    // Izinkan akses ke halaman utama dan API docs tanpa autentikasi
    if (req.nextUrl.pathname === '/' || req.nextUrl.pathname.startsWith('/api/docs')) {
      return NextResponse.next();
    }

    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Jika user mencoba mengakses halaman yang membutuhkan auth tanpa login
    if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
      const redirectUrl = new URL('/auth', req.url);
      return NextResponse.redirect(redirectUrl);
    }

    // Jika user sudah login dan mencoba mengakses halaman auth
    if (session && req.nextUrl.pathname === '/auth') {
      const redirectUrl = new URL('/dashboard', req.url);
      return NextResponse.redirect(redirectUrl);
    }

    return res;
  } catch (e) {
    console.error('Middleware error:', e);
    // Jika terjadi error, arahkan ke halaman auth kecuali untuk halaman utama
    if (req.nextUrl.pathname !== '/') {
      const redirectUrl = new URL('/auth', req.url);
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};