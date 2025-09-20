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

export async function POST(request) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { appointments } = await request.json();
    const createdAppointments = await prisma.$transaction(
      appointments.map((appt) =>
        prisma.appointment.create({
          data: {
            patientId: appt.patientId,
            doctorId: appt.doctorId,
            visitTypeId: appt.visitTypeId,
            appointmentDate: new Date(appt.appointmentDate),
            appointmentStatus: appt.status || 'PENDING',
            appointmentStatusRecords: {
              create: {
                status: appt.status || 'PENDING',
                changedAt: new Date(appt.appointmentDate),
              },
            },
          },
          include: {
            patient: { select: { name: true } },
            doctor: { select: { name: true, department: { select: { name: true } } } },
            visitType: { select: { name: true } },
          },
        })
      )
    );
    return NextResponse.json(createdAppointments);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}