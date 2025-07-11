import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email, password, firstName, lastName, role } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (firstName && lastName && role) {
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
          userLogin: {
            create: {
              email,
              passwordHash: hashedPassword,
            },
          },
        },
      });

      return NextResponse.json({ message: 'Registration successful' }, { status: 201 });
    }

    const userLogin = await prisma.userLogin.findUnique({
      where: { email },
      include: { userRegistration: true },
    });

    const passwordMatches = userLogin && await bcrypt.compare(password, userLogin.passwordHash);

    const isValid = userLogin && passwordMatches && userLogin.userRegistration;

    await prisma.loginAttempt.create({
      data: {
        userLoginId: userLogin?.id || uuidv4(),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        success: Boolean(isValid),
        attemptedAt: new Date(),
      },
    });

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await prisma.userLogin.update({
      where: { id: userLogin.id },
      data: { lastLoginAt: new Date() },
    });

    await prisma.session.updateMany({
      where: { userLoginId: userLogin.id, isActive: true },
      data: { isActive: false },
    });

    const sessionToken = jwt.sign(
      { userId: userLogin.id, role: userLogin.userRegistration.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    await prisma.session.create({
      data: {
        userLoginId: userLogin.id,
        token: sessionToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        isActive: true,
      },
    });

    return NextResponse.json({
      token: sessionToken,
      user: {
        id: userLogin.id,
        email: userLogin.email,
        firstName: userLogin.userRegistration.firstName,
        lastName: userLogin.userRegistration.lastName,
        role: userLogin.userRegistration.role,
      },
    });
  } catch (error) {
    console.error('[AUTH ERROR]', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}