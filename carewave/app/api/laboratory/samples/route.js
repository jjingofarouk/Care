import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const samples = await prisma.sample.findMany({
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            gender: true,
            phone: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(samples);
  } catch (error) {
    console.error('Error fetching samples:', error);
    return NextResponse.json({ error: 'Failed to fetch samples' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.patientId || !data.sampleType || !data.collectedAt) {
      return NextResponse.json({ 
        error: 'Missing required fields: patientId, sampleType, collectedAt' 
      }, { status: 400 });
    }

    // Verify patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: data.patientId },
    });

    if (!patient) {
      return NextResponse.json({ 
        error: 'Patient not found' 
      }, { status: 404 });
    }

    // Create the sample
    const sample = await prisma.sample.create({
      data: {
        patientId: data.patientId, // Keep as string (UUID)
        sampleType: data.sampleType,
        collectedAt: new Date(data.collectedAt),
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            gender: true,
            phone: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(sample, { status: 201 });
  } catch (error) {
    console.error('Error creating sample:', error);
    return NextResponse.json({ 
      error: 'Failed to create sample' 
    }, { status: 500 });
  }
}