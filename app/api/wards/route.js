import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const wards = await prisma.ward.findMany();
    return NextResponse.json(wards);
  } catch (error) {
    console.error('GET /api/wards error:', error);
    return NextResponse.json({ error: 'Failed to fetch wards', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    if (!data.name || !data.totalBeds || !data.department || !data.location || !data.nurseInCharge) {
      return NextResponse.json({ error: 'Missing required fields: name, totalBeds, department, location, nurseInCharge' }, { status: 400 });
    }

    const ward = await prisma.ward.create({
      data: {
        name: data.name,
        wardNumber: data.wardNumber || `W-${uuidv4().slice(0, 8)}`,
        totalBeds: parseInt(data.totalBeds),
        occupiedBeds: data.occupiedBeds ? parseInt(data.occupiedBeds) : 0,
        department: data.department,
        location: data.location,
        nurseInCharge: data.nurseInCharge,
      },
    });
    return NextResponse.json(ward, { status: 201 });
  } catch (error) {
    console.error('POST /api/wards error:', error);
    return NextResponse.json({ error: 'Failed to create ward', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}