import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const departments = await prisma.department.findMany();
    return NextResponse.json(departments);
  } catch (error) {
    console.error('GET /api/department error:', error);
    return NextResponse.json({ error: 'Failed to fetch departments', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    if (!data.name) {
      return NextResponse.json({ error: 'Missing required field: name' }, { status: 400 });
    }

    const department = await prisma.department.create({
      data: {
        name: data.name,
        description: data.description || null,
      },
    });

    return NextResponse.json(department, { status: 201 });
  } catch (error) {
    console.error('POST /api/department error:', error);
    return NextResponse.json({ error: 'Failed to create department', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
