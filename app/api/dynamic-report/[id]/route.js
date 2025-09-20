import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const report = await prisma.dynamicReport.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }
    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch report' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const report = await prisma.dynamicReport.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.dynamicReport.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Report deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete report' }, { status: 500 });
  }
}