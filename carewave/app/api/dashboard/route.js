import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      include: { costCenter: true },
    });

    const totalTransactions = transactions.length;
    const pendingTransactions = transactions.filter(t => t.status === 'PENDING').length;
    const totalRevenue = transactions
      .filter(t => t.type === 'Revenue')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const other = transactions
      .filter(t => t.type === 'Other')
      .reduce((sum, t) => sum + t.amount, 0);

    const dashboardData = {
      totalTransactions,
      pendingTransactions,
      totalRevenue,
      totalExpenses,
      chartData: {
        revenue: totalRevenue,
        expenses: totalExpenses,
        pending: transactions
          .filter(t => t.status === 'PENDING')
          .reduce((sum, t) => sum + t.amount, 0),
        other,
      },
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error.message);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}