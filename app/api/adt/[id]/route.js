// app/api/adt/[id]/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const admission = await prisma.admission.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        ward: true,
      },
    });
    if (!admission) {
      return NextResponse.json({ error: 'Admission not found' }, { status: 404 });
    }
    return NextResponse.json(admission);
  } catch (error) {
    console.error('GET /api/adt/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch admission', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const previousAdmission = await prisma.admission.findUnique({
      where: { id: parseInt(params.id) },
      include: { ward: true },
    });
    if (!previousAdmission) {
      return NextResponse.json({ error: 'Admission not found' }, { status: 404 });
    }
    const admission = await prisma.admission.update({
      where: { id: parseInt(params.id) },
      data: {
        patient: data.patientId ? { connect: { id: parseInt(data.patientId) } } : undefined,
        doctor: data.doctorId ? { connect: { id: parseInt(data.doctorId) } } : undefined,
        ward: data.wardId ? { connect: { id: parseInt(data.wardId) } } : undefined,
        admissionDate: data.admissionDate ? new Date(data.admissionDate) : undefined,
        triagePriority: data.triagePriority || null,
        triageNotes: data.triageNotes || null,
        presentingComplaints: data.presentingComplaints || null,
        relayedInfo: data.relayedInfo || null,
        status: data.status,
        dischargeNotes: data.dischargeNotes || null,
        dischargeDate: data.dischargeDate ? new Date(data.dischargeDate) : null,
        scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : null,
        preAdmissionNotes: data.preAdmissionNotes || null,
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        ward: true,
      },
    });
    if (data.status === 'DISCHARGED' && previousAdmission.wardId) {
      await prisma.ward.update({
        where: { id: previousAdmission.wardId },
        data: { occupiedBeds: { decrement: 1 } },
      });
    }
    if (data.wardId && data.wardId !== previousAdmission.wardId) {
      if (previousAdmission.wardId) {
        await prisma.ward.update({
          where: { id: previousAdmission.wardId },
          data: { occupiedBeds: { decrement: 1 } },
        });
      }
      await prisma.ward.update({
        where: { id: data.wardId },
        data: { occupiedBeds: { increment: 1 } },
      });
    }
    return NextResponse.json(admission);
  } catch (error) {
    console.error('PUT /api/adt/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update admission', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request, { params }) {
  try {
    const admission = await prisma.admission.findUnique({
      where: { id: parseInt(params.id) },
      include: { ward: true },
    });
    if (!admission) {
      return NextResponse.json({ error: 'Admission not found' }, { status: 404 });
    }
    if (admission.wardId) {
      await prisma.ward.update({
        where: { id: admission.wardId },
        data: { occupiedBeds: { decrement: 1 } },
      });
    }
    await prisma.admission.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Admission deleted' });
  } catch (error) {
    console.error('DELETE /api/adt/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete admission', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}