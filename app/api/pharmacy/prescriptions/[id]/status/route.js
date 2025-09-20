import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
  try {
    const { status } = await request.json();
    const prescription = await prisma.prescription.update({
      where: { id: parseInt(params.id) },
      data: { status },
    });
    return Response.json(prescription);
  } catch (error) {
    return Response.json({ error: 'Failed to update prescription status' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
