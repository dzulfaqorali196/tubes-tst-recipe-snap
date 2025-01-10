import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Database } from './lib/database.types';

export async function middleware(request: NextRequest) {
  try {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient<Database>({ req: request, res });

    // Get session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Get current path
    const currentPath = request.nextUrl.pathname;

    // Jika user tidak terautentikasi dan mencoba mengakses halaman yang dilindungi
    if (!session && (
      currentPath.startsWith('/dashboard') ||
      currentPath.startsWith('/profile')
    )) {
      // Redirect ke halaman auth dengan URL lengkap
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tubes-tst-recipe-snap-production.up.railway.app';
      const redirectUrl = new URL('/auth', baseUrl);
      redirectUrl.searchParams.set('redirectTo', currentPath);
      return NextResponse.redirect(redirectUrl.toString());
    }

    // Jika user sudah terautentikasi dan mencoba mengakses halaman auth
    if (session && currentPath.startsWith('/auth')) {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tubes-tst-recipe-snap-production.up.railway.app';
      const redirectTo = request.nextUrl.searchParams.get('redirectTo') || '/dashboard';
      return NextResponse.redirect(new URL(redirectTo, baseUrl));
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    // Fallback ke homepage dengan URL lengkap
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tubes-tst-recipe-snap-production.up.railway.app';
    return NextResponse.redirect(new URL('/', baseUrl));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};