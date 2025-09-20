import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const tickets = await prisma.helpdeskTicket.findMany();
    return NextResponse.json(tickets);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch helpdesk tickets' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const ticket = await prisma.helpdeskTicket.create({ data });
    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create helpdesk ticket' }, { status: 500 });
  }
}