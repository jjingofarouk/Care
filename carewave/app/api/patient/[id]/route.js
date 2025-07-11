// app/api/patients/[id]/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const { searchParams } = new URL(request.url);
    const includeParam = searchParams.get('include');
    const includeRelations = includeParam?.split(',') || [];
    
    const include = {
      addresses: includeRelations.includes('addresses'),
      nextOfKin: includeRelations.includes('nextOfKin'),
      insuranceInfo: includeRelations.includes('insuranceInfo'),
      userAccount: includeRelations.includes('userAccount'),
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
    const { id } = params;
    const data = await request.json();

    if (!data.firstName || !data.lastName) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      );
    }

    if (data.email) {
      const existingPatient = await prisma.patient.findFirst({
        where: {
          email: data.email,
          NOT: { id }
        }
      });
      if (existingPatient) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 409 }
        );
      }
    }

    const dateOfBirth = data.dateOfBirth ? new Date(data.dateOfBirth) : null;
    if (data.dateOfBirth && isNaN(dateOfBirth.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format for dateOfBirth' },
        { status: 400 }
      );
    }

    const updatedPatient = await prisma.patient.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth,
        gender: data.gender || null,
        phone: data.phone || null,
        email: data.email || null,
        addresses: data.addresses ? {
          deleteMany: {},
          create: data.addresses.map(addr => ({
            street: addr.street,
            city: addr.city,
            country: addr.country,
            postalCode: addr.postalCode || null,
          }))
        } : undefined,
        nextOfKin: data.nextOfKin ? {
          upsert: {
            create: {
              firstName: data.nextOfKin.firstName,
              lastName: data.nextOfKin.lastName,
              relationship: data.nextOfKin.relationship,
              phone: data.nextOfKin.phone || null,
              email: data.nextOfKin.email || null,
            },
            update: {
              firstName: data.nextOfKin.firstName,
              lastName: data.nextOfKin.lastName,
              relationship: data.nextOfKin.relationship,
              phone: data.nextOfKin.phone || null,
              email: data.nextOfKin.email || null,
            }
          }
        } : undefined,
        insuranceInfo: data.insuranceInfo ? {
          upsert: {
            create: {
              provider: data.insuranceInfo.provider,
              policyNumber: data.insuranceInfo.policyNumber,
              expiryDate: data.insuranceInfo.expiryDate ? new Date(data.insuranceInfo.expiryDate) : null,
            },
            update: {
              provider: data.insuranceInfo.provider,
              policyNumber: data.insuranceInfo.policyNumber,
              expiryDate: data.insuranceInfo.expiryDate ? new Date(data.insuranceInfo.expiryDate) : null,
            }
          }
        } : undefined,
      },
      include: {
        addresses: true,
        nextOfKin: true,
        insuranceInfo: true,
      }
    });

    return NextResponse.json(updatedPatient);
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
    const { id } = params;

    await prisma.patient.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/patients/[id] error:', error);
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