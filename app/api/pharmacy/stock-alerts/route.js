import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const stockAlerts = await prisma.medication.findMany({
      where: { stockQuantity: { lte: prisma.medication.fields.minStockThreshold } },
    });
    return Response.json(stockAlerts);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch stock alerts' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
