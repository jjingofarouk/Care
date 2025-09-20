import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const inventoryItem = await prisma.inventoryItem.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!inventoryItem) {
      return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
    }
    return NextResponse.json(inventoryItem);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch inventory item' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const inventoryItem = await prisma.inventoryItem.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(inventoryItem);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update inventory item' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.inventoryItem.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Inventory item deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete inventory item' }, { status: 500 });
  }
}