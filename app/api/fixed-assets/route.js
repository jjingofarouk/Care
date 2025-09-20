import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid'; // Install: npm install uuid

const prisma = new PrismaClient();

export async function GET() {
  try {
    const assets = await prisma.fixedAsset.findMany({
      include: {
        depreciationSchedules: true,
        assetAudits: true,
      },
    });
    return NextResponse.json(assets, { status: 200 });
  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.purchaseDate || !data.cost) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const asset = await prisma.fixedAsset.create({
      data: {
        id: uuidv4(), // Generate unique ID
        name: data.name,
        purchaseDate: new Date(data.purchaseDate),
        cost: parseFloat(data.cost),
      },
    });
    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    console.error('Error creating asset:', error);
    return NextResponse.json({ error: 'Failed to create asset' }, { status: 500 });
  }
}