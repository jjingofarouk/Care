import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const supplier = await prisma.supplier.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return Response.json(supplier);
  } catch (error) {
    return Response.json({ error: 'Failed to update supplier' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request, { params }) {
  try {
    const supplier = await prisma.supplier.delete({
      where: { id: parseInt(params.id) },
    });
    return Response.json(supplier);
  } catch (error) {
    return Response.json({ error: 'Failed to delete supplier' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
