import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const clinicalSettings = await prisma.clinicalSetting.findMany();
    return NextResponse.json(clinicalSettings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch clinical settings' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const clinicalSetting = await prisma.clinicalSetting.create({ data });
    return NextResponse.json(clinicalSetting, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create clinical setting' }, { status: 500 });
  }
}