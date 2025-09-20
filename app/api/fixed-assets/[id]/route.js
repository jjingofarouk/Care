// app/api/fixed-assets/[id]/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: 'Asset ID is required' }, { status: 400 });
    }

    const asset = await prisma.fixedAsset.findUnique({
      where: { id },
      include: {
        depreciationSchedules: {
          orderBy: {
            depreciationDate: 'asc'
          }
        },
        assetAudits: {
          orderBy: {
            auditDate: 'desc'
          }
        },
      },
    });

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    return NextResponse.json(asset, { status: 200 });
  } catch (error) {
    console.error('Error fetching asset:', error);
    return NextResponse.json({ error: 'Failed to fetch asset' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Asset ID is required' }, { status: 400 });
    }

    // Validate required fields
    if (!data.name || !data.purchaseDate || !data.cost) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const asset = await prisma.fixedAsset.update({
      where: { id },
      data: {
        name: data.name,
        purchaseDate: new Date(data.purchaseDate),
        cost: parseFloat(data.cost),
      },
      include: {
        depreciationSchedules: true,
        assetAudits: true,
      },
    });

    return NextResponse.json(asset, { status: 200 });
  } catch (error) {
    console.error('Error updating asset:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update asset' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: 'Asset ID is required' }, { status: 400 });
    }

    await prisma.fixedAsset.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Asset deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting asset:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete asset' }, { status: 500 });
  }
}