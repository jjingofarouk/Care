import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const prescription = await prisma.prescription.findUnique({
      where: { id: params.id },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        drug: true,
      },
    });
    if (!prescription) {
      return NextResponse.json({ error: 'Prescription not found' }, { status: 404 });
    }
    return NextResponse.json(prescription);
  } catch (error) {
    console.error('GET /api/pharmacy/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch prescription', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(request, { params }) {
  try {
    const data = await request.json();
    const prescription = await prisma.prescription.update({
      where: { id: params.id },
      data: {
        dosage: data.dosage,
        prescribedAt: data.prescribedAt ? new Date(data.prescribedAt) : undefined,
        drug: data.drugId ? { connect: { id: data.drugId } } : undefined,
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        drug: true,
      },
    });
    return NextResponse.json(prescription);
  } catch (error) {
    console.error('PATCH /api/pharmacy/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update prescription', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.prescription.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: 'Prescription deleted' });
  } catch (error) {
    console.error('DELETE /api/pharmacy/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete prescription', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}