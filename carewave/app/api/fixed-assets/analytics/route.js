import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const assets = await prisma.fixedAsset.findMany({
      include: {
        depreciationSchedules: true,
      },
    });

    const totalAssets = assets.length;
    const totalCost = assets.reduce((sum, asset) => sum + asset.cost, 0);
    const totalDepreciation = assets.reduce(
      (sum, asset) => sum + asset.depreciationSchedules.reduce((depSum, dep) => depSum + dep.amount, 0),
      0
    );

    const assetsByYear = assets.reduce((acc, asset) => {
      const year = new Date(asset.purchaseDate).getFullYear();
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {});
    const assetsByYearArray = Object.entries(assetsByYear).map(([year, count]) => ({
      year: parseInt(year),
      count,
    }));

    const depreciationByYear = assets.reduce((acc, asset) => {
      asset.depreciationSchedules.forEach((dep) => {
        const year = new Date(dep.depreciationDate).getFullYear();
        acc[year] = (acc[year] || 0) + dep.amount;
      });
      return acc;
    }, {});
    const depreciationByYearArray = Object.entries(depreciationByYear).map(([year, amount]) => ({
      year: parseInt(year),
      amount,
    }));

    const analytics = {
      totalAssets,
      totalCost,
      totalDepreciation,
      assetsByYear: assetsByYearArray,
      depreciationByYear: depreciationByYearArray,
    };

    return NextResponse.json(analytics, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}