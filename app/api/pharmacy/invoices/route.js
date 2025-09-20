import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const data = await request.json();
    const invoice = await prisma.invoice.create({
      data: {
        prescriptionId: data.prescriptionId,
        totalAmount: data.totalAmount,
        status: data.status || 'PENDING',
        paymentMethod: data.paymentMethod,
        transaction: data.transactionId ? { connect: { id: data.transactionId } } : undefined,
      },
    });
    return Response.json(invoice);
  } catch (error) {
    return Response.json({ error: 'Failed to create invoice' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
