import { NextRequest, NextResponse } from 'next/server';
import { deleteEvent, updateEvent } from '@/lib/db';
import { isUserAdmin } from '@/lib/auth';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    if (!(await isUserAdmin())) return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    const body = await req.json();
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    const image_url = typeof body.image_url === 'string' && body.image_url.trim() ? body.image_url.trim() : '/images/bg.webp';
    if (!title || !description) return NextResponse.json({ error: 'Event heading and description are required' }, { status: 400 });
    const { id } = await params;
    const event = await updateEvent(id, { title, description, image_url });
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    if (!(await isUserAdmin())) return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    const { id } = await params;
    const success = await deleteEvent(id);
    if (!success) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
