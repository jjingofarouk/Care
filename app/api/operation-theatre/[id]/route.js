import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const operationRecord = await prisma.operationRecord.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!operationRecord) {
      return NextResponse.json({ error: 'Operation record not found' }, { status: 404 });
    }
    return NextResponse.json(operationRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch operation record' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const operationRecord = await prisma.operationRecord.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(operationRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update operation record' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.operationRecord.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Operation record deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete operation record' }, { status: 500 });
  }
}