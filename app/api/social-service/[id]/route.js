import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const socialServiceRecord = await prisma.socialServiceRecord.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!socialServiceRecord) {
      return NextResponse.json({ error: 'Social service record not found' }, { status: 404 });
    }
    return NextResponse.json(socialServiceRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch social service record' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const socialServiceRecord = await prisma.socialServiceRecord.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(socialServiceRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update social service record' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.socialServiceRecord.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Social service record deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete social service record' }, { status: 500 });
  }
}