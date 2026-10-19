import { neon } from '@neondatabase/serverless';
import { Walk, PastWalk, BirdSighting, Member } from './types';
import { verifyPassword } from './auth';

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) {
  throw new Error('DATABASE_URL is required. Configure Neon PostgreSQL to use the live data API.');
}
const sql = neon(databaseUrl);
// Ensure tables exist in Neon
let tablesInitialized = false;
export async function ensureTablesExist() {
  if (tablesInitialized) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id BIGSERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS walks (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        datetime TIMESTAMPTZ NOT NULL,
        location VARCHAR(255) NOT NULL,
        duration VARCHAR(100) DEFAULT 'TBD',
        description TEXT DEFAULT '',
        post_url TEXT DEFAULT '',
        upcoming BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS past_walks (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        date VARCHAR(100) NOT NULL,
        participants VARCHAR(100) DEFAULT '—',
        species VARCHAR(100) DEFAULT '—',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    await sql`ALTER TABLE walks ADD COLUMN IF NOT EXISTS post_url TEXT DEFAULT ''`;
    await sql`ALTER TABLE past_walks ADD COLUMN IF NOT EXISTS post_url TEXT DEFAULT ''`;
    await sql`
      CREATE TABLE IF NOT EXISTS birds (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        latin VARCHAR(255) DEFAULT '',
        location VARCHAR(255) NOT NULL,
        photo TEXT DEFAULT '',
        emoji VARCHAR(10) DEFAULT '🐦',
        spotter VARCHAR(100) DEFAULT 'Anonymous',
        week VARCHAR(100) DEFAULT 'This week',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS members (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(100) DEFAULT 'Member',
        year INT DEFAULT 2024,
        specialty VARCHAR(255) DEFAULT '',
        avatar_class VARCHAR(50) DEFAULT 'av-1',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    tablesInitialized = true;
  } catch (err) {
    console.error('Failed to initialize Neon database tables:', err);
    throw err;
  }
}

// ── WALKS CRUD ──
export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  const normalizedUsername = username.trim();
  if (!normalizedUsername || !password) return false;
  await ensureTablesExist();
  const rows = await sql`SELECT password_hash, role, is_active FROM users WHERE username = ${normalizedUsername} LIMIT 1`;
  if (rows.length === 0 || rows[0].role !== 'admin' || !rows[0].is_active) return false;
  return verifyPassword(password, rows[0].password_hash);
}
export async function getUpcomingWalks(): Promise<Walk[]> {
  await ensureTablesExist();
  const rows = await sql`SELECT id, title, datetime, location, duration, description as desc, post_url, upcoming, created_at FROM walks WHERE upcoming = TRUE ORDER BY datetime ASC`;
  return rows.map((r) => ({ id: r.id, title: r.title, datetime: new Date(r.datetime).toISOString(), location: r.location, duration: r.duration, desc: r.desc || '', post_url: r.post_url || '', upcoming: r.upcoming, created_at: r.created_at }));
}
export async function addWalk(walk: Omit<Walk, 'id' | 'upcoming'>): Promise<Walk> {
  await ensureTablesExist();
  const rows = await sql`INSERT INTO walks (title, datetime, location, duration, description, post_url, upcoming) VALUES (${walk.title}, ${walk.datetime}, ${walk.location}, ${walk.duration || 'TBD'}, ${walk.desc || ''}, ${walk.post_url || ''}, TRUE) RETURNING id, title, datetime, location, duration, description as desc, post_url, upcoming, created_at`;
  const r = rows[0];
  return { id: r.id, title: r.title, datetime: new Date(r.datetime).toISOString(), location: r.location, duration: r.duration, desc: r.desc || '', post_url: r.post_url || '', upcoming: r.upcoming, created_at: r.created_at };
}
export async function markWalkAsPast(id: string | number): Promise<boolean> {
  await ensureTablesExist();
  const rows = await sql`SELECT * FROM walks WHERE id = ${id}`;
  if (rows.length === 0) return false;
  const walk = rows[0];
  await sql`UPDATE walks SET upcoming = FALSE WHERE id = ${id}`;
  const formattedDate = new Date(walk.datetime).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  await sql`INSERT INTO past_walks (title, date, participants, species, post_url) VALUES (${walk.title}, ${formattedDate}, ${String.fromCharCode(45)}, ${String.fromCharCode(45)}, ${walk.post_url || null})`;
  return true;
}
export async function deleteWalk(id: string | number): Promise<boolean> {
  await ensureTablesExist();
  const deleted = await sql`DELETE FROM walks WHERE id = ${id} RETURNING id`;
  return deleted.length > 0;
}
// ── PAST WALKS CRUD ──
export async function getPastWalks(): Promise<PastWalk[]> {
  await ensureTablesExist();
  const rows = await sql`SELECT id, title, date, participants, species, post_url, created_at FROM past_walks ORDER BY id DESC`;
  return rows.map((r) => ({ id: r.id, title: r.title, date: r.date, participants: r.participants, species: r.species, post_url: r.post_url || '', created_at: r.created_at }));
}
export async function addPastWalk(walk: Omit<PastWalk, 'id'>): Promise<PastWalk> {
  await ensureTablesExist();
  const rows = await sql`INSERT INTO past_walks (title, date, participants, species, post_url) VALUES (${walk.title}, ${walk.date}, ${walk.participants || String.fromCharCode(45)}, ${walk.species || String.fromCharCode(45)}, ${walk.post_url || null}) RETURNING id, title, date, participants, species, post_url, created_at`;
  const r = rows[0];
  return { id: r.id, title: r.title, date: r.date, participants: r.participants, species: r.species, post_url: r.post_url || '', created_at: r.created_at };
}
export async function deletePastWalk(id: string | number): Promise<boolean> {
  await ensureTablesExist();
  const deleted = await sql`DELETE FROM past_walks WHERE id = ${id} RETURNING id`;
  return deleted.length > 0;
}
// ── BIRDS CRUD ──
export async function getBirdSightings(): Promise<BirdSighting[]> {
  await ensureTablesExist();
  const rows = await sql`SELECT id, name, latin, location, photo, emoji, spotter, week, created_at FROM birds ORDER BY id DESC`;
  return rows.map((r) => ({ id: r.id, name: r.name, latin: r.latin || '', location: r.location, photo: r.photo || '', emoji: r.emoji || '🐦', spotter: r.spotter || 'Anonymous', week: r.week || 'This week', created_at: r.created_at }));
}
export async function addBirdSighting(bird: Omit<BirdSighting, 'id'>): Promise<BirdSighting> {
  await ensureTablesExist();
  const rows = await sql`INSERT INTO birds (name, latin, location, photo, emoji, spotter, week) VALUES (${bird.name}, ${bird.latin || ''}, ${bird.location}, ${bird.photo || ''}, ${bird.emoji || '🐦'}, ${bird.spotter || 'Anonymous'}, ${bird.week || 'This week'}) RETURNING id, name, latin, location, photo, emoji, spotter, week, created_at`;
  const r = rows[0];
  return { id: r.id, name: r.name, latin: r.latin || '', location: r.location, photo: r.photo || '', emoji: r.emoji, spotter: r.spotter, week: r.week, created_at: r.created_at };
}
export async function deleteBirdSighting(id: string | number): Promise<boolean> {
  await ensureTablesExist();
  const deleted = await sql`DELETE FROM birds WHERE id = ${id} RETURNING id`;
  return deleted.length > 0;
}
// ── MEMBERS CRUD ──
export async function getMembers(): Promise<Member[]> {
  await ensureTablesExist();
  const rows = await sql`SELECT id, name, role, year, specialty, avatar_class as av, created_at FROM members ORDER BY id ASC`;
  return rows.map((r) => ({ id: r.id, name: r.name, role: r.role, year: r.year, specialty: r.specialty || '', av: r.av || 'av-1', created_at: r.created_at }));
}
export async function addMember(member: Omit<Member, 'id'>): Promise<Member> {
  await ensureTablesExist();
  const rows = await sql`INSERT INTO members (name, role, year, specialty, avatar_class) VALUES (${member.name}, ${member.role || 'Member'}, ${member.year || new Date().getFullYear()}, ${member.specialty || ''}, ${member.av || 'av-1'}) RETURNING id, name, role, year, specialty, avatar_class as av, created_at`;
  const r = rows[0];
  return { id: r.id, name: r.name, role: r.role, year: r.year, specialty: r.specialty || '', av: r.av, created_at: r.created_at };
}
export async function deleteMember(id: string | number): Promise<boolean> {
  await ensureTablesExist();
  const deleted = await sql`DELETE FROM members WHERE id = ${id} RETURNING id`;
  return deleted.length > 0;
}
