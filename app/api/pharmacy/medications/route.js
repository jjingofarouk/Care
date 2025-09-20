import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const data = await request.json();
    const medication = await prisma.medication.create({ data });
    return Response.json(medication);
  } catch (error) {
    return Response.json({ error: 'Failed to add medication' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
