import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { id } = params;
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

export async function PUT(request, { params }) {
  const { id } = params;
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

export async function DELETE(request, { params }) {
  const { id } = params;
  await prisma.doctor.delete({ where: { id } });
  return NextResponse.json({ message: 'Doctor deleted' });
}