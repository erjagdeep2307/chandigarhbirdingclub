import { neon } from '@neondatabase/serverless';
import { Walk, PastWalk, BirdSighting, Member } from './types';

const isNeonConfigured = Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '');

// Initialize Neon SQL driver if DATABASE_URL is present
const sql = isNeonConfigured ? neon(process.env.DATABASE_URL!) : null;

// Local fallback memory store in case Neon is not configured yet
let mockWalks: Walk[] = [
  {
    id: 1,
    title: 'Sukhna Lake Dawn Migratory Watch',
    datetime: '2026-03-29T06:00:00.000Z',
    location: 'Sukhna Lake Regulating End, Chandigarh',
    duration: '3 hours',
    desc: 'Join us as we observe winter migratory waterfowl preparing for departure, alongside resident waders, grebes, and raptors. Binoculars recommended!',
    upcoming: true,
  },
  {
    id: 2,
    title: 'Nepli Forest Trail & Canopy Exploration',
    datetime: '2026-04-12T06:30:00.000Z',
    location: 'Kansal Forest Gate, Sector 1',
    duration: '3.5 hours',
    desc: 'Deep walk through Kansal-Nepli reserve forest targeting forest birds, flycatchers, woodpeckers, and the Indian Grey Hornbill.',
    upcoming: true,
  }
];

let mockPastWalks: PastWalk[] = [
  {
    id: 101,
    title: 'Sukhna Wetland Census',
    date: 'Feb 2026',
    participants: '24 birder',
    species: '48',
    emoji: '🦆',
  },
  {
    id: 102,
    title: 'Morni Foothills Birding',
    date: 'Jan 2026',
    participants: '18',
    species: '36',
    emoji: '🦅',
  },
  {
    id: 103,
    title: 'Rock Garden Urban Avian Walk',
    date: 'Dec 2025',
    participants: '15',
    species: '22',
    emoji: '🌿',
  }
];

let mockBirds: BirdSighting[] = [
  {
    id: 201,
    name: 'Indian Grey Hornbill',
    latin: 'Ocyceros birostris',
    location: 'Sukhna Lake Promenade',
    photo: '',
    emoji: '🪶',
    spotter: 'Vartika Arora',
    week: 'This week',
  },
  {
    id: 202,
    name: 'Indian Roller',
    latin: 'Coracias benghalensis',
    location: 'Lake Club Grounds',
    photo: '',
    emoji: '🐦',
    spotter: 'Priya Sharma',
    week: 'This week',
  },
  {
    id: 203,
    name: 'Black-winged Stilt',
    latin: 'Himantopus himantopus',
    location: 'Sukhna Wet Zone',
    photo: '',
    emoji: '🪿',
    spotter: 'Amanpreet Singh',
    week: 'Last week',
  },
  {
    id: 204,
    name: 'White-throated Kingfisher',
    latin: 'Halcyon smyrnensis',
    location: 'Garden of Silence',
    photo: '',
    emoji: '🐟',
    spotter: 'Rohit Verma',
    week: 'Last week',
  }
];

let mockMembers: Member[] = [
  {
    id: 301,
    name: 'Vartika Arora',
    role: 'Founder & Naturalist',
    year: 2023,
    specialty: 'Raptors & Wetlands',
    av: 'av-2',
  },
  {
    id: 302,
    name: 'Amanpreet Singh',
    role: 'Club Coordinator',
    year: 2023,
    specialty: 'Passerines & Audio Identification',
    av: 'av-3',
  },
  {
    id: 303,
    name: 'Priya Sharma',
    role: 'Photographer',
    year: 2024,
    specialty: 'Avian Photography & Documentation',
    av: 'av-4',
  },
  {
    id: 304,
    name: 'Karan Mehra',
    role: 'Member',
    year: 2024,
    specialty: 'Migratory Waterfowl',
    av: 'av-5',
  }
];

// Ensure tables exist in Neon
let tablesInitialized = false;
export async function ensureTablesExist() {
  if (!sql || tablesInitialized) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS walks (
        id BIGSERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        datetime TIMESTAMPTZ NOT NULL,
        location VARCHAR(255) NOT NULL,
        duration VARCHAR(100) DEFAULT 'TBD',
        description TEXT DEFAULT '',
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
        emoji VARCHAR(10) DEFAULT '🌿',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
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

    // Seed initial data if tables are empty
    const walksCount = await sql`SELECT count(*) as count FROM walks`;
    if (parseInt(walksCount[0].count, 10) === 0) {
      for (const w of mockWalks) {
        await sql`
          INSERT INTO walks (title, datetime, location, duration, description, upcoming)
          VALUES (${w.title}, ${w.datetime}, ${w.location}, ${w.duration}, ${w.desc}, ${w.upcoming})
        `;
      }
    }

    const pastCount = await sql`SELECT count(*) as count FROM past_walks`;
    if (parseInt(pastCount[0].count, 10) === 0) {
      for (const pw of mockPastWalks) {
        await sql`
          INSERT INTO past_walks (title, date, participants, species, emoji)
          VALUES (${pw.title}, ${pw.date}, ${pw.participants}, ${pw.species}, ${pw.emoji})
        `;
      }
    }

    const birdsCount = await sql`SELECT count(*) as count FROM birds`;
    if (parseInt(birdsCount[0].count, 10) === 0) {
      for (const b of mockBirds) {
        await sql`
          INSERT INTO birds (name, latin, location, photo, emoji, spotter, week)
          VALUES (${b.name}, ${b.latin || ''}, ${b.location}, ${b.photo || ''}, ${b.emoji}, ${b.spotter}, ${b.week})
        `;
      }
    }

    const membersCount = await sql`SELECT count(*) as count FROM members`;
    if (parseInt(membersCount[0].count, 10) === 0) {
      for (const m of mockMembers) {
        await sql`
          INSERT INTO members (name, role, year, specialty, avatar_class)
          VALUES (${m.name}, ${m.role}, ${m.year}, ${m.specialty || ''}, ${m.av})
        `;
      }
    }

    tablesInitialized = true;
  } catch (err) {
    console.error('Failed to initialize Neon database tables:', err);
  }
}

// ── WALKS CRUD ──
export async function getUpcomingWalks(): Promise<Walk[]> {
  if (sql) {
    await ensureTablesExist();
    const rows = await sql`
      SELECT id, title, datetime, location, duration, description as desc, upcoming, created_at
      FROM walks
      WHERE upcoming = TRUE
      ORDER BY datetime ASC
    `;
    return rows.map(r => ({
      id: r.id,
      title: r.title,
      datetime: new Date(r.datetime).toISOString(),
      location: r.location,
      duration: r.duration,
      desc: r.desc || '',
      upcoming: r.upcoming,
      created_at: r.created_at,
    }));
  }
  return mockWalks.filter(w => w.upcoming);
}

export async function addWalk(walk: Omit<Walk, 'id' | 'upcoming'>): Promise<Walk> {
  if (sql) {
    await ensureTablesExist();
    const rows = await sql`
      INSERT INTO walks (title, datetime, location, duration, description, upcoming)
      VALUES (${walk.title}, ${walk.datetime}, ${walk.location}, ${walk.duration || 'TBD'}, ${walk.desc || ''}, TRUE)
      RETURNING id, title, datetime, location, duration, description as desc, upcoming, created_at
    `;
    const r = rows[0];
    return {
      id: r.id,
      title: r.title,
      datetime: new Date(r.datetime).toISOString(),
      location: r.location,
      duration: r.duration,
      desc: r.desc,
      upcoming: r.upcoming,
      created_at: r.created_at,
    };
  }
  const newWalk: Walk = {
    id: Date.now(),
    title: walk.title,
    datetime: walk.datetime,
    location: walk.location,
    duration: walk.duration || 'TBD',
    desc: walk.desc || '',
    upcoming: true,
  };
  mockWalks.unshift(newWalk);
  return newWalk;
}

export async function markWalkAsPast(id: string | number): Promise<boolean> {
  if (sql) {
    await ensureTablesExist();
    const walk = await sql`SELECT * FROM walks WHERE id = ${id}`;
    if (walk.length === 0) return false;
    const w = walk[0];
    await sql`UPDATE walks SET upcoming = FALSE WHERE id = ${id}`;
    const formattedDate = new Date(w.datetime).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    await sql`
      INSERT INTO past_walks (title, date, participants, species, emoji)
      VALUES (${w.title}, ${formattedDate}, '—', '—', '🌿')
    `;
    return true;
  }
  const idx = mockWalks.findIndex(w => String(w.id) === String(id));
  if (idx !== -1) {
    const w = mockWalks[idx];
    mockWalks.splice(idx, 1);
    const d = new Date(w.datetime);
    mockPastWalks.unshift({
      id: Date.now(),
      title: w.title,
      date: isNaN(d.getTime()) ? 'Recently' : d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      participants: '—',
      species: '—',
      emoji: '🌿',
    });
    return true;
  }
  return false;
}

export async function deleteWalk(id: string | number): Promise<boolean> {
  if (sql) {
    await ensureTablesExist();
    await sql`DELETE FROM walks WHERE id = ${id}`;
    return true;
  }
  mockWalks = mockWalks.filter(w => String(w.id) !== String(id));
  return true;
}

// ── PAST WALKS CRUD ──
export async function getPastWalks(): Promise<PastWalk[]> {
  if (sql) {
    await ensureTablesExist();
    const rows = await sql`
      SELECT id, title, date, participants, species, emoji, created_at
      FROM past_walks
      ORDER BY id DESC
    `;
    return rows.map(r => ({
      id: r.id,
      title: r.title,
      date: r.date,
      participants: r.participants,
      species: r.species,
      emoji: r.emoji,
      created_at: r.created_at,
    }));
  }
  return mockPastWalks;
}

export async function addPastWalk(walk: Omit<PastWalk, 'id'>): Promise<PastWalk> {
  if (sql) {
    await ensureTablesExist();
    const rows = await sql`
      INSERT INTO past_walks (title, date, participants, species, emoji)
      VALUES (${walk.title}, ${walk.date}, ${walk.participants || '—'}, ${walk.species || '—'}, ${walk.emoji || '🌿'})
      RETURNING id, title, date, participants, species, emoji, created_at
    `;
    const r = rows[0];
    return {
      id: r.id,
      title: r.title,
      date: r.date,
      participants: r.participants,
      species: r.species,
      emoji: r.emoji,
      created_at: r.created_at,
    };
  }
  const newPastWalk: PastWalk = {
    id: Date.now(),
    title: walk.title,
    date: walk.date,
    participants: walk.participants || '—',
    species: walk.species || '—',
    emoji: walk.emoji || '🌿',
  };
  mockPastWalks.unshift(newPastWalk);
  return newPastWalk;
}

export async function deletePastWalk(id: string | number): Promise<boolean> {
  if (sql) {
    await ensureTablesExist();
    await sql`DELETE FROM past_walks WHERE id = ${id}`;
    return true;
  }
  mockPastWalks = mockPastWalks.filter(pw => String(pw.id) !== String(id));
  return true;
}

// ── BIRDS CRUD ──
export async function getBirdSightings(): Promise<BirdSighting[]> {
  if (sql) {
    await ensureTablesExist();
    const rows = await sql`
      SELECT id, name, latin, location, photo, emoji, spotter, week, created_at
      FROM birds
      ORDER BY id DESC
    `;
    return rows.map(r => ({
      id: r.id,
      name: r.name,
      latin: r.latin || '',
      location: r.location,
      photo: r.photo || '',
      emoji: r.emoji || '🐦',
      spotter: r.spotter || 'Anonymous',
      week: r.week || 'This week',
      created_at: r.created_at,
    }));
  }
  return mockBirds;
}

export async function addBirdSighting(bird: Omit<BirdSighting, 'id'>): Promise<BirdSighting> {
  if (sql) {
    await ensureTablesExist();
    const rows = await sql`
      INSERT INTO birds (name, latin, location, photo, emoji, spotter, week)
      VALUES (${bird.name}, ${bird.latin || ''}, ${bird.location}, ${bird.photo || ''}, ${bird.emoji || '🐦'}, ${bird.spotter || 'Anonymous'}, ${bird.week || 'This week'})
      RETURNING id, name, latin, location, photo, emoji, spotter, week, created_at
    `;
    const r = rows[0];
    return {
      id: r.id,
      name: r.name,
      latin: r.latin || '',
      location: r.location,
      photo: r.photo || '',
      emoji: r.emoji,
      spotter: r.spotter,
      week: r.week,
      created_at: r.created_at,
    };
  }
  const newBird: BirdSighting = {
    id: Date.now(),
    name: bird.name,
    latin: bird.latin || '',
    location: bird.location,
    photo: bird.photo || '',
    emoji: bird.emoji || '🐦',
    spotter: bird.spotter || 'Anonymous',
    week: bird.week || 'This week',
  };
  mockBirds.unshift(newBird);
  return newBird;
}

export async function deleteBirdSighting(id: string | number): Promise<boolean> {
  if (sql) {
    await ensureTablesExist();
    await sql`DELETE FROM birds WHERE id = ${id}`;
    return true;
  }
  mockBirds = mockBirds.filter(b => String(b.id) !== String(id));
  return true;
}

// ── MEMBERS CRUD ──
export async function getMembers(): Promise<Member[]> {
  if (sql) {
    await ensureTablesExist();
    const rows = await sql`
      SELECT id, name, role, year, specialty, avatar_class as av, created_at
      FROM members
      ORDER BY id ASC
    `;
    return rows.map(r => ({
      id: r.id,
      name: r.name,
      role: r.role,
      year: r.year,
      specialty: r.specialty || '',
      av: r.av || 'av-1',
      created_at: r.created_at,
    }));
  }
  return mockMembers;
}

export async function addMember(member: Omit<Member, 'id'>): Promise<Member> {
  if (sql) {
    await ensureTablesExist();
    const rows = await sql`
      INSERT INTO members (name, role, year, specialty, avatar_class)
      VALUES (${member.name}, ${member.role || 'Member'}, ${member.year || new Date().getFullYear()}, ${member.specialty || ''}, ${member.av || 'av-1'})
      RETURNING id, name, role, year, specialty, avatar_class as av, created_at
    `;
    const r = rows[0];
    return {
      id: r.id,
      name: r.name,
      role: r.role,
      year: r.year,
      specialty: r.specialty || '',
      av: r.av,
      created_at: r.created_at,
    };
  }
  const newMember: Member = {
    id: Date.now(),
    name: member.name,
    role: member.role || 'Member',
    year: member.year || new Date().getFullYear(),
    specialty: member.specialty || '',
    av: member.av || 'av-1',
  };
  mockMembers.push(newMember);
  return newMember;
}

export async function deleteMember(id: string | number): Promise<boolean> {
  if (sql) {
    await ensureTablesExist();
    await sql`DELETE FROM members WHERE id = ${id}`;
    return true;
  }
  mockMembers = mockMembers.filter(m => String(m.id) !== String(id));
  return true;
}
