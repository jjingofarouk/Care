// app/api/adt/admissions/route.js
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
  const patientId = searchParams.get('patientId');
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');

  try {
    const admissions = await prisma.admission.findMany({
      where: {
        ...(wardId && { wardId }),
        ...(patientId && { patientId }),
        ...(dateFrom && dateTo && {
          admissionDate: { gte: new Date(dateFrom), lte: new Date(dateTo) },
        }),
      },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true } },
        ward: { select: { id: true, name: true } },
        bed: { select: { id: true, bedNumber: true } },
        emergencyCases: { select: { id: true, triage: { select: { triageLevel: true } } } },
        medicalRecords: { select: { id: true, recordDate: true, diagnoses: true } },
      },
      orderBy: { admissionDate: 'desc' },
    });

    const transformedAdmissions = admissions.map(admission => ({
      ...admission,
      patient: { ...admission.patient, name: `${admission.patient.firstName} ${admission.patient.lastName}` },
    }));

    return NextResponse.json(transformedAdmissions);
  } catch (error) {
    console.error('Error fetching admissions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    const { patientId, wardId, bedId, admissionDate } = data;

    const admission = await prisma.$transaction(async (tx) => {
      // Verify bed availability
      if (bedId) {
        const bed = await tx.bed.findUnique({ where: { id: bedId } });
        if (!bed || bed.isOccupied) throw new Error('Bed is occupied or does not exist');
        await tx.bed.update({ where: { id: bedId }, data: { isOccupied: true } });
      }

      return await tx.admission.create({
        data: {
          patientId,
          wardId,
          bedId,
          admissionDate: new Date(admissionDate),
        },
        include: {
          patient: { select: { id: true, firstName: true, lastName: true } },
          ward: { select: { id: true, name: true } },
          bed: { select: { id: true, bedNumber: true } },
        },
      });
    });

    const transformedAdmission = {
      ...admission,
      patient: { ...admission.patient, name: `${admission.patient.firstName} ${admission.patient.lastName}` },
    };

    return NextResponse.json(transformedAdmission);
  } catch (error) {
    console.error('Error creating admission:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const data = await request.json();
    const { wardId, bedId, admissionDate } = data;

    const admission = await prisma.$transaction(async (tx) => {
      if (bedId) {
        const existingAdmission = await tx.admission.findUnique({ where: { id }, select: { bedId: true } });
        if (existingAdmission.bedId && existingAdmission.bedId !== bedId) {
          await tx.bed.update({ where: { id: existingAdmission.bedId }, data: { isOccupied: false } });
        }
        const newBed = await tx.bed.findUnique({ where: { id: bedId } });
        if (!newBed || newBed.isOccupied) throw new Error('New bed is occupied or does not exist');
        await tx.bed.update({ where: { id: bedId }, data: { isOccupied: true } });
      }

      return await tx.admission.update({
        where: { id },
        data: {
          ...(wardId && { wardId }),
          ...(bedId && { bedId }),
          ...(admissionDate && { admissionDate: new Date(admissionDate) }),
        },
        include: {
          patient: { select: { id: true, firstName: true, lastName: true } },
          ward: { select: { id: true, name: true } },
          bed: { select: { id: true, bedNumber: true } },
        },
      });
    });

    const transformedAdmission = {
      ...admission,
      patient: { ...admission.patient, name: `${admission.patient.firstName} ${admission.patient.lastName}` },
    };

    return NextResponse.json(transformedAdmission);
  } catch (error) {
    console.error('Error updating admission:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}