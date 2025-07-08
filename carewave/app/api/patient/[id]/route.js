import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid patient ID' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const includeParam = searchParams.get('include');
    const includeRelations = includeParam?.split(',') || [];
    
    const include = {
      admissions: includeRelations.includes('admissions'),
      discharges: includeRelations.includes('discharges'),
      transactions: includeRelations.includes('transactions'),
      appointments: includeRelations.includes('appointments'),
      prescriptions: includeRelations.includes('prescriptions'),
      medicalRecords: includeRelations.includes('medicalRecords'),
    };

    const patient = await prisma.patient.findUnique({
      where: { id },
      include,
    });

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error('GET /api/patient/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patient', details: error.message }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid patient ID' }, { status: 400 });
    }

    const data = await request.json();
    if (!data.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (data.email) {
      const existingPatient = await prisma.patient.findFirst({
        where: {
          email: data.email,
          NOT: { id }
        }
      });
      if (existingPatient) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
      }
    }

    if (data.patientId) {
      const existingPatient = await prisma.patient.findFirst({
        where: {
          patientId: data.patientId,
          NOT: { id }
        }
      });
      if (existingPatient) {
        return NextResponse.json({ error: 'Patient ID already exists' }, { status: 409 });
      }
    }

    const updatedPatient = await prisma.patient.update({
      where: { id },
      data: {
        patientId: data.patientId,
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
      }
    });

    return NextResponse.json(updatedPatient);
  } catch (error) {
    console.error('PUT /api/patient/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update patient', details: error.message }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid patient ID' }, { status: 400 });
    }

    await prisma.patient.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/patient/[id] error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }
    return NextResponse.json(
      { error: 'Failed to delete patient', details: error.message }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}