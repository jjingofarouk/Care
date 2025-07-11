import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Handle POST requests for /api/auth (login)
export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await prisma.userRegistration.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('[AUTH ERROR]', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

// Handle POST requests for /api/register (registration)
export async function POST_REGISTER(request) {
  try {
    const { email, password, firstName, lastName, role } = await request.json();

    if (!email || !password || !firstName || !lastName || !role) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const existingUser = await prisma.userRegistration.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.userRegistration.create({
      data: {
        email,
        firstName,
        lastName,
        role,
        passwordHash: hashedPassword,
      },
    });

    return NextResponse.json({ message: 'Registration successful' }, { status: 201 });
  } catch (error) {
    console.error('[REGISTER ERROR]', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}