import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const bill = await prisma.bill.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!bill) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 });
    }
    return NextResponse.json(bill);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bill' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const bill = await prisma.bill.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(bill);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update bill' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.bill.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Bill deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete bill' }, { status: 500 });
  }
}