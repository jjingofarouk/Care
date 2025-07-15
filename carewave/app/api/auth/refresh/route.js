// /app/api/auth/refresh/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return NextResponse.json({ error: 'Refresh token required' }, { status: 401 });
    }

    // Find refresh token in database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: {
        user: true,
      },
    });

    if (!storedToken) {
      return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
    }

    // Check if token is expired
    if (storedToken.expiresAt < new Date()) {
      // Delete expired token
      await prisma.refreshToken.delete({
        where: { id: storedToken.id },
      });
      return NextResponse.json({ error: 'Refresh token expired' }, { status: 401 });
    }

    // Check if user still exists and is active
    const user = storedToken.user;
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    // Create new access token
    const newAccessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Optionally create a new refresh token for better security (token rotation)
    const newRefreshTokenValue = uuidv4();
    const newRefreshTokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Update the refresh token in database (token rotation)
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: {
        token: newRefreshTokenValue,
        expiresAt: newRefreshTokenExpiry,
      },
    });

    // Clean up expired refresh tokens for this user
    await prisma.refreshToken.deleteMany({
      where: {
        userId: user.id,
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return NextResponse.json({
      token: newAccessToken,
      refreshToken: newRefreshTokenValue,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('[REFRESH ERROR]', error);
    return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
  } finally {
    await prisma.$disconnect();
  }
}