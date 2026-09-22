import { NextRequest, NextResponse } from 'next/server';
import { getMembers, addMember } from '@/lib/db';
import { isUserAdmin } from '@/lib/auth';

const AVATAR_CLASSES = ['av-1', 'av-2', 'av-3', 'av-4', 'av-5', 'av-6', 'av-7', 'av-8'];

export async function GET() {
  try {
    const members = await getMembers();
    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const body = await req.json();
    const { name, role, year, specialty } = body;

    if (!name) {
      return NextResponse.json({ error: 'Member name is required' }, { status: 400 });
    }

    const currentMembers = await getMembers();
    const av = AVATAR_CLASSES[currentMembers.length % AVATAR_CLASSES.length];

    const newMember = await addMember({
      name,
      role: role || 'Member',
      year: year ? parseInt(year, 10) : new Date().getFullYear(),
      specialty: specialty || '',
      av,
    });

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error('Error adding member:', error);
    return NextResponse.json({ error: 'Failed to add member' }, { status: 500 });
  }
}
