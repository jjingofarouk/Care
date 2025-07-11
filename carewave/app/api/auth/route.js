import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request) {
  try {
    const { email, password, firstName, lastName, role, action, token } = await request.json();

    if (action === 'verify') {
      const verification = await prisma.emailVerificationToken.findFirst({
        where: { token, expiresAt: { gte: new Date() } },
        include: { userRegistration: true },
      });

      if (!verification) {
        return NextResponse.json({ error: 'Invalid or expired verification token' }, { status: 400 });
      }

      await prisma.userRegistration.update({
        where: { id: verification.userRegistrationId },
        data: { updatedAt: new Date() },
      });

      await prisma.emailVerificationToken.delete({ where: { id: verification.id } });

      return NextResponse.json({ message: 'Email verified successfully' }, { status: 200 });
    }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Handle registration
    if (firstName && lastName && role) {
      const existingUser = await prisma.userRegistration.findUnique({ where: { email } });
      if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationToken = uuidv4();
      const userRegistration = await prisma.userRegistration.create({
        data: {
          email,
          firstName,
          lastName,
          role,
          passwordHash: hashedPassword,
          emailVerification: {
            create: {
              token: verificationToken,
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

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Email',
        html: `<p>Please verify your email by clicking <a href="${process.env.BASE_URL}/auth/verify?token=${verificationToken}">here</a>.</p>`,
      });

      return NextResponse.json({ message: 'Registration successful, please verify your email' }, { status: 201 });
    }

    // Handle login
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

    const userRegistration = await prisma.userRegistration.findUnique({ where: { email } });
    if (!userRegistration) {
      return NextResponse.json({ error: 'User registration not found' }, { status: 400 });
    }

    await prisma.loginAttempt.create({
      data: {
        userLoginId: userLogin.id,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        success: true,
      },
    });

    const sessionToken = jwt.sign({ userId: userLogin.id, role: userRegistration.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    await prisma.session.create({
      data: {
        userLoginId: userLogin.id,
        token: sessionToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    return NextResponse.json({
      token: sessionToken,
      user: {
        id: userLogin.id,
        email: userLogin.email,
        firstName: userRegistration.firstName,
        lastName: userRegistration.lastName,
        role: userRegistration.role,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}