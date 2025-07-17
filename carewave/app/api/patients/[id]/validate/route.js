// app/api/patients/[id]/validate/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const patient = await prisma.patient.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        gender: true,
        phone: true,
        email: true,
      },
    });

    return NextResponse.json({
      exists: !!patient,
      patient: patient || null,
    });
  } catch (error) {
    console.error('Error validating patient:', error);
    return NextResponse.json(
      { error: 'Failed to validate patient' },
      { status: 500 }
    );
  }
}