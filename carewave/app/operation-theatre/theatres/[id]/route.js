import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const theatre = await prisma.theatre.findUnique({
      where: { id: params.id },
      include: {
        department: {
          select: { id: true, name: true },
        },
        surgeries: {
          select: { id: true, type: true, status: true, createdAt: true },
        },
      },
    });

    if (!theatre) {
      return NextResponse.json({ error: 'Theatre not found' }, { status: 404 });
    }

    return NextResponse.json(theatre);
  } catch (error) {
    console.error('Error fetching theatre:', error);
    return NextResponse.json({ error: 'Failed to fetch theatre' }, { status: 500 });
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

    const existingTheatre = await prisma.theatre.findFirst({
      where: { name: data.name, id: { not: params.id } },
    });

    if (existingTheatre) {
      return NextResponse.json(
        { error: 'Theatre with this name already exists' },
        { status: 400 }
      );
    }

    const theatre = await prisma.theatre.update({
      where: { id: params.id },
      data: {
        name: data.name,
        departmentId: data.departmentId,
      },
      include: {
        department: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json(theatre);
  } catch (error) {
    console.error('Error updating theatre:', error);
    return NextResponse.json({ error: 'Failed to update theatre' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.theatre.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Theatre deleted successfully' });
  } catch (error) {
    console.error('Error deleting theatre:', error);
    return NextResponse.json({ error: 'Failed to delete theatre' }, { status: 500 });
  }
}
