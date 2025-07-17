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
  const resource = searchParams.get('resource');

  try {
    if (resource === 'patients') {
      const patients = await prisma.patient.findMany({
        select: { 
          id: true, 
          firstName: true, 
          lastName: true 
        },
        orderBy: [
          { firstName: 'asc' },
          { lastName: 'asc' }
        ]
      });
      const transformedPatients = patients.map(patient => ({
        id: patient.id,
        name: `${patient.firstName} ${patient.lastName}`,
        firstName: patient.firstName,
        lastName: patient.lastName
      }));
      return NextResponse.json(transformedPatients);
    }

    if (resource === 'labTests') {
      const labTests = await prisma.labTest.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' }
      });
      return NextResponse.json(labTests);
    }

    if (resource === 'samples') {
      const samples = await prisma.sample.findMany({
        select: { id: true, sampleType: true },
        orderBy: { sampleType: 'asc' }
      });
      return NextResponse.json(samples);
    }

    const requests = await prisma.labRequest.findMany({
      include: {
        patient: { select: { id: true, firstName: true, lastName: true } },
        labTest: { select: { id: true, name: true } },
        sample: { select: { id: true, sampleType: true } },
      },
    });

    const transformedRequests = requests.map(request => ({
      ...request,
      patient: request.patient ? {
        ...request.patient,
        name: `${request.patient.firstName} ${request.patient.lastName}`
      } : null,
      labTest: request.labTest ? {
        ...request.labTest,
        name: request.labTest.name
      } : null,
      sample: request.sample ? {
        ...request.sample,
        sampleType: request.sample.sampleType
      } : null
    }));

    return NextResponse.json(transformedRequests);
  } catch (error) {
    console.error('Error fetching lab requests:', error);
    return NextResponse.json({ error: 'Failed to fetch lab requests' }, { status: 500 });
  }
}

export async function POST(request) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    
    if (data.resource === 'labRequest') {
      const labRequest = await prisma.labRequest.create({
        data: {
          patientId: data.patientId,
          labTestId: data.labTestId,
          sampleId: data.sampleId || null,
          requestedAt: new Date(data.requestedAt),
        },
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
    }

    return NextResponse.json({ error: 'Invalid resource' }, { status: 400 });
  } catch (error) {
    console.error('Error creating lab request:', error);
    return NextResponse.json({ error: 'Failed to create lab request' }, { status: 500 });
  }
}