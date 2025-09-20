import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const ambulances = await prisma.ambulance.findMany();
  return NextResponse.json(ambulances);
}

export async function POST(request) {
  const data = await request.json();
  const ambulance = await prisma.ambulance.create({
    data: {
      vehicleNumber: data.vehicleNumber,
      status: data.status,
    },
  });
  return NextResponse.json(ambulance);
}