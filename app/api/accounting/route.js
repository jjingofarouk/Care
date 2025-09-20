import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'payroll') {
      const payrolls = await prisma.payroll.findMany({ include: { user: true } });
      return NextResponse.json(payrolls);
    } else if (type === 'asset') {
      const assets = await prisma.fixedAsset.findMany();
      return NextResponse.json(assets);
    } else {
      const transactions = await prisma.transaction.findMany({
        include: { costCenter: true },
      });
      return NextResponse.json(transactions);
    }
  } catch (error) {
    console.error('Error fetching data:', error.message);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const data = await request.json();

    if (type === 'payroll') {
      const { userId, salary, taxes, benefits, period, status } = data;
      if (!userId || !salary || !taxes || !benefits || !period || !status) {
        return NextResponse.json({ error: 'Missing required payroll fields' }, { status: 400 });
      }
      const payroll = await prisma.payroll.create({
        data: {
          userId: parseInt(userId),
          salary: parseFloat(salary),
          taxes: parseFloat(taxes),
          benefits: parseFloat(benefits),
          period,
          status,
        },
      });
      return NextResponse.json(payroll, { status: 201 });
    } else if (type === 'asset') {
      const { name, purchaseDate, purchaseCost, depreciation, currentValue, status } = data;
      if (!name || !purchaseDate || !purchaseCost || !depreciation || !currentValue || !status) {
        return NextResponse.json({ error: 'Missing required asset fields' }, { status: 400 });
      }
      const asset = await prisma.fixedAsset.create({
        data: {
          name,
          purchaseDate: new Date(purchaseDate),
          purchaseCost: parseFloat(purchaseCost),
          depreciation: parseFloat(depreciation),
          currentValue: parseFloat(currentValue),
          status,
        },
      });
      return NextResponse.json(asset, { status: 201 });
    } else {
      const { description, amount, category, status, date, type: transactionType, costCenterId, patientId } = data;
      if (!description || !amount || !category || !status || !transactionType) {
        return NextResponse.json({ error: 'Missing required transaction fields' }, { status: 400 });
      }
      if (costCenterId && !(await prisma.costCenter.findUnique({ where: { id: parseInt(costCenterId) } }))) {
        return NextResponse.json({ error: 'Invalid costCenterId' }, { status: 400 });
      }
      if (patientId && !(await prisma.user.findUnique({ where: { id: parseInt(patientId) } }))) {
        return NextResponse.json({ error: 'Invalid patientId' }, { status: 400 });
      }
      const transaction = await prisma.transaction.create({
        data: {
          description,
          amount: parseFloat(amount),
          category,
          status,
          date: date ? new Date(date) : new Date(),
          type: transactionType,
          costCenterId: costCenterId ? parseInt(costCenterId) : null,
          patientId: patientId ? parseInt(patientId) : null,
        },
      });
      return NextResponse.json(transaction, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating record:', error.message, error.stack);
    return NextResponse.json({ error: 'Failed to create record', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}