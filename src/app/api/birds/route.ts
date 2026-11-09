import { NextRequest, NextResponse } from 'next/server';
import { getBirdSightings, addBirdSighting } from '@/lib/db';
import { isUserAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const birds = await getBirdSightings();
    return NextResponse.json(birds);
  } catch (error) {
    console.error('Error fetching birds:', error);
    return NextResponse.json({ error: 'Failed to fetch bird sightings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const body = await req.json();
    const { name, latin, location, photo, emoji, spotter, week } = body;

    if (!name || !location) {
      return NextResponse.json({ error: 'Bird Name and Location are required' }, { status: 400 });
    }

    const newBird = await addBirdSighting({
      name,
      latin: latin || '',
      location,
      photo: photo || '',
      emoji: emoji || '🐦',
      spotter: spotter || 'Anonymous',
      week: week || 'This week',
    });

    return NextResponse.json(newBird, { status: 201 });
  } catch (error) {
    console.error('Error adding bird sighting:', error);
    return NextResponse.json({ error: 'Failed to add bird sighting' }, { status: 500 });
  }
}
