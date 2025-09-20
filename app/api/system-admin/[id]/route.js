import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const adminRecord = await prisma.adminRecord.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!adminRecord) {
      return NextResponse.json({ error: 'Admin record not found' }, { status: 404 });
    }
    return NextResponse.json(adminRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch admin record' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const adminRecord = await prisma.adminRecord.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(adminRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update admin record' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.adminRecord.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Admin record deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete admin record' }, { status: 500 });
  }
}