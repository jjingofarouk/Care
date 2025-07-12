// app/api/patients/[id]/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    console.log('GET /api/patients/[id] params:', params);
    const id = params?.id;
    if (!id) {
      return NextResponse.json({ error: 'Missing patient ID' }, { status: 400 });
    }

    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        addresses: true,
        nextOfKin: true,
        insuranceInfo: true,
      },
    });

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error('GET /api/patients/[id] error:', error);
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
    console.log('PUT /api/patients/[id] params:', params);
    const id = params?.id;
    if (!id) {
      return NextResponse.json({ error: 'Missing patient ID' }, { status: 400 });
    }

    const data = await request.json();
    if (!data.firstName || !data.lastName || !data.dateOfBirth) {
      return NextResponse.json(
        { error: 'First name, last name, and date of birth are required' },
        { status: 400 }
      );
    }

    const dateOfBirth = new Date(data.dateOfBirth);
    if (isNaN(dateOfBirth.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format for dateOfBirth' },
        { status: 400 }
      );
    }

    let userId = null;
    if (data.email) {
      const existingUser = await prisma.userRegistration.findUnique({
        where: { email: data.email },
      });
      if (existingUser && existingUser.id !== id) {
        return NextResponse.json(
          { error: 'Email already exists for another user' },
          { status: 409 }
        );
      }
      if (existingUser) {
        userId = existingUser.id;
      } else if (data.createUser && data.password) {
        const passwordHash = await bcrypt.hash(data.password, 10);
        const newUser = await prisma.userRegistration.create({
          data: {
            id: `U-${uuidv4().slice(0, 8)}`,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            role: 'PATIENT',
            passwordHash,
          },
        });
        userId = newUser.id;
      }
    }

    const patient = await prisma.patient.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth,
        gender: data.gender || null,
        phone: data.phone || null,
        email: data.email || null,
        userId,
        addresses: {
          deleteMany: {},
          create: data.addresses?.length
            ? data.addresses.map((addr) => ({
                street: addr.street || '',
                city: addr.city || '',
                country: addr.country || '',
                postalCode: addr.postalCode || null,
              }))
            : [],
        },
        nextOfKin: data.nextOfKin?.firstName || data.nextOfKin?.lastName
          ? {
              deleteMany: {},
              create: {
                firstName: data.nextOfKin.firstName || '',
                lastName: data.nextOfKin.lastName || '',
                relationship: data.nextOfKin.relationship || '',
                phone: data.nextOfKin.phone || null,
                email: data.nextOfKin.email || null,
              },
            }
          : undefined,
        insuranceInfo: data.insuranceInfo?.provider || data.insuranceInfo?.policyNumber
          ? {
              deleteMany: {},
              create: {
                provider: data.insuranceInfo.provider || '',
                policyNumber: data.insuranceInfo.policyNumber || '',
                expiryDate: data.insuranceInfo.expiryDate
                  ? new Date(data.insuranceInfo.expiryDate)
                  : null,
              },
            }
          : undefined,
      },
      include: {
        addresses: true,
        nextOfKin: true,
        insuranceInfo: true,
      },
    });

    return NextResponse.json(patient);
  } catch (error) {
    console.error('PUT /api/patients/[id] error:', error);
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
    console.log('DELETE /api/patients/[id] params:', params);
    const id = params?.id;
    if (!id) {
      return NextResponse.json({ error: 'Missing patient ID' }, { status: 400 });
    }

    await prisma.patient.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/patients/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete patient', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}