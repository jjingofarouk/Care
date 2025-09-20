import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const body = await request.json();
    const { email, password, firstName, lastName, role = 'PATIENT' } = body;
    // Check if trying to create non-patient account
    if (role !== 'PATIENT') {
      // Verify admin authorization
      if (!authHeader) {
        return NextResponse.json({ message: 'Admin authorization required' }, { status: 401 });
      }
      const token = authHeader.replace('Bearer ', '');
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await prisma.userRegistration.findUnique({
          where: { id: decoded.userId },
        });
        if (admin.role !== 'ADMIN') {
          return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
        }
      } catch {
        return NextResponse.json({ message: 'Invalid authorization' }, { status: 401 });
      }
    }
    // Check if email exists
    const existing = await prisma.userRegistration.findUnique({
      where: { email },
    });
    if (existing) {
      return NextResponse.json({ message: 'Email already registered' }, { status: 400 });
    }
    // Create user
    const passwordHash = await bcrypt.hash(password, 10);
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
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}