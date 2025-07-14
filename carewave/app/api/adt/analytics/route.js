// app/api/adt/analytics/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { subDays, startOfDay, endOfDay } from 'date-fns';

const prisma = new PrismaClient();

const authenticate = (request) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

export async function GET(request) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const dateFrom = searchParams.get('dateFrom') || subDays(new Date(), 30);
  const dateTo = searchParams.get('dateTo') || new Date();

  try {
    const [admissions, discharges, transfers, wards, beds] = await Promise.all([
      prisma.admission.groupBy({
        by: ['admissionDate'],
        where: { admissionDate: { gte: new Date(dateFrom), lte: new Date(dateTo) } },
        _count: { id: true },
      }),
      prisma.discharge.groupBy({
        by: ['dischargeDate', 'admissionId'],
        where: { dischargeDate: { gte: new Date(dateFrom), lte: new Date(dateTo) } },
        _count: { id: true },
      }),
      prisma.transfer.groupBy({
        by: ['transferDate'],
        where: { transferDate: { gte: new Date(dateFrom), lte: new Date(dateTo) } },
        _count: { id: true },
      }),
      prisma.ward.findMany({
        include: {
          beds: { select: { id: true, isOccupied: true } },
          admissions: {
            where: { discharge: { none: {} } },
            select: { id: true },
          },
        },
      }),
      prisma.bed.count(),
    ]);

    const admissionsByDate = admissions.map(item => ({
      date: startOfDay(new Date(item.admissionDate)).toISOString(),
      count: item._count.id,
    }));

    const dischargesByWard = await prisma.discharge.groupBy({
      by: ['admissionId'],
      where: { dischargeDate: { gte: new Date(dateFrom), lte: new Date(dateTo) } },
      _count: { id: true },
    }).then(async (data) => {
      const wardCounts = {};
      for (const discharge of data) {
        const admission = await prisma.admission.findUnique({
          where: { id: discharge.admissionId },
          select: { ward: { select: { name: true } } },
        });
        const wardName = admission.ward.name;
        wardCounts[wardName] = (wardCounts[wardName] || 0) + discharge._count.id;
      }
      return Object.entries(wardCounts).map(([name, count]) => ({ ward: name, count }));
    });

    const transfersByDate = transfers.map(item => ({
      date: startOfDay(new Date(item.transferDate)).toISOString(),
      count: item._count.id,
    }));

    const occupancyByWard = wards.map(ward => ({
      ward: ward.name,
      totalBeds: ward.beds.length,
      occupiedBeds: ward.beds.filter(bed => bed.isOccupied).length,
      currentAdmissions: ward.admissions.length,
    }));

    const stats = {
      totalAdmissions: await prisma.admission.count({ where: { discharge: { none: {} } } }),
      totalDischargesThisMonth: await prisma.discharge.count({
        where: { dischargeDate: { gte: subDays(new Date(), 30), lte: new Date() } },
      }),
      totalBeds,
      availableBeds: beds - (await prisma.bed.count({ where: { isOccupied: true } })),
    };

    return NextResponse.json({
      admissionsByDate,
      dischargesByWard,
      transfersByDate,
      occupancyByWard,
      stats,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}