import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    const where = {};
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const surgicalTeams = await prisma.surgicalTeam.findMany({
      where,
      include: {
        members: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(surgicalTeams);
  } catch (error) {
    console.error('GET /api/surgical-teams error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch surgical teams', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session || !['ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    if (!data.name || !data.members || !Array.isArray(data.members) || data.members.length === 0) {
      return NextResponse.json(
        { error: 'Team name and at least one member are required' },
        { status: 400 }
      );
    }

    const id = `ST-${uuidv4().slice(0, 8)}`;
    const surgicalTeam = await prisma.surgicalTeam.create({
      data: {
        id,
        name: data.name,
        members: {
          create: data.members.map(member => ({
            userId: member.userId,
            role: member.role,
          })),
        },
      },
      include: {
        members: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
    });

    return NextResponse.json(surgicalTeam, { status: 201 });
  } catch (error) {
    console.error('POST /api/surgical-teams error:', error);
    return NextResponse.json(
      { error: 'Failed to create surgical team', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}