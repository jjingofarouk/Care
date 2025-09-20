import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const clinicalSetting = await prisma.clinicalSetting.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!clinicalSetting) {
      return NextResponse.json({ error: 'Clinical setting not found' }, { status: 404 });
    }
    return NextResponse.json(clinicalSetting);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch clinical setting' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const clinicalSetting = await prisma.clinicalSetting.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(clinicalSetting);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update clinical setting' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.clinicalSetting.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Clinical setting deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete clinical setting' }, { status: 500 });
  }
}