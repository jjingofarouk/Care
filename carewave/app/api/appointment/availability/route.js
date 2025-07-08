import { NextResponse } from 'next/server';
import { getAvailability, createAvailability } from '../../../appointment/appointmentService';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const doctorId = searchParams.get('doctorId');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    const availability = await getAvailability({ doctorId, startDate, endDate });
    return NextResponse.json(availability);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const availability = await createAvailability(data);
    return NextResponse.json(availability, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}