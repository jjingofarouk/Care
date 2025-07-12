import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { id } = params;
  const unit = await prisma.unit.findUnique({
    where: { id },
    include: { department: true },
  });
  return NextResponse.json(unit || {});
}

export async function PUT(request, { params }) {
  const { id } = params;
  const data = await request.json();

  const unit = await prisma.unit.update({
    where: { id },
    data: {
      name: data.name,
      departmentId: data.departmentId,
    },
  });
  return NextResponse.json(unit);
}

export async function DELETE(request, { params }) {
  const { id } = params;
  await prisma.unit.delete({ where: { id } });
  return NextResponse.json({ message: 'Unit deleted' });
}