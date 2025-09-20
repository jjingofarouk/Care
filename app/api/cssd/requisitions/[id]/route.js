import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const requisitions = await prisma.cssdRequisition.findMany({
      include: { instrument: true, user: true },
    });
    return NextResponse.json(requisitions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch requisitions' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const requisition = await prisma.cssdRequisition.create({
      data: {
        instrumentId: parseInt(data.instrumentId),
        department: data.department,
        requestedBy: parseInt(data.requestedBy),
        quantity: parseInt(data.quantity),
        status: data.status,
        notes: data.notes,
      },
    });
    await prisma.cssdLog.create({
      data: {
        requisitionId: requisition.id,
        action: 'CREATED',
        details: `Requisition created for instrument ${data.instrumentId}`,
        performedBy: data.requestedBy || 1,
      },
    });
    return NextResponse.json(requisition, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create requisition' }, { status: 500 });
  }
}
