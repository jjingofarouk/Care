import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  const search = searchParams.get('search') || '';

  try {
    const preOpAssessments = await prisma.preOpAssessment.findMany({
      where: {
        assessment: { contains: search, mode: 'insensitive' },
      },
      include: {
        patient: {
          select: { id: true, firstName: true, lastName: true },
        },
        surgeries: {
          select: { id: true, type: true },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.preOpAssessment.count({
      where: {
        assessment: { contains: search, mode: 'insensitive' },
      },
    });

    return NextResponse.json({ preOpAssessments, total });
  } catch (error) {
    console.error('Error fetching pre-op assessments:', error);
    return NextResponse.json({ error: 'Failed to fetch pre-op assessments' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.patientId || !data.assessment || !data.assessedAt) {
      return NextResponse.json(
        { error: 'Missing required fields: patientId, assessment, assessedAt' },
        { status: 400 }
      );
    }

    const preOpAssessment = await prisma.preOpAssessment.create({
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

    return NextResponse.json(preOpAssessment, { status: 201 });
  } catch (error) {
    console.error('Error creating pre-op assessment:', error);
    return NextResponse.json(
      { error: 'Failed to create pre-op assessment' },
      { status: 500 }
    );
  }
}
