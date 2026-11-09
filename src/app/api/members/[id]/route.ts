import { NextRequest, NextResponse } from 'next/server';
import { deleteMember, updateMember } from '@/lib/db';
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
    const { name, role, year, specialty } = await req.json();
    if (typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Member name is required' }, { status: 400 });
    }
    const parsedYear = Number.parseInt(String(year), 10);
    if (!Number.isInteger(parsedYear) || parsedYear < 2000 || parsedYear > 2099) {
      return NextResponse.json({ error: 'Enter a valid joined year' }, { status: 400 });
    }

    const member = await updateMember(id, {
      name: name.trim(),
      role: typeof role === 'string' && role.trim() ? role.trim() : 'Member',
      year: parsedYear,
      specialty: typeof specialty === 'string' ? specialty.trim() : '',
    });
    if (!member) return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    return NextResponse.json(member);
  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
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
    const success = await deleteMember(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
  }
}
