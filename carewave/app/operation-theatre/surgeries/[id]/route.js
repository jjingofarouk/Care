import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const surgery = await prisma.surgery.findUnique({
      where: { id: params.id },
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
        anesthesiaRecord: true,
        postOpRecovery: true,
        auditLogs: {
          include: {
            changedBy: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
      },
    });

    if (!surgery) {
      return NextResponse.json({ error: 'Surgery not found' }, { status: 404 });
    }

    return NextResponse.json(surgery);
  } catch (error) {
    console.error('Error fetching surgery:', error);
    return NextResponse.json({ error: 'Failed to fetch surgery' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();

    const surgery = await prisma.surgery.update({
      where: { id: params.id },
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

    return NextResponse.json(surgery);
  } catch (error) {
    console.error('Error updating surgery:', error);
    return NextResponse.json({ error: 'Failed to update surgery' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.surgery.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Surgery deleted successfully' });
  } catch (error) {
    console.error('Error deleting surgery:', error);
    return NextResponse.json({ error: 'Failed to delete surgery' }, { status: 500 });
  }
}
