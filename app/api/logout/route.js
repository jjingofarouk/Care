import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (refreshToken) {
      await prisma.refreshToken.delete({
        where: { token: refreshToken },
      });
    }

    const response = NextResponse.json({ message: 'Logged out successfully' });
    response.cookies.delete('refreshToken');
    return response;
  } catch (error) {
    console.error('[LOGOUT ERROR]', error);
    return NextResponse.json({ error: 'Failed to log out' }, { status: 500 });
  }
}