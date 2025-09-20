import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
  try {
    const { stockQuantity } = await request.json();
    const medication = await prisma.medication.update({
      where: { id: parseInt(params.id) },
      data: { stockQuantity },
    });
    return Response.json(medication);
  } catch (error) {
    return Response.json({ error: 'Failed to update stock' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
