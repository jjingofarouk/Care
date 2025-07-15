import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

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
    return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const asset = await prisma.fixedAsset.create({
      data: {
        name: data.name,
        purchaseDate: new Date(data.purchaseDate),
        cost: parseFloat(data.cost),
      },
    });
    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create asset' }, { status: 500 });
  }
}