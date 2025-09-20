import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const transaction = await prisma.transaction.findUnique({
      where: { id: parseInt(id) },
      include: { costCenter: true },
    });
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }
    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error.message);
    return NextResponse.json({ error: 'Failed to fetch transaction' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    const { description, amount, category, status, date, type, costCenterId, patientId } = data;
    if (!description || !amount || !category || !status || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (costCenterId && !(await prisma.costCenter.findUnique({ where: { id: parseInt(costCenterId) } }))) {
      return NextResponse.json({ error: 'Invalid costCenterId' }, { status: 400 });
    }
    if (patientId && !(await prisma.user.findUnique({ where: { id: parseInt(patientId) } }))) {
      return NextResponse.json({ error: 'Invalid patientId' }, { status: 400 });
    }
    const transaction = await prisma.transaction.update({
      where: { id: parseInt(id) },
      data: {
        description,
        amount: parseFloat(amount),
        category,
        status,
        date: date ? new Date(date) : new Date(),
        type,
        costCenterId: costCenterId ? parseInt(costCenterId) : null,
        patientId: patientId ? parseInt(patientId) : null,
      },
    });
    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error updating transaction:', error.message);
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await prisma.transaction.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: 'Transaction deleted' });
  } catch (error) {
    console.error('Error deleting transaction:', error.message);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}