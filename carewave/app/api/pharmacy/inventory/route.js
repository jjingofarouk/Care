import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const authenticate = (request) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

export async function GET(request) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const drugId = searchParams.get('drugId');
  const id = searchParams.get('id');

  try {
    if (id) {
      const inventoryItem = await prisma.pharmacyItem.findUnique({
        where: { id },
        include: {
          drug: { select: { id: true, name: true } }
        }
      });
      if (!inventoryItem) {
        return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
      }
      return NextResponse.json(inventoryItem);
    }

    const inventoryItems = await prisma.pharmacyItem.findMany({
      where: {
        ...(drugId && { drugId }),
      },
      include: {
        drug: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(inventoryItems);
  } catch (error) {
    console.error('Error in inventory API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    
    const inventoryItem = await prisma.pharmacyItem.create({
      data: {
        drugId: data.drugId,
        batchNumber: data.batchNumber,
        expiryDate: new Date(data.expiryDate),
        quantity: parseInt(data.quantity)
      },
      include: {
        drug: { select: { id: true, name: true } }
      }
    });

    return NextResponse.json(inventoryItem);
  } catch (error) {
    console.error('Error creating inventory item:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    
    const inventoryItem = await prisma.pharmacyItem.update({
      where: { id: data.id },
      data: {
        drugId: data.drugId,
        batchNumber: data.batchNumber,
        expiryDate: new Date(data.expiryDate),
        quantity: parseInt(data.quantity)
      },
      include: {
        drug: { select: { id: true, name: true } }
      }
    });

    return NextResponse.json(inventoryItem);
  } catch (error) {
    console.error('Error updating inventory item:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    await prisma.pharmacyItem.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Inventory item deleted' });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}