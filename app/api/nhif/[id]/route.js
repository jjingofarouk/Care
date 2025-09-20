import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const nhifRecord = await prisma.nhifRecord.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!nhifRecord) {
      return NextResponse.json({ error: 'NHIF record not found' }, { status: 404 });
    }
    return NextResponse.json(nhifRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch NHIF record' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const nhifRecord = await prisma.nhifRecord.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(nhifRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update NHIF record' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.nhifRecord.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'NHIF record deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete NHIF record' }, { status: 500 });
  }
}