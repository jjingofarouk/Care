
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const resource = searchParams.get('resource');
  const search = searchParams.get('search');
  const id = searchParams.get('id');
  const limit = 10;

  try {
    if (resource === 'patients') {
      const whereClause = search ? {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { 
            AND: [
              { firstName: { contains: search.split(' ')[0], mode: 'insensitive' } },
              { lastName: { contains: search.split(' ')[1] || '', mode: 'insensitive' } }
            ]
          }
        ]
      } : {};

      const patients = await prisma.patient.findMany({
        where: whereClause,
        select: { id: true, firstName: true, lastName: true },
        orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
        take: limit
      });

      return NextResponse.json(patients.map(p => ({
        id: p.id,
        name: `${p.firstName} ${p.lastName}`,
        firstName: p.firstName,
        lastName: p.lastName
      })));
    }

    if (resource === 'labTests') {
      const whereClause = search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      } : {};

      const labTests = await prisma.labTest.findMany({
        where: whereClause,
        select: { id: true, name: true, description: true },
        orderBy: { name: 'asc' },
        take: limit
      });

      return NextResponse.json(labTests);
    }

    if (resource === 'samples') {
      const whereClause = search ? {
        OR: [
          { sampleType: { contains: search, mode: 'insensitive' } },
          { patient: { 
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } }
            ]
          }}
        ]
      } : {};

      const samples = await prisma.sample.findMany({
        where: whereClause,
        select: { 
          id: true, 
          sampleType: true,
          collectedAt: true,
          patient: { select: { firstName: true, lastName: true } }
        },
        orderBy: { sampleType: 'asc' },
        take: limit
      });

      return NextResponse.json(samples.map(s => ({
        id: s.id,
        sampleType: `${s.sampleType} - ${s.patient.firstName} ${s.patient.lastName}`,
        originalSampleType: s.sampleType,
        collectedAt: s.collectedAt,
        patientName: `${s.patient.firstName} ${s.patient.lastName}`
      })));
    }

    if (resource === 'labRequest' && id) {
      const request = await prisma.labRequest.findUnique({
        where: { id },
        include: {
          patient: { select: { id: true, firstName: true, lastName: true } },
          labTest: { select: { id: true, name: true } },
          sample: { select: { id: true, sampleType: true } },
          labResults: { select: { id: true, result: true, resultedAt: true } }
        }
      });

      if (!request) {
        return NextResponse.json({ error: 'Lab request not found' }, { status: 404 });
      }

      return NextResponse.json({
        id: request.id,
        patient: { id: request.patient.id, name: `${request.patient.firstName} ${request.patient.lastName}` },
        labTest: { id: request.labTest.id, name: request.labTest.name },
        sample: request.sample ? { id: request.sample.id, sampleType: request.sample.sampleType } : null,
        requestedAt: request.requestedAt,
        labResults: request.labResults
      });
    }

    const requests = await prisma.labRequest.findMany({
      include: {
        patient: { select: { id: true, firstName: true, lastName: true } },
        labTest: { select: { id: true, name: true } },
        sample: { select: { id: true, sampleType: true } },
        labResults: { select: { id: true, result: true, resultedAt: true } }
      },
      orderBy: { requestedAt: 'desc' }
    });

    return NextResponse.json(requests.map(r => ({
      id: r.id,
      patient: { id: r.patient.id, name: `${r.patient.firstName} ${r.patient.lastName}` },
      labTest: { id: r.labTest.id, name: r.labTest.name },
      sample: r.sample ? { id: r.sample.id, sampleType: r.sample.sampleType } : null,
      requestedAt: r.requestedAt,
      labResults: r.labResults
    })));
  } catch (error) {
    console.error('Error fetching lab requests:', error);
    return NextResponse.json({ error: 'Failed to fetch lab requests' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    if (data.resource !== 'labRequest') {
      return NextResponse.json({ error: 'Invalid resource' }, { status: 400 });
    }

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
        sample: { select: { id: true, sampleType: true } }
      }
    });

    return NextResponse.json({
      id: labRequest.id,
      patient: { id: labRequest.patient.id, name: `${labRequest.patient.firstName} ${labRequest.patient.lastName}` },
      labTest: { id: labRequest.labTest.id, name: labRequest.labTest.name },
      sample: labRequest.sample ? { id: labRequest.sample.id, sampleType: labRequest.sample.sampleType } : null,
      requestedAt: labRequest.requestedAt
    });
  } catch (error) {
    console.error('Error creating lab request:', error);
    return NextResponse.json({ error: 'Failed to create lab request' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing request ID' }, { status: 400 });
    }

    const data = await request.json();
    
    const labRequest = await prisma.labRequest.update({
      where: { id },
      data: {
        patientId: data.patientId,
        labTestId: data.labTestId,
        sampleId: data.sampleId || null,
        requestedAt: new Date(data.requestedAt),
      },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true } },
        labTest: { select: { id: true, name: true } },
        sample: { select: { id: true, sampleType: true } }
      }
    });

    return NextResponse.json({
      id: labRequest.id,
      patient: { id: labRequest.patient.id, name: `${labRequest.patient.firstName} ${labRequest.patient.lastName}` },
      labTest: { id: labRequest.labTest.id, name: labRequest.labTest.name },
      sample: labRequest.sample ? { id: labRequest.sample.id, sampleType: labRequest.sample.sampleType } : null,
      requestedAt: labRequest.requestedAt
    });
  } catch (error) {
    console.error('Error updating lab request:', error);
    return NextResponse.json({ error: 'Failed to update lab request' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing request ID' }, { status: 400 });
    }

    await prisma.labRequest.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Lab request deleted' });
  } catch (error) {
    console.error('Error deleting lab request:', error);
    return NextResponse.json({ error: 'Failed to delete lab request' }, { status: 500 });
  }
}
