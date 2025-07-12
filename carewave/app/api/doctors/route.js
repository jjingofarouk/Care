import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const departmentId = searchParams.get('departmentId');

  if (id) {
    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        department: true,
        specializations: { include: { specialization: true } },
        schedules: true,
        leaves: true,
      },
    });
    return NextResponse.json(doctor || {});
  }

  const doctors = await prisma.doctor.findMany({
    where: departmentId ? { departmentId } : {},
    include: {
      department: true,
      specializations: { include: { specialization: true } },
      schedules: true,
      leaves: true,
    },
  });
  return NextResponse.json(doctors);
}

export async function POST(request) {
  const data = await request.json();
  const doctor = await prisma.doctor.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      departmentId: data.departmentId,
      specializations: {
        create: data.specializationIds?.map(id => ({
          specializationId: id,
        })),
      },
    },
    include: { specializations: true },
  });
  return NextResponse.json(doctor, { status: 201 });
}

export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const data = await request.json();

  const doctor = await prisma.doctor.update({
    where: { id },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      departmentId: data.departmentId,
      specializations: {
        deleteMany: {},
        create: data.specializationIds?.map(id => ({
          specializationId: id,
        })),
      },
    },
    include: { specializations: true },
  });
  return NextResponse.json(doctor);
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  await prisma.doctor.delete({ where: { id } });
  return NextResponse.json({ message: 'Doctor deleted' });
}