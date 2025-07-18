import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  const search = searchParams.get('search') || '';

  try {
    const surgeries = await prisma.surgery.findMany({
      where: {
        OR: [
          { type: { contains: search, mode: 'insensitive' } },
          { notes: { contains: search, mode: 'insensitive' } },
        ],
      },
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true },
        },
        theatre: {
          select: { id: true, name: true },
        },
        surgicalTeam: {
          select: { id: true, name: true },
        },
        preOpAssessment: {
          select: { id: true, assessedAt: true },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.surgery.count({
      where: {
        OR: [
          { type: { contains: search, mode: 'insensitive' } },
          { notes: { contains: search, mode: 'insensitive' } },
        ],
      },
    });

    return NextResponse.json({ surgeries, total });
  } catch (error) {
    console.error('Error fetching surgeries:', error);
    return NextResponse.json({ error: 'Failed to fetch surgeries' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.patientId || !data.theatreId || !data.surgicalTeamId) {
      return NextResponse.json(
        { error: 'Missing required fields: patientId, theatreId, surgicalTeamId' },
        { status: 400 }
      );
    }

    const surgery = await prisma.surgery.create({
      data: {
        patientId: data.patientId,
        theatreId: data.theatreId,
        surgicalTeamId: data.surgicalTeamId,
        preOpAssessmentId: data.preOpAssessmentId,
        type: data.type,
        estimatedDurationMinutes: data.estimatedDurationMinutes,
        actualDurationMinutes: data.actualDurationMinutes,
        status: data.status,
        notes: data.notes,
        complications: data.complications,
      },
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true },
        },
        theatre: {
          select: { id: true, name: true },
        },
        surgicalTeam: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json(surgery, { status: 201 });
  } catch (error) {
    console.error('Error creating surgery:', error);
    return NextResponse.json(
      { error: 'Failed to create surgery' },
      { status: 500 }
    );
  }
}
