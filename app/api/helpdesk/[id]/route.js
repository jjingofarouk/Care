import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const ticket = await prisma.helpdeskTicket.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!ticket) {
      return NextResponse.json({ error: 'Helpdesk ticket not found' }, { status: 404 });
    }
    return NextResponse.json(ticket);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch helpdesk ticket' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const ticket = await prisma.helpdeskTicket.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(ticket);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update helpdesk ticket' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.helpdeskTicket.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Helpdesk ticket deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete helpdesk ticket' }, { status: 500 });
  }
}