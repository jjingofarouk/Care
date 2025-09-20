import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request, { params }) {
  try {
    const medication = await prisma.medication.delete({
      where: { id: parseInt(params.id) },
    });
    return Response.json(medication);
  } catch (error) {
    return Response.json({ error: 'Failed to delete medication' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
