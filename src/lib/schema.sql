-- Chandigarh Birding Club PostgreSQL Schema for Neon

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS walks (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  datetime TIMESTAMPTZ NOT NULL,
  location VARCHAR(255) NOT NULL,
  area TEXT DEFAULT '',
  duration VARCHAR(100) DEFAULT 'TBD',
  description TEXT DEFAULT '',
  post_url TEXT DEFAULT '',
  upcoming BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS past_walks (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date VARCHAR(100) NOT NULL,
  participants VARCHAR(100) DEFAULT '—',
  species VARCHAR(100) DEFAULT '—',
  post_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE walks ADD COLUMN IF NOT EXISTS post_url TEXT DEFAULT '';
ALTER TABLE walks ADD COLUMN IF NOT EXISTS area TEXT DEFAULT '';
ALTER TABLE past_walks ADD COLUMN IF NOT EXISTS post_url TEXT DEFAULT '';

CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '/images/bg.webp',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS app_settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);

WITH seed_guard AS (
  INSERT INTO app_settings (key, value)
  VALUES ('events_sample_seeded', 'true')
  ON CONFLICT (key) DO NOTHING
  RETURNING key
)
INSERT INTO events (title, description, image_url)
SELECT 'Wetland Watch at Sukhna Lake',
       'Join us for a morning by the water as we observe winter visitors, share field notes, and learn how healthy wetlands support birdlife.',
       '/images/bg.webp'
FROM seed_guard;

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

CREATE TABLE IF NOT EXISTS members (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100) DEFAULT 'Member',
  year INT DEFAULT 2024,
  specialty VARCHAR(255) DEFAULT '',
  avatar_class VARCHAR(50) DEFAULT 'av-1',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
