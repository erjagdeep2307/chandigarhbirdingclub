import { NextRequest, NextResponse } from 'next/server';
import { deletePastWalk } from '@/lib/db';
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
    const success = await deletePastWalk(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error deleting past walk:', error);
    return NextResponse.json({ error: 'Failed to delete past walk' }, { status: 500 });
  }
}
