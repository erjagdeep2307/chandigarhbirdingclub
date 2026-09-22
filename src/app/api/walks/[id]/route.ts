import { NextRequest, NextResponse } from 'next/server';
import { markWalkAsPast, deleteWalk } from '@/lib/db';
import { isUserAdmin } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const { id } = await params;
    const success = await markWalkAsPast(id);
    if (!success) {
      return NextResponse.json({ error: 'Walk not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Walk marked as past' });
  } catch (error) {
    console.error('Error marking walk as past:', error);
    return NextResponse.json({ error: 'Failed to update walk' }, { status: 500 });
  }
}

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
    const success = await deleteWalk(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error deleting walk:', error);
    return NextResponse.json({ error: 'Failed to delete walk' }, { status: 500 });
  }
}
