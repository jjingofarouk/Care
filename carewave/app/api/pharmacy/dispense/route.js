import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const data = await request.json();
    if (!data.pharmacyItemId || !data.patientId || !data.quantity || !data.dispensedAt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const pharmacyItem = await prisma.pharmacyItem.findUnique({
      where: { id: data.pharmacyItemId },
    });
    if (!pharmacyItem || pharmacyItem.quantity < data.quantity) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
    }
    const dispenseRecord = await prisma.dispenseRecord.create({
      data: {
        pharmacyItem: { connect: { id: data.pharmacyItemId } },
        patient: { connect: { id: data.patientId } },
        quantity: parseInt(data.quantity),
        dispensedAt: new Date(data.dispensedAt),
      },
      include: { pharmacyItem: { include: { drug: true } }, patient: { include: { user: true } } },
    });
    await prisma.pharmacyItem.update({
      where: { id: data.pharmacyItemId },
      data: { quantity: { decrement: parseInt(data.quantity) } },
    });
    return NextResponse.json(dispenseRecord, { status: 201 });
  } catch (error) {
    console.error('POST /api/pharmacy/dispense error:', error);
    return NextResponse.json({ error: 'Failed to record dispense', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}