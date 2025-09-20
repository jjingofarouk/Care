import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const nursingRecord = await prisma.nursingRecord.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!nursingRecord) {
      return NextResponse.json({ error: 'Nursing record not found' }, { status: 404 });
    }
    return NextResponse.json(nursingRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch nursing record' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const nursingRecord = await prisma.nursingRecord.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(nursingRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update nursing record' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.nursingRecord.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Nursing record deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete nursing record' }, { status: 500 });
  }
}