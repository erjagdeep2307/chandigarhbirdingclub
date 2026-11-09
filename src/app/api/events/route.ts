import { NextRequest, NextResponse } from 'next/server';
import { addEvent, getEvents } from '@/lib/db';
import { isUserAdmin } from '@/lib/auth';

export async function GET() {
  try {
    return NextResponse.json(await getEvents());
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isUserAdmin())) return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    const body = await req.json();
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    const image_url = typeof body.image_url === 'string' && body.image_url.trim() ? body.image_url.trim() : '/images/bg.webp';
    if (!title || !description) return NextResponse.json({ error: 'Event heading and description are required' }, { status: 400 });
    return NextResponse.json(await addEvent({ title, description, image_url }), { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
