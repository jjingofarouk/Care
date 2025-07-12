import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  const specializations = await prisma.specialization.findMany({
    include: { doctors: { include: { doctor: true } } },
  });
  return NextResponse.json(specializations);
}

export async function POST(request) {
  const data = await request.json();
  const specialization = await prisma.specialization.create({
    data: {
      name: data.name,
      description: data.description,
    },
  });
  return NextResponse.json(specialization, { status: 201 });
}

export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const data = await request.json();

  const specialization = await prisma.specialization.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
    },
  });
  return NextResponse.json(specialization);
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  await prisma.specialization.delete({ where: { id } });
  return NextResponse.json({ message: 'Specialization deleted' });
}