import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const result = await prisma.labResult.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        labRequest: {
          include: {
            patient: true,
            labTest: true,
          },
        },
      },
    });
    if (!result) return NextResponse.json({ error: 'Lab result not found' }, { status: 404 });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch lab result' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const result = await prisma.labResult.update({
      where: { id: parseInt(params.id) },
      data: {
        result: data.result,
        resultedAt: new Date(data.resultedAt),
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update lab result' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.labResult.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Lab result deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete lab result' }, { status: 500 });
  }
}
