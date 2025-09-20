import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email, password, firstName, lastName, role } = await request.json();

    if (!email || !password || !firstName || !lastName || !role) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.userRegistration.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email is already registered' }, { status: 400 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.userRegistration.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        role,
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('[REGISTER ERROR]', error);
    return NextResponse.json({ error: 'Failed to register user' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}