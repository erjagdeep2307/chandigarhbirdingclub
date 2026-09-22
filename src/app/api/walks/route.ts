import { NextRequest, NextResponse } from 'next/server';
import { getUpcomingWalks, addWalk } from '@/lib/db';
import { isUserAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const walks = await getUpcomingWalks();
    return NextResponse.json(walks);
  } catch (error) {
    console.error('Error fetching walks:', error);
    return NextResponse.json({ error: 'Failed to fetch walks' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const body = await req.json();
    const { title, datetime, location, duration, desc } = body;

    if (!title || !datetime || !location) {
      return NextResponse.json({ error: 'Title, Date & Time, and Location are required' }, { status: 400 });
    }

    const newWalk = await addWalk({
      title,
      datetime,
      location,
      duration: duration || 'TBD',
      desc: desc || '',
    });

    return NextResponse.json(newWalk, { status: 201 });
  } catch (error) {
    console.error('Error adding walk:', error);
    return NextResponse.json({ error: 'Failed to create walk announcement' }, { status: 500 });
  }
}
