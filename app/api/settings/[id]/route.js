import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const setting = await prisma.setting.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!setting) {
      return NextResponse.json({ error: 'Setting not found' }, { status: 404 });
    }
    return NextResponse.json(setting);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch setting' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const setting = await prisma.setting.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(setting);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.setting.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Setting deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete setting' }, { status: 500 });
  }
}