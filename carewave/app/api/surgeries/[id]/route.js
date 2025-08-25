import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const id = params?.id;
    if (!id) {
      return NextResponse.json({ error: 'Missing surgery ID' }, { status: 400 });
    }

    const surgery = await prisma.surgery.findUnique({
      where: { id },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true } },
        theatre: { select: { id: true, name: true } },
        surgicalTeam: { select: { id: true, name: true } },
        auditLogs: true,
        anesthesiaRecords: true,
        postOpRecoveries: true,
      },
    });

    if (!surgery) {
      return NextResponse.json({ error: 'Surgery not found' }, { status: 404 });
    }

    return NextResponse.json(surgery);
  } catch (error) {
    console.error('GET /api/surgeries/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch surgery', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession();
    if (!session || !['DOCTOR', 'SURGEON', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params?.id;
    if (!id) {
      return NextResponse.json({ error: 'Missing surgery ID' }, { status: 400 });
    }

    const data = await request.json();
    if (!data.patientId || !data.theatreId || !data.surgicalTeamId) {
      return NextResponse.json(
        { error: 'Patient ID, theatre ID, and surgical team ID are required' },
        { status: 400 }
      );
    }

    const existingSurgery = await prisma.surgery.findUnique({
      where: { id },
    });

    if (!existingSurgery) {
      return NextResponse.json({ error: 'Surgery not found' }, { status: 404 });
    }

    // Track changes for audit log
    const auditLogs = [];
    const fieldsToTrack = ['status', 'notes', 'complications', 'estimatedDurationMinutes', 'actualDurationMinutes'];
    for (const field of fieldsToTrack) {
      if (data[field] && data[field] !== existingSurgery[field]) {
        auditLogs.push({
          surgeryId: id,
          changedById: session.user.id,
          fieldChanged: field,
          oldValue: String(existingSurgery[field] || 'N/A'),
          newValue: String(data[field]),
        });
      }
    }

    const surgery = await prisma.surgery.update({
      where: { id },
      data: {
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
        auditLogs: {
          create: auditLogs,
        },
      },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true } },
        theatre: { select: { id: true, name: true } },
        surgicalTeam: { select: { id: true, name: true } },
        auditLogs: true,
      },
    });

    return NextResponse.json(surgery);
  } catch (error) {
    console.error('PUT /api/surgeries/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update surgery', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params?.id;
    if (!id) {
      return NextResponse.json({ error: 'Missing surgery ID' }, { status: 400 });
    }

    await prisma.surgery.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Surgery deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/surgeries/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete surgery', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}