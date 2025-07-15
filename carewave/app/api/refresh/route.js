import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token provided' }, { status: 401 });
    }

    // Verify refresh token in database
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      const response = NextResponse.json({ error: 'Invalid or expired refresh token' }, { status: 401 });
      response.cookies.delete('refreshToken');
      return response;
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: tokenRecord.user.id, role: tokenRecord.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Optionally extend refresh token expiration
    const newExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.update({
      where: { token: refreshToken },
      data: { expiresAt: newExpiresAt },
    });

    const response = NextResponse.json({
      accessToken,
      user: {
        id: tokenRecord.user.id,
        email: tokenRecord.user.email,
        firstName: tokenRecord.user.firstName,
        lastName: tokenRecord.user.lastName,
        role: tokenRecord.user.role,
      },
    });

    // Update refresh token cookie
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('[REFRESH TOKEN ERROR]', error);
    const response = NextResponse.json({ error: 'Failed to refresh token' }, { status: 500 });
    response.cookies.delete('refreshToken');
    return response;
  }
}