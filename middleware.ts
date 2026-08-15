import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const pathname = req.nextUrl.pathname;
  const isDemo = req.cookies.get('angel_admin_demo')?.value === 'true';

  let hasSupabaseUser = false;

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => req.cookies.getAll(),
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              req.cookies.set(name, value);
              res.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      hasSupabaseUser = true;
    }
  } catch {
    // Graceful fallback
  }

  const isAuthenticated = Boolean(hasSupabaseUser || isDemo);

  // Set X-Robots-Tag to permanently hide /admin and /auth from search engine indexers
  if (pathname.startsWith('/admin') || pathname.startsWith('/auth')) {
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  }

  // Protect admin routes
  if (pathname.startsWith('/admin') && !isAuthenticated) {
    const loginUrl = new URL('/auth/login/admin', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/auth/:path*',
  ],
};
