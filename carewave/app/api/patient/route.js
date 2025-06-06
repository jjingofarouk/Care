import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeRelations = searchParams.get('include')?.split(',') || [];
    const include = {
      admissions: includeRelations.includes('admissions'),
      discharges: includeRelations.includes('discharges'),
      transactions: includeRelations.includes('transactions'),
      appointments: includeRelations.includes('appointments'),
      prescriptions: includeRelations.includes('prescriptions'),
      medicalRecords: includeRelations.includes('medicalRecords'),
    };

    const patients = await prisma.patient.findMany({
      include,
    });

    return NextResponse.json(patients);
  } catch (error) {
    console.error('GET /api/patient error:', error);
    return NextResponse.json({ error: 'Failed to fetch patients', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    if (!data.name) {
      return NextResponse.json({ error: 'Missing required field: name' }, { status: 400 });
    }

    const existingPatient = await prisma.patient.findUnique({
      where: { email: data.email },
    });
    if (existingPatient && data.email) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const patient = await prisma.patient.create({
      data: {
        patientId: data.patientId || `P-${uuidv4().slice(0, 8)}`,
        name: data.name,
        email: data.email || null,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        gender: data.gender || null,
        phone: data.phone || null,
        address: data.address || null,
        emergencyContact: data.emergencyContact || null,
        emergencyContactPhone: data.emergencyContactPhone || null,
        insuranceProvider: data.insuranceProvider || null,
        insurancePolicy: data.insurancePolicy || null,
        bloodType: data.bloodType || null,
        allergies: data.allergies || null,
        medicalHistory: data.medicalHistory || null,
        presentingComplaint: data.presentingComplaint || null,
        familyHistory: data.familyHistory || null,
        socialHistory: data.socialHistory || null,
        pastMedicalHistory: data.pastMedicalHistory || null,
        medications: data.medications || null,
      },
    });

    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    console.error('POST /api/patient error:', error);
    return NextResponse.json({ error: 'Failed to create patient', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}