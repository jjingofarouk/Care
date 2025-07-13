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
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    const medicalRecords = await prisma.medicalRecord.findMany({
      where: {
        recordDate: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
        }
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        allergies: true,
        diagnoses: true,
        vitalSigns: true,
        chiefComplaint: true,
        presentIllness: true,
        pastConditions: true,
        surgicalHistory: true,
        familyHistory: true,
        medicationHistory: true,
        socialHistory: true,
        reviewOfSystems: true,
        immunizations: true,
        travelHistory: true
      },
      orderBy: { recordDate: 'desc' },
      take: limit
    });

    const transformedRecords = medicalRecords.map(record => ({
      ...record,
      patient: record.patient ? {
        ...record.patient,
        name: `${record.patient.firstName} ${record.patient.lastName}`
      } : null
    }));

    return NextResponse.json(transformedRecords);
  } catch (error) {
    console.error('Error fetching recent medical records:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}