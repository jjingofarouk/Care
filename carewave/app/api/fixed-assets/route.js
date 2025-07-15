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
    return new Response(JSON.stringify(assets), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch assets' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
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
    return new Response(JSON.stringify(asset), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create asset' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}