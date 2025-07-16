import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const labRequest = await prisma.labRequest.findUnique({
      where: { id: params.id }, // Treat as string, remove parseInt
      include: {
        patient: true,
        labTest: true,
        sample: true,
      },
    });
    if (!labRequest) return NextResponse.json({ error: 'Lab request not found' }, { status: 404 });
    return NextResponse.json(labRequest);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch lab request' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const requestData = {
      sampleId: data.sampleId || null, // Treat as string, remove parseInt
      requestedAt: new Date(data.requestedAt),
    };
    const labRequest = await prisma.labRequest.update({
      where: { id: params.id }, // Treat as string, remove parseInt
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
      where: { id: params.id }, // Treat as string, remove parseInt
    });
    return NextResponse.json({ message: 'Lab request deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete lab request' }, { status: 500 });
  }
}