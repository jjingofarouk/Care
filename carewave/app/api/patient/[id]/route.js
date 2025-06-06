import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid patient ID' }, { status: 400 });
    }

    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        user: true,
        admissions: true,
        discharges: true,
        transactions: true,
        appointments: true,
        prescriptions: true,
        medicalRecords: true,
      },
    });

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error('GET /api/patient/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch patient', details: error.message }, { status: 500 });
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
    if (!) {
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
      } else if (data.email) {
        user = await prisma.user.upsert({
          where: { id: data.userId || 0 },
          update: {
            email: data.email,
            name: data.name,
            role: 'PATIENT',
          },
          create: {
            email: data.email,
            name: data.name,
            role: 'PATIENT',
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
    console.error('PUT /api/patient/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update patient', details: error.message }, { status: 500 });
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
      where: { id },
    });

    return NextResponse.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/patient/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete patient', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}