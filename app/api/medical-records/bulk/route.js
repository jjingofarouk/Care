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
    const records = await request.json();
    if (!Array.isArray(records) || records.length === 0) {
      return NextResponse.json({ error: 'Records array is required' }, { status: 400 });
    }

    const createdRecords = await prisma.$transaction(
      records.map(record =>
        prisma.medicalRecord.create({
          data: {
            patientId: record.patientId,
            recordDate: new Date(record.recordDate),
            createdAt: new Date(),
            updatedAt: new Date()
          },
          include: {
            patient: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        })
      )
    );

    const transformedRecords = createdRecords.map(record => ({
      ...record,
      patient: record.patient ? {
        ...record.patient,
        name: `${record.patient.firstName} ${record.patient.lastName}`
      } : null
    }));

    return NextResponse.json({
      successful: createdRecords.length,
      failed: 0,
      total: records.length,
      results: transformedRecords
    });
  } catch (error) {
    console.error('Error in bulk create medical records:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { ids } = await request.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Medical record IDs array is required' }, { status: 400 });
    }

    const results = await prisma.$transaction(
      ids.map(id => prisma.medicalRecord.delete({ where: { id } }))
    );

    return NextResponse.json({
      successful: results.length,
      failed: 0,
      total: ids.length,
      results
    });
  } catch (error) {
    console.error('Error in bulk delete medical records:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}