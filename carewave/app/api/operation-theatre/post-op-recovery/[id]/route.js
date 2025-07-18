import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const postOpRecovery = await prisma.postOpRecovery.findUnique({
      where: { id: params.id },
      include: {
        surgery: {
          include: {
            patient: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
      },
    });

    if (!postOpRecovery) {
      return NextResponse.json({ error: 'Post-op recovery not found' }, { status: 404 });
    }

    return NextResponse.json(postOpRecovery);
  } catch (error) {
    console.error('Error fetching post-op recovery:', error);
    return NextResponse.json({ error: 'Failed to fetch post-op recovery' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();

    const postOpRecovery = await prisma.postOpRecovery.update({
      where: { id: params.id },
      data: {
        recoveryNotes: data.recoveryNotes,
        dischargeDate: data.dischargeDate ? new Date(data.dischargeDate) : null,
        complications: data.complications,
      },
      include: {
        surgery: {
          include: {
            patient: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
      },
    });

    return NextResponse.json(postOpRecovery);
  } catch (error) {
    console.error('Error updating post-op recovery:', error);
    return NextResponse.json({ error: 'Failed to update post-op recovery' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.postOpRecovery.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Post-op recovery deleted successfully' });
  } catch (error) {
    console.error('Error deleting post-op recovery:', error);
    return NextResponse.json({ error: 'Failed to delete post-op recovery' }, { status: 500 });
  }
}
