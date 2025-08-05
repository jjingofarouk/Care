import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const surgicalTeam = await prisma.surgicalTeam.findUnique({
      where: { id: params.id },
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
    });

    if (!surgicalTeam) {
      return NextResponse.json({ error: 'Surgical team not found' }, { status: 404 });
    }

    return NextResponse.json(surgicalTeam);
  } catch (error) {
    console.error('Error fetching surgical team:', error);
    return NextResponse.json({ error: 'Failed to fetch surgical team' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();

    if (!data.name) {
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      );
    }

    const existingTeam = await prisma.surgicalTeam.findFirst({
      where: { name: data.name, id: { not: params.id } },
    });

    if (existingTeam) {
      return NextResponse.json(
        { error: 'Surgical team with this name already exists' },
        { status: 400 }
      );
    }

    await prisma.surgicalTeamMember.deleteMany({
      where: { surgicalTeamId: params.id },
    });

    const surgicalTeam = await prisma.surgicalTeam.update({
      where: { id: params.id },
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

    return NextResponse.json(surgicalTeam);
  } catch (error) {
    console.error('Error updating surgical team:', error);
    return NextResponse.json({ error: 'Failed to update surgical team' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.surgicalTeam.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Surgical team deleted successfully' });
  } catch (error) {
    console.error('Error deleting surgical team:', error);
    return NextResponse.json({ error: 'Failed to delete surgical team' }, { status: 500 });
  }
}
