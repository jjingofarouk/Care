import React from 'react';
import { useRouter } from 'next/navigation';
import AppointmentForm from '@/components/appointments/AppointmentForm';
import { getAppointmentById, updateAppointment } from '@/services/appointmentService';
import { prisma } from '@/lib/prisma';

export default async function EditAppointmentPage({ params }) {
  const router = useRouter();
  const appointment = await getAppointmentById(params.id);

  const [patients, doctors, departments] = await Promise.all([
    prisma.patient.findMany({ select: { id: true, name: true } }),
    prisma.doctor.findMany({ select: { id: true, name: true } }),
    prisma.department.findMany({ select: { id: true, name: true } }),
  ]);

  async function handleUpdate(data) {
    await updateAppointment(params.id, {
      patientId: data.patientId,
      doctorId: data.doctorId,
      departmentId: data.departmentId,
      reason: data.reason,
      visitType: data.visitType,
      scheduledAt: new Date(data.scheduledAt),
    });
    router.push('/appointments');
  }

  if (!appointment) {
    return <p>Appointment not found</p>;
  }

  return (
    <div className="p-6">
      <AppointmentForm
        onSubmit={handleUpdate}
        initialData={{
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
          departmentId: appointment.departmentId,
          reason: appointment.reason,
          visitType: appointment.visitType,
          scheduledAt: appointment.scheduledAt.toISOString().slice(0, 16), // datetime-local format
        }}
        patients={patients}
        doctors={doctors}
        departments={departments}
      />
    </div>
  );
}