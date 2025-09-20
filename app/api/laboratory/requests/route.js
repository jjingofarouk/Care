import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const requests = await prisma.labRequest.findMany({
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
        labTest: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        sample: {
          select: {
            id: true,
            sampleType: true,
            collectedAt: true,
          },
        },
        labResults: {
          select: {
            id: true,
            result: true,
            resultedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching lab requests:', error);
    return NextResponse.json({ error: 'Failed to fetch lab requests' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.patientId || !data.labTestId || !data.requestedAt) {
      return NextResponse.json(
        { error: 'Missing required fields: patientId, labTestId, requestedAt' },
        { status: 400 }
      );
    }

    // Verify patient exists
    const patientExists = await prisma.patient.findUnique({
      where: { id: data.patientId },
    });

    if (!patientExists) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    // Verify lab test exists
    const labTestExists = await prisma.labTest.findUnique({
      where: { id: data.labTestId },
    });

    if (!labTestExists) {
      return NextResponse.json(
        { error: 'Lab test not found' },
        { status: 404 }
      );
    }

    // Verify sample exists if provided
    if (data.sampleId) {
      const sampleExists = await prisma.sample.findUnique({
        where: { id: data.sampleId },
      });

      if (!sampleExists) {
        return NextResponse.json(
          { error: 'Sample not found' },
          { status: 404 }
        );
      }

      // Verify sample belongs to the patient
      if (sampleExists.patientId !== data.patientId) {
        return NextResponse.json(
          { error: 'Sample does not belong to the specified patient' },
          { status: 400 }
        );
      }
    }

    // Create the lab request - Note: IDs are strings, not integers
    const requestData = {
      patientId: data.patientId,
      labTestId: data.labTestId,
      sampleId: data.sampleId || null,
      requestedAt: new Date(data.requestedAt),
    };

    const labRequest = await prisma.labRequest.create({
      data: requestData,
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
        labTest: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        sample: {
          select: {
            id: true,
            sampleType: true,
            collectedAt: true,
          },
        },
      },
    });

    return NextResponse.json(labRequest, { status: 201 });
  } catch (error) {
    console.error('Error creating lab request:', error);
    return NextResponse.json(
      { error: 'Failed to create lab request: ' + error.message },
      { status: 500 }
    );
  }
}