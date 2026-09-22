import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load .env.local if present, else .env
if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
} else {
  dotenv.config();
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl || databaseUrl.trim() === '') {
  console.log('⚠️  DATABASE_URL is not set in .env.local');
  console.log('👉 Please set DATABASE_URL in .env.local with your Neon connection string.');
  process.exit(1);
}

console.log('🔌 Connecting to Neon PostgreSQL...');
const sql = neon(databaseUrl);

async function run() {
  try {
    const schemaSql = fs.readFileSync(path.join(process.cwd(), 'src', 'lib', 'schema.sql'), 'utf-8');
    // Split by semicolons for clean execution
    const queries = schemaSql
      .split(';')
      .map(q => q.trim())
      .filter(q => q.length > 0);

    for (const q of queries) {
      await sql(q);
    }
    console.log('✅ Tables created/verified in Neon PostgreSQL successfully!');

    // Check count of rows
    const walksCount = await sql`SELECT count(*) FROM walks`;
    console.log(`📊 Current walks count: ${walksCount[0].count}`);

    const birdsCount = await sql`SELECT count(*) FROM birds`;
    console.log(`📊 Current bird sightings count: ${birdsCount[0].count}`);

    const membersCount = await sql`SELECT count(*) FROM members`;
    console.log(`📊 Current members count: ${membersCount[0].count}`);

    console.log('🎉 Setup complete! You are ready to run: npm run dev');
  } catch (err) {
    console.error('❌ Failed to run Neon DB setup:', err);
    process.exit(1);
  }
}

run();
