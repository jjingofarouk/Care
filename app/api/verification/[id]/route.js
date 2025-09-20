import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const verificationRecord = await prisma.verificationRecord.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!verificationRecord) {
      return NextResponse.json({ error: 'Verification record not found' }, { status: 404 });
    }
    return NextResponse.json(verificationRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch verification record' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const verificationRecord = await prisma.verificationRecord.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(verificationRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update verification record' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.verificationRecord.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Verification record deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete verification record' }, { status: 500 });
  }
}