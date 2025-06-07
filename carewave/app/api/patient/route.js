import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeParam = searchParams.get('include');
    const includeRelations = includeParam?.split(',') || [];
    
    const validRelations = [
      'admissions', 'discharges', 'transactions', 
      'appointments', 'prescriptions', 'medicalRecords'
    ];
    
    const include = validRelations.reduce((acc, relation) => {
      if (includeRelations.includes(relation)) {
        return { ...acc, [relation]: true };
      }
      return acc;
    }, {});

    const patients = await prisma.patient.findMany({
      include,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(patients);
  } catch (error) {
    console.error('GET /api/patient error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patients', details: error.message }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    if (!data.name) {
      return NextResponse.json(
        { error: 'Name is required' }, 
        { status: 400 }
      );
    }

    if (data.email) {
      const existingPatient = await prisma.patient.findUnique({
        where: { email: data.email },
      });
      if (existingPatient) {
        return NextResponse.json(
          { error: 'Email already exists' }, 
          { status: 409 }
        );
      }
    }

    let patientId = data.patientId;
    if (!patientId) {
      let isUnique = false;
      while (!isUnique) {
        patientId = `P-${uuidv4().slice(0, 8)}`;
        const existing = await prisma.patient.findUnique({
          where: { patientId }
        });
        isUnique = !existing;
      }
    } else {
      const existing = await prisma.patient.findUnique({
        where: { patientId }
      });
      if (existing) {
        return NextResponse.json(
          { error: 'Patient ID already exists' }, 
          { status: 409 }
        );
      }
    }

    let dateOfBirth = null;
    if (data.dateOfBirth) {
      dateOfBirth = new Date(data.dateOfBirth);
      if (isNaN(dateOfBirth.getTime())) {
        return NextResponse.json(
          { error: 'Invalid date format for dateOfBirth' }, 
          { status: 400 }
        );
      }
    }

    const patient = await prisma.patient.create({
      data: {
        patientId,
        name: data.name,
        email: data.email || null,
        dateOfBirth,
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
    return NextResponse.json(
      { error: 'Failed to create patient', details: error.message }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}