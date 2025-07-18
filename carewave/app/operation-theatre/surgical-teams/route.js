import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  const search = searchParams.get('search') || '';

  try {
    const surgicalTeams = await prisma.surgicalTeam.findMany({
      where: {
        name: { contains: search, mode: 'insensitive' },
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
        surgeries: {
          select: { id: true, type: true, status: true },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.surgicalTeam.count({
      where: {
        name: { contains: search, mode: 'insensitive' },
      },
    });

    return NextResponse.json({ surgicalTeams, total });
  } catch (error) {
    console.error('Error fetching surgical teams:', error);
    return NextResponse.json({ error: 'Failed to fetch surgical teams' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.name || !data.members) {
      return NextResponse.json(
        { error: 'Missing required fields: name, members' },
        { status: 400 }
      );
    }

    const existingTeam = await prisma.surgicalTeam.findUnique({
      where: { name: data.name },
    });

    if (existingTeam) {
      return NextResponse.json(
        { error: 'Surgical team with this name already exists' },
        { status: 400 }
      );
    }

    const surgicalTeam = await prisma.surgicalTeam.create({
      data: {
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
            user: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
      },
    });

    return NextResponse.json(surgicalTeam, { status: 201 });
  } catch (error) {
    console.error('Error creating surgical team:', error);
    return NextResponse.json(
      { error: 'Failed to create surgical team' },
      { status: 500 }
    );
  }
}
