// app/api/patients/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const include = searchParams.get('include');

    const where = {};
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

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

    const patients = await prisma.patient.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: includeObj,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        gender: true,
        phone: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        // Include related data if requested
        ...(includeObj.addresses && {
          addresses: {
            select: {
              id: true,
              street: true,
              city: true,
              country: true,
              postalCode: true,
            }
          }
        }),
        ...(includeObj.nextOfKin && {
          nextOfKin: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              relationship: true,
              phone: true,
              email: true,
            }
          }
        }),
        ...(includeObj.insuranceInfo && {
          insuranceInfo: {
            select: {
              id: true,
              provider: true,
              policyNumber: true,
              expiryDate: true,
            }
          }
        }),
      },
    });

    return NextResponse.json(patients);
  } catch (error) {
    console.error('GET /api/patients error:', error);
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

    if (!data.firstName || !data.lastName || !data.dateOfBirth) {
      return NextResponse.json(
        { error: 'First name, last name, and date of birth are required' },
        { status: 400 }
      );
    }

    let userId = null;
    if (data.email && data.createUser && data.password) {
      const existingUser = await prisma.userRegistration.findUnique({
        where: { email: data.email },
      });
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

    const id = `P-${uuidv4().slice(0, 8)}`;
    const dateOfBirth = new Date(data.dateOfBirth);
    if (isNaN(dateOfBirth.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format for dateOfBirth' },
        { status: 400 }
      );
    }

    // Create patient with related data
    const patient = await prisma.patient.create({
      data: {
        id,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth,
        gender: data.gender || null,
        phone: data.phone || null,
        email: data.email || null,
        userId,
        // Create addresses if provided
        ...(data.addresses && data.addresses.length > 0 && {
          addresses: {
            create: data.addresses.map(address => ({
              street: address.street || '',
              city: address.city || '',
              country: address.country || '',
              postalCode: address.postalCode || null,
            }))
          }
        }),
        // Create next of kin if provided
        ...(data.nextOfKin && (data.nextOfKin.firstName || data.nextOfKin.lastName) && {
          nextOfKin: {
            create: {
              firstName: data.nextOfKin.firstName || '',
              lastName: data.nextOfKin.lastName || '',
              relationship: data.nextOfKin.relationship || '',
              phone: data.nextOfKin.phone || null,
              email: data.nextOfKin.email || null,
            }
          }
        }),
        // Create insurance info if provided
        ...(data.insuranceInfo && (data.insuranceInfo.provider || data.insuranceInfo.policyNumber) && {
          insuranceInfo: {
            create: {
              provider: data.insuranceInfo.provider || '',
              policyNumber: data.insuranceInfo.policyNumber || '',
              expiryDate: data.insuranceInfo.expiryDate ? new Date(data.insuranceInfo.expiryDate) : null,
            }
          }
        }),
      },
      include: {
        addresses: true,
        nextOfKin: true,
        insuranceInfo: true,
      },
    });

    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    console.error('POST /api/patients error:', error);
    return NextResponse.json(
      { error: 'Failed to create patient', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}