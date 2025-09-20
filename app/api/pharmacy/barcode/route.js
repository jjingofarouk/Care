// app/api/pharmacy/barcode/route.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const barcode = searchParams.get('barcode');
    const medication = await prisma.medication.findFirst({
      where: { barcode },
      include: { supplier: true, formulary: true },
    });
    return Response.json(medication);
  } catch (error) {
    return Response.json({ error: 'Failed to scan barcode' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
