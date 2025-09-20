import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { medicationId, quantity, reason, adjustedById } = await request.json();
    const medication = await prisma.medication.findUnique({ where: { id: medicationId } });

    const adjustment = await prisma.stockAdjustment.create({
      data: {
        medicationId,
        quantity,
        reason,
        adjustedById,
      },
    });

    await prisma.medication.update({
      where: { id: medicationId },
      data: { stockQuantity: medication.stockQuantity + quantity },
    });

    return Response.json(adjustment);
  } catch (error) {
    return Response.json({ error: 'Failed to add stock adjustment' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
