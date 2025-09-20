import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const instruments = await prisma.cssdInstrument.findMany();
    return NextResponse.json(instruments);
  } catch (error) {
    console.error('GET /api/cssd/instruments error:', error);
    return NextResponse.json({ message: 'Failed to fetch instruments', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.serialNumber) {
      return NextResponse.json({ message: 'Name and serial number are required' }, { status: 400 });
    }

    // Check for unique serialNumber
    const existingInstrument = await prisma.cssdInstrument.findUnique({
      where: { serialNumber: data.serialNumber },
    });
    if (existingInstrument) {
      return NextResponse.json({ message: 'Serial number already exists' }, { status: 400 });
    }

    const instrument = await prisma.cssdInstrument.create({
      data: {
        name: data.name.trim(),
        serialNumber: data.serialNumber.trim(),
        type: data.type?.trim() || null,
        status: data.status || 'AVAILABLE',
        lastSterilized: data.lastSterilized ? new Date(data.lastSterilized) : null,
        location: data.location?.trim() || null,
        stockQuantity: parseInt(data.stockQuantity) || 1,
        minStockThreshold: parseInt(data.minStockThreshold) || 1,
      },
    });

    await prisma.cssdLog.create({
      data: {
        instrumentId: instrument.id,
        action: 'CREATED',
        details: `Instrument ${data.name} created`,
        performedBy: data.userId || 1, // Replace with actual user ID from auth
      },
    });

    return NextResponse.json(instrument, { status: 201 });
  } catch (error) {
    console.error('POST /api/cssd/instruments error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ message: 'Serial number already exists' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to create instrument', error: error.message }, { status: 500 });
  }
}