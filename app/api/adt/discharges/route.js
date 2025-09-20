// app/api/adt/discharges/route.js
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
  const wardId = searchParams.get('wardId');
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');

  try {
    const discharges = await prisma.discharge.findMany({
      where: {
        ...(wardId && { admission: { wardId } }),
        ...(dateFrom && dateTo && {
          dischargeDate: { gte: new Date(dateFrom), lte: new Date(dateTo) },
        }),
      },
      include: {
        admission: {
          include: {
            patient: { select: { id: true, firstName: true, lastName: true } },
            ward: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { dischargeDate: 'desc' },
    });

    const transformedDischarges = discharges.map(discharge => ({
      ...discharge,
      patient: {
        ...discharge.admission.patient,
        name: `${discharge.admission.patient.firstName} ${discharge.admission.patient.lastName}`,
      },
      ward: discharge.admission.ward,
    }));

    return NextResponse.json(transformedDischarges);
  } catch (error) {
    console.error('Error fetching discharges:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    const { admissionId, dischargeDate, notes } = data;

    const discharge = await prisma.$transaction(async (tx) => {
      const admission = await tx.admission.findUnique({
        where: { id: admissionId },
        select: { bedId: true },
      });
      if (!admission) throw new Error('Admission not found');
      if (admission.bedId) {
        await tx.bed.update({ where: { id: admission.bedId }, data: { isOccupied: false } });
      }

      return await tx.discharge.create({
        data: {
          admissionId,
          dischargeDate: new Date(dischargeDate),
          notes,
        },
        include: {
          admission: {
            include: {
              patient: { select: { id: true, firstName: true, lastName: true } },
              ward: { select: { id: true, name: true } },
            },
          },
        },
      });
    });

    const transformedDischarge = {
      ...discharge,
      patient: {
        ...discharge.admission.patient,
        name: `${discharge.admission.patient.firstName} ${discharge.admission.patient.lastName}`,
      },
      ward: discharge.admission.ward,
    };

    return NextResponse.json(transformedDischarge);
  } catch (error) {
    console.error('Error creating discharge:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}