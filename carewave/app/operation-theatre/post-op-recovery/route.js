import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  const search = searchParams.get('search') || '';

  try {
    const postOpRecoveries = await prisma.postOpRecovery.findMany({
      where: {
        recoveryNotes: { contains: search, mode: 'insensitive' },
      },
      include: {
        surgery: {
          include: {
            patient: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.postOpRecovery.count({
      where: {
        recoveryNotes: { contains: search, mode: 'insensitive' },
      },
    });

    return NextResponse.json({ postOpRecoveries, total });
  } catch (error) {
    console.error('Error fetching post-op recoveries:', error);
    return NextResponse.json({ error: 'Failed to fetch post-op recoveries' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.surgeryId) {
      return NextResponse.json(
        { error: 'Missing required field: surgeryId' },
        { status: 400 }
      );
    }

    const postOpRecovery = await prisma.postOpRecovery.create({
      data: {
        surgeryId: data.surgeryId,
        recoveryNotes: data.recoveryNotes,
        dischargeDate: data.dischargeDate ? new Date(data.dischargeDate) : null,
        complications: data.complications,
      },
      include: {
        surgery: {
          include: {
            patient: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
      },
    });

    return NextResponse.json(postOpRecovery, { status: 201 });
  } catch (error) {
    console.error('Error creating post-op recovery:', error);
    return NextResponse.json(
      { error: 'Failed to create post-op recovery' },
      { status: 500 }
    );
  }
}
