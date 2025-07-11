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

    // Handle registration if firstName and lastName present
    if (firstName && lastName) {
      const existingUser = await prisma.userRegistration.findUnique({ where: { email } });
      if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Create userRegistration and related emailVerification in one transaction
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

      // Create userLogin separately
      await prisma.userLogin.create({
        data: {
          email,
          passwordHash: hashedPassword,
        },
      });

      return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
    }

    // Handle login (no firstName and lastName means login flow)
    const userLogin = await prisma.userLogin.findUnique({ where: { email } });

    // If no userLogin or password doesn't match
    if (!userLogin || !(await bcrypt.compare(password, userLogin.passwordHash))) {
      // Log failed attempt (userLoginId null if userLogin not found)
      await prisma.loginAttempt.create({
        data: {
          userLoginId: userLogin?.id || uuidv4(),
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          success: false,
        },
      });
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Log successful login attempt
    await prisma.loginAttempt.create({
      data: {
        userLoginId: userLogin.id,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        success: true,
      },
    });

    // Create session token
    const token = jwt.sign({ userId: userLogin.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    await prisma.session.create({
      data: {
        userLoginId: userLogin.id,
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    // Fetch userRegistration details for response
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