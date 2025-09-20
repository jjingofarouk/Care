import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const formularies = await prisma.formulary.findMany({
      include: { medications: true },
    });
    return Response.json(formularies);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch formularies' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const formulary = await prisma.formulary.create({ data });
    return Response.json(formulary);
  } catch (error) {
    return Response.json({ error: 'Failed to add formulary' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
