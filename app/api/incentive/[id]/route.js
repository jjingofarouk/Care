import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const incentive = await prisma.incentive.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!incentive) {
      return NextResponse.json({ error: 'Incentive not found' }, { status: 404 });
    }
    return NextResponse.json(incentive);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch incentive' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const incentive = await prisma.incentive.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(incentive);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update incentive' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.incentive.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Incentive deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete incentive' }, { status: 500 });
  }
}