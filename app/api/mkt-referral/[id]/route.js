import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const referral = await prisma.referral.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!referral) {
      return NextResponse.json({ error: 'Referral not found' }, { status: 404 });
    }
    return NextResponse.json(referral);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch referral' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const referral = await prisma.referral.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(referral);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update referral' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.referral.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Referral deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete referral' }, { status: 500 });
  }
}