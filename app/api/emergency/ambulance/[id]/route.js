import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const ambulance = await prisma.ambulance.findUnique({
    where: { id: params.id },
  });
  return ambulance
    ? NextResponse.json(ambulance)
    : NextResponse.json({ error: 'Ambulance not found' }, { status: 404 });
}

export async function PUT(request, { params }) {
  const data = await request.json();
  const ambulance = await prisma.ambulance.update({
    where: { id: params.id },
    data: {
      vehicleNumber: data.vehicleNumber,
      status: data.status,
    },
  });
  return NextResponse.json(ambulance);
}

export async function DELETE(request, { params }) {
  await prisma.ambulance.delete({
    where: { id: params.id },
  });
  return NextResponse.json({ message: 'Ambulance deleted' });
}