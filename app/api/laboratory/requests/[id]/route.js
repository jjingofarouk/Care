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

export async function GET(request, { params }) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const labRequest = await prisma.labRequest.findUnique({
      where: { id: params.id },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true } },
        labTest: { select: { id: true, name: true } },
        sample: { select: { id: true, sampleType: true } },
      },
    });
    if (!labRequest) return NextResponse.json({ error: 'Lab request not found' }, { status: 404 });

    const transformedRequest = {
      ...labRequest,
      patient: labRequest.patient ? {
        ...labRequest.patient,
        name: `${labRequest.patient.firstName} ${labRequest.patient.lastName}`
      } : null,
      labTest: labRequest.labTest ? {
        ...labRequest.labTest,
        name: labRequest.labTest.name
      } : null,
      sample: labRequest.sample ? {
        ...labRequest.sample,
        sampleType: labRequest.sample.sampleType
      } : null
    };

    return NextResponse.json(transformedRequest);
  } catch (error) {
    console.error('Error fetching lab request:', error);
    return NextResponse.json({ error: 'Failed to fetch lab request' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    const requestData = {
      patientId: data.patientId,
      labTestId: data.labTestId,
      sampleId: data.sampleId || null,
      requestedAt: new Date(data.requestedAt),
    };
    const labRequest = await prisma.labRequest.update({
      where: { id: params.id },
      data: requestData,
      include: {
        patient: { select: { id: true, firstName: true, lastName: true } },
        labTest: { select: { id: true, name: true } },
        sample: { select: { id: true, sampleType: true } },
      },
    });

    const transformedRequest = {
      ...labRequest,
      patient: labRequest.patient ? {
        ...labRequest.patient,
        name: `${labRequest.patient.firstName} ${labRequest.patient.lastName}`
      } : null,
      labTest: labRequest.labTest ? {
        ...labRequest.labTest,
        name: labRequest.labTest.name
      } : null,
      sample: labRequest.sample ? {
        ...labRequest.sample,
        sampleType: labRequest.sample.sampleType
      } : null
    };

    return NextResponse.json(transformedRequest);
  } catch (error) {
    console.error('Error updating lab request:', error);
    return NextResponse.json({ error: 'Failed to update lab request' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await prisma.labRequest.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: 'Lab request deleted' });
  } catch (error) {
    console.error('Error deleting lab request:', error);
    return NextResponse.json({ error: 'Failed to delete lab request' }, { status: 500 });
  }
}