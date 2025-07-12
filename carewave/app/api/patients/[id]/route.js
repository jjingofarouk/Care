// app/api/patients/[id]/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const id = params?.id;
    if (!id) {
      return NextResponse.json({ error: 'Missing patient ID' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const include = searchParams.get('include');

    // Build include object based on query parameter
    const includeObj = {};
    if (include) {
      const includeFields = include.split(',');
      includeFields.forEach(field => {
        switch (field.trim()) {
          case 'addresses':
            includeObj.addresses = true;
            break;
          case 'nextOfKin':
            includeObj.nextOfKin = true;
            break;
          case 'insuranceInfo':
            includeObj.insuranceInfo = true;
            break;
        }
      });
    }

    const patient = await prisma.patient.findUnique({
      where: { id },
      include: includeObj,
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
    if (data.email && data.createUser && data.password) {
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
      } else {
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

    // Update patient with related data
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
        // Update addresses
        ...(data.addresses && {
          addresses: {
            deleteMany: {}, // Delete existing addresses
            create: data.addresses
              .filter(addr => addr.street || addr.city || addr.country || addr.postalCode)
              .map(address => ({
                street: address.street || '',
                city: address.city || '',
                country: address.country || '',
                postalCode: address.postalCode || null,
              }))
          }
        }),
        // Update next of kin
        ...(data.nextOfKin && (data.nextOfKin.firstName || data.nextOfKin.lastName) ? {
          nextOfKin: {
            upsert: {
              create: {
                firstName: data.nextOfKin.firstName || '',
                lastName: data.nextOfKin.lastName || '',
                relationship: data.nextOfKin.relationship || '',
                phone: data.nextOfKin.phone || null,
                email: data.nextOfKin.email || null,
              },
              update: {
                firstName: data.nextOfKin.firstName || '',
                lastName: data.nextOfKin.lastName || '',
                relationship: data.nextOfKin.relationship || '',
                phone: data.nextOfKin.phone || null,
                email: data.nextOfKin.email || null,
              }
            }
          }
        } : {
          nextOfKin: {
            delete: true
          }
        }),
        // Update insurance info
        ...(data.insuranceInfo && (data.insuranceInfo.provider || data.insuranceInfo.policyNumber) ? {
          insuranceInfo: {
            upsert: {
              create: {
                provider: data.insuranceInfo.provider || '',
                policyNumber: data.insuranceInfo.policyNumber || '',
                expiryDate: data.insuranceInfo.expiryDate ? new Date(data.insuranceInfo.expiryDate) : null,
              },
              update: {
                provider: data.insuranceInfo.provider || '',
                policyNumber: data.insuranceInfo.policyNumber || '',
                expiryDate: data.insuranceInfo.expiryDate ? new Date(data.insuranceInfo.expiryDate) : null,
              }
            }
          }
        } : {
          insuranceInfo: {
            delete: true
          }
        }),
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
    const id = params?.id;
    if (!id) {
      return NextResponse.json({ error: 'Missing patient ID' }, { status: 400 });
    }

    // Delete patient (related data will be deleted automatically due to cascade)
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