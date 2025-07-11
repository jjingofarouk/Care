import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const authenticate = (request) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

export async function GET(request) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const status = searchParams.get('status');
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');
  const doctorId = searchParams.get('doctorId');
  const patientId = searchParams.get('patientId');
  const resource = searchParams.get('resource');

  try {
    if (resource === 'patients') {
      const patients = await prisma.patient.findMany({
        select: { id: true, name: true },
      });
      return NextResponse.json(patients);
    }
    if (resource === 'doctors') {
      const doctors = await prisma.doctor.findMany({
        select: { id: true, name: true, departmentId: true },
        include: { department: { select: { name: true } } },
      });
      return NextResponse.json(doctors);
    }
    if (resource === 'visitTypes') {
      const visitTypes = await prisma.visitType.findMany({
        select: { id: true, name: true, description: true },
      });
      return NextResponse.json(visitTypes);
    }
    if (resource === 'statusHistory') {
      const appointmentId = searchParams.get('appointmentId');
      if (!appointmentId) {
        return NextResponse.json({ error: 'Appointment ID required' }, { status: 400 });
      }
      const history = await prisma.appointmentStatus.findMany({
        where: { appointmentId },
        orderBy: { changedAt: 'desc' },
      });
      return NextResponse.json(history);
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        ...(status && { appointmentStatus: status }),
        ...(doctorId && { doctorId }),
        ...(patientId && { patientId }),
        ...(dateFrom && dateTo && {
          appointmentDate: {
            gte: new Date(dateFrom),
            lte: new Date(dateTo),
          },
        }),
      },
      include: {
        patient: { select: { name: true } },
        doctor: { select: { name: true, department: { select: { name: true } } } },
        visitType: { select: { name: true } },
      },
      orderBy: { appointmentDate: 'asc' },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    if (data.resource === 'appointment') {
      const appointment = await prisma.appointment.create({
        data: {
          patientId: data.patientId,
          doctorId: data.doctorId,
          visitTypeId: data.visitTypeId,
          appointmentDate: new Date(data.appointmentDate),
          appointmentStatus: data.status || 'PENDING',
          appointmentStatusRecords: {
            create: {
              status: data.status || 'PENDING',
              changedAt: new Date(data.appointmentDate),
            },
          },
        },
        include: {
          patient: { select: { name: true } },
          doctor: { select: { name: true, department: { select: { name: true } } } },
          visitType: { select: { name: true } },
        },
      });
      return NextResponse.json(appointment);
    }
    if (data.resource === 'visitType') {
      const visitType = await prisma.visitType.create({
        data: {
          name: data.name,
          description: data.description,
        },
      });
      return NextResponse.json(visitType);
    }
    return NextResponse.json({ error: 'Invalid resource' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    const appointment = await prisma.appointment.update({
      where: { id: data.id },
      data: {
        patientId: data.patientId,
        doctorId: data.doctorId,
        visitTypeId: data.visitTypeId,
        appointmentDate: new Date(data.appointmentDate),
        appointmentStatus: data.status,
        appointmentStatusRecords: {
          create: {
            status: data.status,
            changedAt: new Date(),
          },
        },
      },
      include: {
        patient: { select: { name: true } },
        doctor: { select: { name: true, department: { select: { name: true } } } },
        visitType: { select: { name: true } },
      },
    });
    return NextResponse.json(appointment);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Appointment ID required' }, { status: 400 });
    }
    await prisma.appointment.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Appointment deleted' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}