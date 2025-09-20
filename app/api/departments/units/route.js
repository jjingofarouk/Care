import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const departmentId = searchParams.get('departmentId');

  const units = await prisma.unit.findMany({
    where: departmentId ? { departmentId } : {},
    include: { department: true },
  });
  return NextResponse.json(units);
}

export async function POST(request) {
  const data = await request.json();
  const unit = await prisma.unit.create({
    data: {
      name: data.name,
      departmentId: data.departmentId,
    },
  });
  return NextResponse.json(unit, { status: 201 });
}