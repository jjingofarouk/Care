import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
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

  const departments = await prisma.department.findMany({
    include: {
      units: true,
      doctors: true,
      nurses: true,
      wards: true,
      serviceCounters: true,
      theatres: true,
    },
  });
  return NextResponse.json(departments);
}

export async function POST(request) {
  const data = await request.json();
  const department = await prisma.department.create({
    data: {
      name: data.name,
      departmentType: data.departmentType,
    },
  });
  return NextResponse.json(department, { status: 201 });
}