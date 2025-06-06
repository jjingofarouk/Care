import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeRelations = searchParams.get('include')?.split(',') || [];

    const include = {
      user: includeRelations.includes('user'),
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

    const patient = await prisma.$transaction(async (prisma) => {
      let user = null;
      if (data.email && data.password) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        user = await prisma.user.create({
          data: {
            email: data.email,
            name: data.name,
            role: 'PATIENT',
            password: hashedPassword,
          },
        });
      }

      return await prisma.patient.create({
        data: {
          patientId: data.patientId || `P-${uuidv4().slice(0, 8)}`,
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
          user: user ? { connect: { id: user.id } } : undefined,
        },
        include: { user: true },
      });
    });

    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    console.error('POST /api/patient error:', error);
    return NextResponse.json({ error: 'Failed to create patient', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));
    if (!id) {
      return NextResponse.json({ error: 'Missing patient ID' }, { status: 400 });
    }

    const data = await request.json();
    if (!data.name) {
      return NextResponse.json({ error: 'Missing required field: name' }, { status: 400 });
    }

    const patient = await prisma.$transaction(async (prisma) => {
      let user = null;
      if (data.email && data.password) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        user = await prisma.user.upsert({
          where: { id: data.userId || 0 },
          update: {
            email: data.email,
            name: data.name,
            role: 'PATIENT',
            password: hashedPassword,
          },
          create: {
            email: data.email,
            name: data.name,
            role: 'PATIENT',
            password: hashedPassword,
          },
        });
      }

      return await prisma.patient.update({
        where: { id },
        data: {
          patientId: data.patientId || undefined,
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
          user: user ? { connect: { id: user.id } } : data.userId ? { connect: { id: data.userId } } : { disconnect: true },
        },
        include: { user: true },
      });
    });

    return NextResponse.json(patient);
  } catch (error) {
    console.error('PUT /api/patient error:', error);
    return NextResponse.json({ error: 'Failed to update patient', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));
    if (!id) {
      return NextResponse.json({ error: 'Missing patient ID' }, { status: 400 });
    }

    await prisma.patient.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/patient error:', error);
    return NextResponse.json({ error: 'Failed to delete patient', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}