import React from 'react';
import { useRouter } from 'next/navigation';
import AppointmentForm from '@/components/appointments/AppointmentForm';
import { createAppointment, getAllAppointments } from '@/services/appointmentService';
import { prisma } from '@/lib/prisma';

export default function NewAppointmentPage() {
  const router = useRouter();

  async function handleCreate(data) {
    await createAppointment({
      patientId: data.patientId,
      doctorId: data.doctorId,
      departmentId: data.departmentId,
      reason: data.reason,
      visitType: data.visitType,
      scheduledAt: new Date(data.scheduledAt),
    });
    router.push('/appointments');
  }

  // We need patients, doctors, departments for the form selects.
  // Because server components can fetch, let's do it with prisma directly here:
  // (You can move this to a helper or API call if you want)

  const [patients, doctors, departments] = await Promise.all([
    prisma.patient.findMany({ select: { id: true, name: true } }),
    prisma.doctor.findMany({ select: { id: true, name: true } }),
    prisma.department.findMany({ select: { id: true, name: true } }),
  ]);

  return (
    <div className="p-6">
      <AppointmentForm
        onSubmit={handleCreate}
        patients={patients}
        doctors={doctors}
        departments={departments}
      />
    </div>
  );
}