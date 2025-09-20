import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
  try {
    const { status } = await request.json();
    const order = await prisma.purchaseOrder.update({
      where: { id: parseInt(params.id) },
      data: { status },
    });
    return Response.json(order);
  } catch (error) {
    return Response.json({ error: 'Failed to update order status' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
