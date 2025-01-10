// src/app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Database } from '@/lib/database.types';

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    
    // Gunakan NEXT_PUBLIC_SITE_URL jika tersedia
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin;

    if (code) {
      const cookieStore = cookies();
      const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
      
      // Exchange code for session
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (exchangeError) {
        console.error('Error exchanging code for session:', exchangeError);
        return NextResponse.redirect(new URL('/auth?error=auth_callback_error', baseUrl));
      }

      // Verify session was created
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('Error getting session after exchange:', sessionError);
        return NextResponse.redirect(new URL('/auth?error=session_error', baseUrl));
      }

      // Redirect to dashboard with success
      return NextResponse.redirect(new URL('/dashboard', baseUrl));
    }

    // If no code, redirect to auth
    return NextResponse.redirect(new URL('/auth?error=no_code', baseUrl));
  } catch (error) {
    console.error('Unexpected error in auth callback:', error);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    return NextResponse.redirect(new URL('/auth?error=unexpected', baseUrl));
  }
}