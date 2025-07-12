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
    if (!user || !hasPermission(user.role, 'Dashboard')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'week';

    const startDate = new Date();
    if (period === 'week') startDate.setDate(startDate.getDate() - 7);
    else if (period === 'month') startDate.setMonth(startDate.getMonth() - 1);

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: parseInt(params.id),
        createdAt: { gte: startDate },
      },
    });

    const patientsToday = await prisma.appointment.count({
      where: {
        doctorId: parseInt(params.id),
        date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    });

    const admissions = await prisma.appointment.count({
      where: {
        doctorId: parseInt(params.id),
        createdAt: { gte: startDate },
        patient: { type: 'Inpatient' },
      },
    });

    const avgConsultTime = appointments.length
      ? appointments.reduce((sum, appt) => sum + (appt.status === 'Seen' ? 15 : 0), 0) / appointments.length
      : 0;

    return NextResponse.json({
      patientsToday,
      admissions,
      avgConsultTime: Math.round(avgConsultTime),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch performance summary' }, { status: 500 });
  }
}