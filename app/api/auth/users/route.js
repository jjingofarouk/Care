import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return NextResponse.json({ message: 'Authorization required' }, { status: 401 });
  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await prisma.userRegistration.findUnique({
      where: { id: decoded.userId },
    });
    if (admin.role !== 'ADMIN') return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    const users = await prisma.userRegistration.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Users fetch error:', error);
    return NextResponse.json({ message: 'Invalid authorization' }, { status: 401 });
  }
}