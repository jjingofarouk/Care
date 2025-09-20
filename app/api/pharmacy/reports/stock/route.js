import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange');
    const dateFilter = {
      gte: new Date(new Date().setMonth(new Date().getMonth() - (timeRange === 'monthly' ? 1 : timeRange === 'weekly' ? 0.25 : 12))),
    };
    const report = await prisma.medication.findMany({
      where: { updatedAt: dateFilter },
      select: { name: true, stockQuantity: true, expiryDate: true },
    });
    return Response.json(report);
  } catch (error) {
    return Response.json({ error: 'Failed to generate stock report' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
