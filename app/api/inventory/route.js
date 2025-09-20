import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const inventoryItems = await prisma.inventoryItem.findMany();
    return NextResponse.json(inventoryItems);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch inventory items' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const inventoryItem = await prisma.inventoryItem.create({ data });
    return NextResponse.json(inventoryItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create inventory item' }, { status: 500 });
  }
}