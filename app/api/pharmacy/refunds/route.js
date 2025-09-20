import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { invoiceId, reason, amount, processedById } = await request.json();
    const refund = await prisma.refund.create({
      data: {
        invoiceId,
        reason,
        amount,
        processedById,
      },
    });
    return Response.json(refund);
  } catch (error) {
    return Response.json({ error: 'Failed to process refund' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
