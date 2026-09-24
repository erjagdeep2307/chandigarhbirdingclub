import { NextRequest, NextResponse } from 'next/server';
import { createAdminToken, AUTH_COOKIE_NAME, CSRF_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from '@/lib/auth';
import { randomBytes } from 'crypto';
import { verifyAdminCredentials } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password || !(await verifyAdminCredentials(username, password))) {
      return NextResponse.json(
        { error: 'Incorrect username or password' },
        { status: 401 }
      );
    }

    const token = createAdminToken(username.trim());
    const response = NextResponse.json({ success: true, isAdmin: true });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    response.cookies.set({
      name: CSRF_COOKIE_NAME,
      value: randomBytes(32).toString('hex'),
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
