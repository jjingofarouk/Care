import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { id } = params;
  const department = await prisma.department.findUnique({
    where: { id },
    include: {
      units: true,
      doctors: true,
      nurses: true,
      wards: true,
      serviceCounters: true,
      theatres: true,
    },
  });
  return NextResponse.json(department || {});
}

export async function PUT(request, { params }) {
  const { id } = params;
  const data = await request.json();

  const department = await prisma.department.update({
    where: { id },
    data: {
      name: data.name,
      departmentType: data.departmentType,
    },
  });
  return NextResponse.json(department);
}

export async function DELETE(request, { params }) {
  const { id } = params;
  await prisma.department.delete({ where: { id } });
  return NextResponse.json({ message: 'Department deleted' });
}