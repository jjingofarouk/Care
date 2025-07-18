import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const preOpAssessment = await prisma.preOpAssessment.findUnique({
      where: { id: params.id },
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true },
        },
        surgeries: {
          select: { id: true, type: true },
        },
      },
    });

    if (!preOpAssessment) {
      return NextResponse.json({ error: 'Pre-op assessment not found' }, { status: 404 });
    }

    return NextResponse.json(preOpAssessment);
  } catch (error) {
    console.error('Error fetching pre-op assessment:', error);
    return NextResponse.json({ error: 'Failed to fetch pre-op assessment' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();

    if (!data.assessment || !data.assessedAt) {
      return NextResponse.json(
        { error: 'Missing required fields: assessment, assessedAt' },
        { status: 400 }
      );
    }

    const preOpAssessment = await prisma.preOpAssessment.update({
      where: { id: params.id },
      data: {
        patientId: data.patientId,
        assessment: data.assessment,
        assessedAt: new Date(data.assessedAt),
      },
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    return NextResponse.json(preOpAssessment);
  } catch (error) {
    console.error('Error updating pre-op assessment:', error);
    return NextResponse.json({ error: 'Failed to update pre-op assessment' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.preOpAssessment.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Pre-op assessment deleted successfully' });
  } catch (error) {
    console.error('Error deleting pre-op assessment:', error);
    return NextResponse.json({ error: 'Failed to delete pre-op assessment' }, { status: 500 });
  }
}
