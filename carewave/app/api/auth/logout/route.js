// /app/api/auth/logout/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return NextResponse.json({ error: 'Refresh token required' }, { status: 400 });
    }

    // Delete the specific refresh token
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });

    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('[LOGOUT ERROR]', error);
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// Optional: DELETE method to logout from all devices
export async function DELETE(request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Delete all refresh tokens for the user (logout from all devices)
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });

    return NextResponse.json({ message: 'Logged out from all devices' });
  } catch (error) {
    console.error('[LOGOUT ALL ERROR]', error);
    return NextResponse.json({ error: 'Failed to logout from all devices' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}