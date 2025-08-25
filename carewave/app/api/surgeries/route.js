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
      where.OR = [
        { type: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
      ];
    }

    const surgeries = await prisma.surgery.findMany({
      where,
      include: {
        patient: { select: { id: true, firstName: true, lastName: true } },
        theatre: { select: { id: true, name: true } },
        surgicalTeam: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(surgeries);
  } catch (error) {
    console.error('GET /api/surgeries error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch surgeries', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session || !['DOCTOR', 'SURGEON', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    if (!data.patientId || !data.theatreId || !data.surgicalTeamId) {
      return NextResponse.json(
        { error: 'Patient ID, theatre ID, and surgical team ID are required' },
        { status: 400 }
      );
    }

    const id = `S-${uuidv4().slice(0, 8)}`;
    const surgery = await prisma.surgery.create({
      data: {
        id,
        patientId: data.patientId,
        theatreId: data.theatreId,
        surgicalTeamId: data.surgicalTeamId,
        preOpAssessmentId: data.preOpAssessmentId || null,
        type: data.type || null,
        estimatedDurationMinutes: data.estimatedDurationMinutes ? parseInt(data.estimatedDurationMinutes) : null,
        actualDurationMinutes: data.actualDurationMinutes ? parseInt(data.actualDurationMinutes) : null,
        status: data.status || 'PLANNED',
        notes: data.notes || null,
        complications: data.complications || null,
      },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true } },
        theatre: { select: { id: true, name: true } },
        surgicalTeam: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(surgery, { status: 201 });
  } catch (error) {
    console.error('POST /api/surgeries error:', error);
    return NextResponse.json(
      { error: 'Failed to create surgery', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}