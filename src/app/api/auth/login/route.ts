import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword, createAdminToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;

    if (!password || !verifyAdminPassword(password)) {
      return NextResponse.json(
        { error: 'Incorrect admin password' },
        { status: 401 }
      );
    }

    const token = createAdminToken();
    const response = NextResponse.json({ success: true, isAdmin: true });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
