// app/api/adt/transfers/route.js
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
    const transfers = await prisma.transfer.findMany({
      where: {
        ...(wardId && { OR: [{ fromWardId: wardId }, { toWardId: wardId }] }),
        ...(dateFrom && dateTo && {
          transferDate: { gte: new Date(dateFrom), lte: new Date(dateTo) },
        }),
      },
      include: {
        admission: {
          include: { patient: { select: { id: true, firstName: true, lastName: true } } },
        },
        fromWard: { select: { id: true, name: true } },
        toWard: { select: { id: true, name: true } },
      },
      orderBy: { transferDate: 'desc' },
    });

    const transformedTransfers = transfers.map(transfer => ({
      ...transfer,
      patient: {
        ...transfer.admission.patient,
        name: `${transfer.admission.patient.firstName} ${transfer.admission.patient.lastName}`,
      },
    }));

    return NextResponse.json(transformedTransfers);
  } catch (error) {
    console.error('Error fetching transfers:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    const { admissionId, toWardId, toBedId, transferDate } = data;

    const transfer = await prisma.$transaction(async (tx) => {
      const admission = await tx.admission.findUnique({
        where: { id: admissionId },
        select: { wardId: true, bedId: true },
      });
      if (!admission) throw new Error('Admission not found');

      if (toBedId) {
        const newBed = await tx.bed.findUnique({ where: { id: toBedId } });
        if (!newBed || newBed.isOccupied) throw new Error('New bed is occupied or does not exist');
        if (admission.bedId) {
          await tx.bed.update({ where: { id: admission.bedId }, data: { isOccupied: false } });
        }
        await tx.bed.update({ where: { id: toBedId }, data: { isOccupied: true } });
      }

      await tx.admission.update({
        where: { id: admissionId },
        data: { wardId: toWardId, bedId: toBedId },
      });

      return await tx.transfer.create({
        data: {
          admissionId,
          fromWardId: admission.wardId,
          toWardId,
          transferDate: new Date(transferDate),
        },
        include: {
          admission: {
            include: { patient: { select: { id: true, firstName: true, lastName: true } } },
          },
          fromWard: { select: { id: true, name: true } },
          toWard: { select: { id: true, name: true } },
        },
      });
    });

    const transformedTransfer = {
      ...transfer,
      patient: {
        ...transfer.admission.patient,
        name: `${transfer.admission.patient.firstName} ${transfer.admission.patient.lastName}`,
      },
    };

    return NextResponse.json(transformedTransfer);
  } catch (error) {
    console.error('Error creating transfer:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}