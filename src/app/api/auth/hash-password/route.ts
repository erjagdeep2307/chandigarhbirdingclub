import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { hashPassword } from '@/lib/auth';

function hasSetupKey(request: NextRequest): boolean {
  const configuredKey = process.env.PASSWORD_HASH_API_KEY;
  const suppliedKey = request.headers.get('x-password-hash-key');
  if (!configuredKey || !suppliedKey) return false;

  const expected = Buffer.from(configuredKey);
  const supplied = Buffer.from(suppliedKey);
  return expected.length === supplied.length && timingSafeEqual(expected, supplied);
}

export async function POST(request: NextRequest) {
  if (!hasSetupKey(request)) {
    return NextResponse.json({ error: 'Password hashing endpoint is disabled' }, { status: 404 });
  }

  try {
    const { password } = await request.json();
    if (typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    return NextResponse.json({ password_hash: hashPassword(password) });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
