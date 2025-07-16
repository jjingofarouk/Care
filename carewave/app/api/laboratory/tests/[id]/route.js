import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const test = await prisma.labTest.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!test) return NextResponse.json({ error: 'Lab test not found' }, { status: 404 });
    return NextResponse.json(test);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch lab test' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const test = await prisma.labTest.update({
      where: { id: parseInt(params.id) },
      data: {
        name: data.name,
        description: data.description,
      },
    });
    return NextResponse.json(test);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update lab test' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.labTest.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Lab test deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete lab test' }, { status: 500 });
  }
}
