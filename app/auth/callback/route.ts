import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/';

  // Construct the response redirecting back to the home page or specific path
  const response = NextResponse.redirect(new URL(next, request.url));

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
        },
      });

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error && data.session) {
        // Set standard session cookies for authentication persistence
        response.cookies.set('sb-access-token', data.session.access_token, {
          path: '/',
          secure: true,
          sameSite: 'lax',
          maxAge: data.session.expires_in,
        });
        response.cookies.set('sb-refresh-token', data.session.refresh_token, {
          path: '/',
          secure: true,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });
      }
    }
  }

  return response;
}
