import { NextRequest, NextResponse } from 'next/server';

const CSRF_COOKIE_NAME = 'cbc_csrf_token';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const CSRF_EXEMPT_PATHS = new Set([
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/hash-password',
]);

function tokensMatch(cookieToken: string | undefined, headerToken: string | null): boolean {
  if (!cookieToken || !headerToken) return false;
  return cookieToken === headerToken;
}

export function middleware(request: NextRequest) {
  if (SAFE_METHODS.has(request.method) || CSRF_EXEMPT_PATHS.has(request.nextUrl.pathname)) {
    return NextResponse.next();
  }
  if (!request.nextUrl.pathname.startsWith('/api/')) return NextResponse.next();

  if (!tokensMatch(request.cookies.get(CSRF_COOKIE_NAME)?.value, request.headers.get('x-csrf-token'))) {
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
  }
  return NextResponse.next();
}

export const config = { matcher: '/api/:path*' };
