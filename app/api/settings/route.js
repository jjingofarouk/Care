import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const setting = await prisma.setting.create({ data });
    return NextResponse.json(setting, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create setting' }, { status: 500 });
  }
}