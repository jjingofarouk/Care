import { NextResponse } from 'next/server';
import { getQueue, updateQueue } from '../../../appointment/appointmentService';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const doctorId = searchParams.get('doctorId');

  try {
    const queue = await getQueue({ doctorId });
    return NextResponse.json(queue);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const queue = await updateQueue(data.id, { status: data.status });
    return NextResponse.json(queue);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}