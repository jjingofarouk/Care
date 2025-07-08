import { NextResponse } from 'next/server';
import { createDepartment, getDepartments } from '../../../appointment/appointmentService';

export async function GET() {
  try {
    const departments = await getDepartments();
    return NextResponse.json(departments);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const department = await createDepartment(data);
    return NextResponse.json(department, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}