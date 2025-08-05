import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  const search = searchParams.get('search') || '';

  try {
    const theatres = await prisma.theatre.findMany({
      where: {
        name: { contains: search, mode: 'insensitive' },
      },
      include: {
        department: {
          select: { id: true, name: true },
        },
        surgeries: {
          select: { id: true, type: true, status: true, createdAt: true },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.theatre.count({
      where: {
        name: { contains: search, mode: 'insensitive' },
      },
    });

    return NextResponse.json({ theatres, total });
  } catch (error) {
    console.error('Error fetching theatres:', error);
    return NextResponse.json({ error: 'Failed to fetch theatres' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.name || !data.departmentId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, departmentId' },
        { status: 400 }
      );
    }

    const existingTheatre = await prisma.theatre.findUnique({
      where: { name: data.name },
    });

    if (existingTheatre) {
      return NextResponse.json(
        { error: 'Theatre with this name already exists' },
        { status: 400 }
      );
    }

    const theatre = await prisma.theatre.create({
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

    return NextResponse.json(theatre, { status: 201 });
  } catch (error) {
    console.error('Error creating theatre:', error);
    return NextResponse.json(
      { error: 'Failed to create theatre' },
      { status: 500 }
    );
  }
}
