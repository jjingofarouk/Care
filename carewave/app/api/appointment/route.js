import { NextResponse } from 'next/server';
import { getAppointments, createAppointment, getPatients, getDoctors, getDepartments, getAvailability, createAvailability, getQueue } from '../../appointment/appointmentService';
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

export async function GET(request) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const status = searchParams.get('status');
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');
  const doctorId = searchParams.get('doctorId');
  const patientId = searchParams.get('patientId');

  try {
    if (searchParams.get('resource') === 'patients') {
      const patients = await getPatients();
      return NextResponse.json(patients);
    }
    if (searchParams.get('resource') === 'doctors') {
      const doctors = await getDoctors();
      return NextResponse.json(doctors);
    }
    if (searchParams.get('resource') === 'departments') {
      const departments = await getDepartments();
      return NextResponse.json(departments);
    }
    if (searchParams.get('resource') === 'availability') {
      const availability = await getAvailability({ doctorId });
      return NextResponse.json(availability);
    }
    if (searchParams.get('resource') === 'queue') {
      const queue = await getQueue({ doctorId });
      return NextResponse.json(queue);
    }
    const appointments = await getAppointments({ status, type, dateFrom, dateTo, doctorId, patientId });
    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    if (data.resource === 'appointment') {
      const appointment = await createAppointment({ ...data, bookedById: user.id });
      return NextResponse.json(appointment);
    }
    if (data.resource === 'availability') {
      const availability = await createAvailability(data);
      return NextResponse.json(availability);
    }
    return NextResponse.json({ error: 'Invalid resource' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}