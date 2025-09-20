import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { parse } from 'json2csv';

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
  const status = searchParams.get('status');
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');
  const doctorId = searchParams.get('doctorId');
  const patientId = searchParams.get('patientId');

  try {
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
    });

    const csvData = appointments.map((appt) => ({
      id: appt.id,
      patient: appt.patient?.name || 'N/A',
      doctor: appt.doctor?.name || 'N/A',
      department: appt.doctor?.department?.name || 'N/A',
      visitType: appt.visitType?.name || 'N/A',
      appointmentDate: new Date(appt.appointmentDate).toLocaleString(),
      status: appt.appointmentStatus,
    }));

    const csv = parse(csvData, {
      fields: ['id', 'patient', 'doctor', 'department', 'visitType', 'appointmentDate', 'status'],
    });

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=appointments.csv',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}