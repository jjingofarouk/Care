import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const substoreRecord = await prisma.substoreRecord.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!substoreRecord) {
      return NextResponse.json({ error: 'Substore record not found' }, { status: 404 });
    }
    return NextResponse.json(substoreRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch substore record' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const substoreRecord = await prisma.substoreRecord.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(substoreRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update substore record' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.substoreRecord.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Substore record deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete substore record' }, { status: 500 });
  }
}