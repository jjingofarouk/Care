import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const audits = await prisma.assetAudit.findMany();
    return NextResponse.json(audits, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch asset audits' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const audit = await prisma.assetAudit.create({
      data: {
        fixedAssetId: data.fixedAssetId,
        auditDate: new Date(data.auditDate),
        findings: data.findings,
      },
    });
    return NextResponse.json(audit, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create asset audit' }, { status: 500 });
  }
}