import { NextRequest, NextResponse } from 'next/server';
import { deleteBirdSighting } from '@/lib/db';
import { isUserAdmin } from '@/lib/auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const { id } = await params;
    const success = await deleteBirdSighting(id);
    if (!success) {
      return NextResponse.json({ error: 'Bird sighting not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting bird sighting:', error);
    return NextResponse.json({ error: 'Failed to delete bird sighting' }, { status: 500 });
  }
}
