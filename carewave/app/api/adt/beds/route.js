// app/api/adt/beds/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const authenticate = (request) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

export async function PATCH(request) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const data = await request.json();
    const { isOccupied } = data;

    const bed = await prisma.bed.update({
      where: { id },
      data: { isOccupied },
      include: { ward: { select: { id: true, name: true } } },
    });

    return NextResponse.json(bed);
  } catch (error) {
    console.error('Error updating bed status:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}