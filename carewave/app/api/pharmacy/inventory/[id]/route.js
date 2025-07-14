import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const inventoryItem = await prisma.pharmacyItem.findUnique({
      where: { id: params.id },
      include: { drug: true },
    });
    if (!inventoryItem) {
      return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
    }
    return NextResponse.json(inventoryItem);
  } catch (error) {
    console.error('GET /api/pharmacy/inventory/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory item', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(request, { params }) {
  try {
    const data = await request.json();
    const inventoryItem = await prisma.pharmacyItem.update({
      where: { id: params.id },
      data: {
        batchNumber: data.batchNumber,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
        quantity: data.quantity ? parseInt(data.quantity) : undefined,
      },
      include: { drug: true },
    });
    return NextResponse.json(inventoryItem);
  } catch (error) {
    console.error('PATCH /api/pharmacy/inventory/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update inventory item', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.pharmacyItem.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: 'Inventory item deleted' });
  } catch (error) {
    console.error('DELETE /api/pharmacy/inventory/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete inventory item', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}