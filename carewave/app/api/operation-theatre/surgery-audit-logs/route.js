import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  const search = searchParams.get('search') || '';

  try {
    const auditLogs = await prisma.surgeryAuditLog.findMany({
      where: {
        fieldChanged: { contains: search, mode: 'insensitive' },
      },
      include: {
        surgery: {
          select: { id: true, type: true },
        },
        changedBy: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { changedAt: 'desc' },
    });

    const total = await prisma.surgeryAuditLog.count({
      where: {
        fieldChanged: { contains: search, mode: 'insensitive' },
      },
    });

    return NextResponse.json({ auditLogs, total });
  } catch (error) {
    console.error('Error fetching surgery audit logs:', error);
    return NextResponse.json({ error: 'Failed to fetch surgery audit logs' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.surgeryId || !data.changedById || !data.fieldChanged) {
      return NextResponse.json(
        { error: 'Missing required fields: surgeryId, changedById, fieldChanged' },
        { status: 400 }
      );
    }

    const auditLog = await prisma.surgeryAuditLog.create({
      data: {
        surgeryId: data.surgeryId,
        changedById: data.changedById,
        fieldChanged: data.fieldChanged,
        oldValue: data.oldValue,
        newValue: data.newValue,
        changedAt: new Date(),
      },
      include: {
        surgery: {
          select: { id: true, type: true },
        },
        changedBy: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    return NextResponse.json(auditLog, { status: 201 });
  } catch (error) {
    console.error('Error creating surgery audit log:', error);
    return NextResponse.json(
      { error: 'Failed to create surgery audit log' },
      { status: 500 }
    );
  }
}
