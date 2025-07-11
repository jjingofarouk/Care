import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Registration flow
    if (firstName && lastName) {
      const existingUser = await prisma.userRegistration.findUnique({ where: { email } });

      if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.userRegistration.create({
        data: {
          email,
          firstName,
          lastName,
          passwordHash: hashedPassword,
          emailVerification: {
            create: {
              token: uuidv4(),
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            },
          },
        },
      });

      await prisma.userLogin.create({
        data: {
          email,
          passwordHash: hashedPassword,
        },
      });

      return NextResponse.json({
        message: 'User registered successfully',
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
        },
      }, { status: 201 });
    }

    // Login flow
    const userLogin = await prisma.userLogin.findUnique({ where: { email } });

    if (!userLogin || !(await bcrypt.compare(password, userLogin.passwordHash))) {
      await prisma.loginAttempt.create({
        data: {
          userLoginId: userLogin?.id || uuidv4(),
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          success: false,
        },
      });

      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await prisma.loginAttempt.create({
      data: {
        userLoginId: userLogin.id,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        success: true,
      },
    });

    const token = jwt.sign({ userId: userLogin.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    await prisma.session.create({
      data: {
        userLoginId: userLogin.id,
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    const userReg = await prisma.userRegistration.findUnique({ where: { email } });

    return NextResponse.json({
      token,
      user: {
        id: userLogin.id,
        email: userLogin.email,
        firstName: userReg?.firstName,
        lastName: userReg?.lastName,
      },
    });

  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}