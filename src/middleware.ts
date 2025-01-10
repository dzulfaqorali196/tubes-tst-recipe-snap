import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Database } from './lib/database.types';

export async function middleware(request: NextRequest) {
  try {
    console.log('Middleware executing for path:', request.nextUrl.pathname);
    
    const res = NextResponse.next();
    const supabase = createMiddlewareClient<Database>({ req: request, res });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    console.log('Session status in middleware:', session ? 'Active' : 'No session');

    // Get current path
    const currentPath = request.nextUrl.pathname;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;

    // Jika user tidak terautentikasi dan mencoba mengakses halaman yang dilindungi
    if (!session && (
      currentPath.startsWith('/dashboard') ||
      currentPath.startsWith('/profile')
    )) {
      console.log('Unauthorized access attempt, redirecting to auth...');
      const redirectUrl = new URL('/auth', baseUrl);
      redirectUrl.searchParams.set('redirectTo', currentPath);
      return NextResponse.redirect(redirectUrl);
    }

    // Jika user sudah terautentikasi dan mencoba mengakses halaman auth
    if (session && currentPath.startsWith('/auth')) {
      console.log('Authenticated user accessing auth page, redirecting to dashboard...');
      const redirectTo = request.nextUrl.searchParams.get('redirectTo') || '/dashboard';
      return NextResponse.redirect(new URL(redirectTo, baseUrl));
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    // Fallback ke homepage dengan URL lengkap
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
    return NextResponse.redirect(new URL('/', baseUrl));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};