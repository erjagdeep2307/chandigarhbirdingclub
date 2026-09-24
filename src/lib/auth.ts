import jwt from 'jsonwebtoken';
import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;
export const AUTH_COOKIE_NAME = 'cbc_admin_session';
export const CSRF_COOKIE_NAME = 'cbc_csrf_token';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24;
const PASSWORD_HASH_PREFIX = 'pbkdf2_sha256';
const PASSWORD_HASH_ITERATIONS = 100000;
const PASSWORD_HASH_KEYLEN = 64;
const PASSWORD_HASH_DIGEST = 'sha256';

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(
    password,
    salt,
    PASSWORD_HASH_ITERATIONS,
    PASSWORD_HASH_KEYLEN,
    PASSWORD_HASH_DIGEST
  ).toString('hex');

  return `${PASSWORD_HASH_PREFIX}$${PASSWORD_HASH_ITERATIONS}$${salt}$${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split('$');
  if (parts.length !== 4 || parts[0] !== PASSWORD_HASH_PREFIX) {
    return false;
  }

  const [, iterationsValue, salt, hash] = parts;
  const iterations = Number(iterationsValue);
  if (!Number.isInteger(iterations) || iterations < 1 || !salt || !hash) {
    return false;
  }

  const passwordHash = pbkdf2Sync(
    password,
    salt,
    iterations,
    PASSWORD_HASH_KEYLEN,
    PASSWORD_HASH_DIGEST
  );
  const storedPasswordHash = Buffer.from(hash, 'hex');

  if (passwordHash.length !== storedPasswordHash.length) {
    return false;
  }

  return timingSafeEqual(passwordHash, storedPasswordHash);
}

export function createAdminToken(username: string): string {
  if (!JWT_SECRET) throw new Error('JWT_SECRET is not configured');
  return jwt.sign({ role: 'admin', username }, JWT_SECRET, { expiresIn: SESSION_MAX_AGE_SECONDS });
}

export function verifyAdminToken(token: string): boolean {
  if (!JWT_SECRET) return false;
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
