import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, CSRF_COOKIE_NAME } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({ success: true, isAdmin: false });
  response.cookies.delete(AUTH_COOKIE_NAME);
  response.cookies.delete(CSRF_COOKIE_NAME);
  return response;
}
