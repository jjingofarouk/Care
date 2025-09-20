// app/api/laboratory/samples/patient/[id]/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const samples = await prisma.sample.findMany({
      where: { patientId: id },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        collectedAt: 'desc',
      },
    });

    return NextResponse.json(samples);
  } catch (error) {
    console.error('Error fetching patient samples:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patient samples' },
      { status: 500 }
    );
  }
}