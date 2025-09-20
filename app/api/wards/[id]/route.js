import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const ward = await prisma.ward.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!ward) {
      return NextResponse.json({ error: 'Ward not found' }, { status: 404 });
    }
    return NextResponse.json(ward);
  } catch (error) {
    console.error('GET /api/ward/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch ward', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const ward = await prisma.ward.update({
      where: { id: parseInt(params.id) },
      data: {
        name: data.name || null,
        wardNumber: data.wardNumber || null,
        totalBeds: data.totalBeds ? parseInt(data.totalBeds) : null,
        occupiedBeds: data.occupiedBeds ? parseInt(data.occupiedBeds) : 0,
        department: data.department || null,
        location: data.location || null,
        nurseInCharge: data.nurseInCharge || null,
      },
    });
    return NextResponse.json(ward);
  } catch (error) {
    console.error('PUT /api/ward/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update ward', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request, { params }) {
  try {
    const ward = await prisma.ward.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!ward) {
      return NextResponse.json({ error: 'Ward not found' }, { status: 404 });
    }
    await prisma.ward.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Ward deleted' });
  } catch (error) {
    console.error('DELETE /api/ward/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete ward', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}