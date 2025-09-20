import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const claim = await prisma.claim.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!claim) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
    }
    return NextResponse.json(claim);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch claim' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const claim = await prisma.claim.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(claim);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update claim' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.claim.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Claim deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete claim' }, { status: 500 });
  }
}