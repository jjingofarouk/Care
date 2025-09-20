import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getUser, isAuthenticated } from '../../../../auth';

const prisma = new PrismaClient();

const hasPermission = (role, feature) => {
  const rolePermissions = {
    PATIENT: ['Dashboard', 'Appointments', 'Medical Records', 'Billing'],
    DOCTOR: ['Dashboard', 'Patients', 'Appointments', 'Clinical', 'Operation Theatre'],
    NURSE: ['Dashboard', 'Patients', 'Appointments', 'Nursing', 'Maternity'],
    LAB_TECHNICIAN: ['Dashboard', 'Laboratory', 'Radiology'],
    STAFF: ['Dashboard', 'Helpdesk', 'Inventory', 'Procurement'],
    ADMIN: [
      'Dashboard',
      'Patients',
      'Appointments',
      'Accounting',
      'ADT',
      'Billing',
      'Claim Management',
      'Clinical',
      'Clinical Settings',
      'CSSD',
      'Dispensary',
      'Doctor',
      'Dynamic Report',
      'Emergency',
      'Fixed Assets',
      'Helpdesk',
      'Incentive',
      'Inventory',
      'Laboratory',
      'Maternity',
      'Medical Records',
      'Marketing Referral',
      'NHIF',
      'Nursing',
      'Operation Theatre',
      'Pharmacy',
      'Procurement',
      'Queue Management',
      'Radiology',
      'Reports',
      'Settings',
      'Social Service',
      'Substore',
      'System Admin',
      'Utilities',
      'Vaccination',
      'Verification',
    ],
  };

  return rolePermissions[role]?.includes(feature) || false;
};

export async function GET(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token || !isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = getUser();
    if (!user || !hasPermission(user.role, 'Clinical')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prescriptions = await prisma.prescription.findMany({
      where: { doctorId: parseInt(params.id) },
      include: { patient: { include: { user: { select: { name: true } } } } },
    });
    return NextResponse.json(prescriptions);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch prescriptions' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token || !isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = getUser();
    if (!user || !hasPermission(user.role, 'Clinical')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const prescription = await prisma.prescription.create({
      data: {
        doctorId: parseInt(params.id),
        ...data,
      },
    });
    return NextResponse.json(prescription, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create prescription' }, { status: 500 });
  }
}