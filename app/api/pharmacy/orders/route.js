import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const orders = await prisma.purchaseOrder.findMany({
      include: { supplier: true, items: { include: { medication: true } } },
    });
    return Response.json(orders);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch orders' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const order = await prisma.purchaseOrder.create({
      data: {
        ...data,
        items: { create: data.items },
      },
      include: { items: true },
    });
    return Response.json(order);
  } catch (error) {
    return Response.json({ error: 'Failed to create order' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
