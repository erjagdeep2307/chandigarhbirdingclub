import { NextRequest, NextResponse } from 'next/server';
import { getPastWalks, addPastWalk } from '@/lib/db';
import { isUserAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const pastWalks = await getPastWalks();
    return NextResponse.json(pastWalks);
  } catch (error) {
    console.error('Error fetching past walks:', error);
    return NextResponse.json({ error: 'Failed to fetch past walks' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const body = await req.json();
    const { title, date, participants, species, emoji } = body;

    if (!title || !date) {
      return NextResponse.json({ error: 'Title and Date are required' }, { status: 400 });
    }

    const newPastWalk = await addPastWalk({
      title,
      date,
      participants: participants || '—',
      species: species || '—',
      emoji: emoji || '🌿',
    });

    return NextResponse.json(newPastWalk, { status: 201 });
  } catch (error) {
    console.error('Error adding past walk:', error);
    return NextResponse.json({ error: 'Failed to add past walk record' }, { status: 500 });
  }
}
