import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const request = await prisma.labRequest.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        patient: true,
        labTest: true,
        sample: true,
      },
    });
    if (!request) return NextResponse.json({ error: 'Lab request not found' }, { status: 404 });
    return NextResponse.json(request);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch lab request' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const requestData = {
      sampleId: data.sampleId ? parseInt(data.sampleId) : null,
      requestedAt: new Date(data.requestedAt),
    };
    const labRequest = await prisma.labRequest.update({
      where: { id: parseInt(params.id) },
      data: requestData,
    });
    return NextResponse.json(labRequest);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update lab request' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.labRequest.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Lab request deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete lab request' }, { status: 500 });
  }
}
