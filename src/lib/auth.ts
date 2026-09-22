import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'chandigarh-birding-club-secret-key-2026';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'papakipari123';
export const AUTH_COOKIE_NAME = 'cbc_admin_session';

export function verifyAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function createAdminToken(): string {
  return jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyAdminToken(token: string): boolean {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string };
    return decoded && decoded.role === 'admin';
  } catch {
    return false;
  }
}

export async function isUserAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}
