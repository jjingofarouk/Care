import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { medicationIds } = await request.json();
    const interactions = await prisma.drugInteraction.findMany({
      where: {
        OR: [
          { medicationId1: { in: medicationIds } },
          { medicationId2: { in: medicationIds } },
        ],
      },
      include: { medication1: true, medication2: true },
    });
    return Response.json(interactions);
  } catch (error) {
    return Response.json({ error: 'Failed to check drug interactions' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
