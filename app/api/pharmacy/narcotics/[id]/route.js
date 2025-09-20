import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const narcotic = await prisma.medication.findFirst({
      where: { id: parseInt(params.id), narcotic: true },
      include: { dispensingRecords: true, stockAdjustments: true },
    });
    return Response.json(narcotic);
  } catch (error) {
    return Response.json({ error: 'Failed to track narcotic' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
