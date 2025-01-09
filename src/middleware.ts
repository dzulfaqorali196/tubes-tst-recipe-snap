import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Database } from './lib/database.types';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req: request, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Jika user tidak terautentikasi dan mencoba mengakses halaman yang dilindungi
  if (!session && (
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/profile')
  )) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Jika user sudah terautentikasi dan mencoba mengakses halaman auth
  if (session && request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};