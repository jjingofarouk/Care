import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const suppliers = await prisma.supplier.findMany();
    return Response.json(suppliers);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch suppliers' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const supplier = await prisma.supplier.create({ data });
    return Response.json(supplier);
  } catch (error) {
    return Response.json({ error: 'Failed to add supplier' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
