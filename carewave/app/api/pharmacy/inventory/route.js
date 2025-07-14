import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const drugId = searchParams.get('drugId');
  try {
    const inventory = await prisma.pharmacyItem.findMany({
      where: { ...(drugId && { drugId }) },
      include: { drug: true },
    });
    return NextResponse.json(inventory);
  } catch (error) {
    console.error('GET /api/pharmacy/inventory error:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    if (!data.drugId || !data.batchNumber || !data.expiryDate || !data.quantity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const pharmacyItem = await prisma.pharmacyItem.create({
      data: {
        drug: { connect: { id: data.drugId } },
        batchNumber: data.batchNumber,
        expiryDate: new Date(data.expiryDate),
        quantity: parseInt(data.quantity),
      },
      include: { drug: true },
    });
    return NextResponse.json(pharmacyItem, { status: 201 });
  } catch (error) {
    console.error('POST /api/pharmacy/inventory error:', error);
    return NextResponse.json({ error: 'Failed to create inventory item', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}