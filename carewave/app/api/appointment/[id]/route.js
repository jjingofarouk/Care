import { NextResponse } from 'next/server';
import { getAppointment, updateAppointment, updateQueue } from '@/services/appointmentService';
import jwt from 'jsonwebtoken';

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

export async function GET(request, { params }) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const appointment = await getAppointment(params.id);
    if (!appointment) return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    return NextResponse.json(appointment);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    if (data.resource === 'appointment') {
      const appointment = await updateAppointment(params.id, data);
      return NextResponse.json(appointment);
    }
    if (data.resource === 'queue') {
      const queue = await updateQueue(params.id, data);
      return NextResponse.json(queue);
    }
    return NextResponse.json({ error: 'Invalid resource' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}