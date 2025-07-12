// app/api/patients/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeParam = searchParams.get('include')?.split(',') || [];
    const search = searchParams.get('search');
    const gender = searchParams.get('gender');
    const minAge = searchParams.get('minAge');
    const maxAge = searchParams.get('maxAge');
    const city = searchParams.get('city');

    const include = {
      addresses: includeParam.includes('addresses') || true,
      nextOfKin: includeParam.includes('nextOfKin') || true,
      insuranceInfo: includeParam.includes('insuranceInfo') || true,
    };

    const where = {};
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (gender) where.gender = gender;
    if (city) where.addresses = { some: { city: { contains: city, mode: 'insensitive' } } };
    if (minAge || maxAge) {
      where.dateOfBirth = {};
      if (minAge) {
        const minDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - parseInt(minAge));
        where.dateOfBirth.lte = minDate;
      }
      if (maxAge) {
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() - parseInt(maxAge));
        where.dateOfBirth.gte = maxDate;
      }
    }

    const patients = await prisma.patient.findMany({
      where,
      include,
      orderBy: { createdAt: 'desc' },
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
    if (data.email) {
      const existingUser = await prisma.userRegistration.findUnique({
        where: { email: data.email },
      });
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

    const id = `P-${uuidv4().slice(0, 8)}`;
    const dateOfBirth = new Date(data.dateOfBirth);
    if (isNaN(dateOfBirth.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format for dateOfBirth' },
        { status: 400 }
      );
    }

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
        addresses: {
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