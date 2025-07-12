// appointmentService.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllAppointments(filters) {
  return prisma.appointment.findMany({
    where: {
      ...(filters.status && { appointmentStatus: filters.status }),
      ...(filters.doctorId && { doctorId: filters.doctorId }),
      ...(filters.patientId && { patientId: filters.patientId }),
      ...(filters.dateFrom && filters.dateTo && {
        appointmentDate: {
          gte: new Date(filters.dateFrom),
          lte: new Date(filters.dateTo),
        },
      }),
    },
    include: {
      patient: { select: { firstName: true, lastName: true } },
      doctor: { select: { firstName: true, lastName: true, department: { select: { name: true } } } },
      visitType: { select: { name: true } },
      appointmentStatusRecords: true,
    },
    orderBy: { appointmentDate: 'asc' },
  });
}

export async function getAppointmentById(id) {
  return prisma.appointment.findUnique({
    where: { id },
    include: {
      patient: { select: { firstName: true, lastName: true } },
      doctor: { select: { firstName: true, lastName: true, department: { select: { name: true } } } },
      visitType: { select: { name: true } },
      appointmentStatusRecords: { orderBy: { changedAt: 'desc' } },
    },
  });
}

export async function createAppointment(data) {
  return prisma.appointment.create({
    data: {
      patientId: data.patientId,
      doctorId: data.doctorId,
      visitTypeId: data.visitTypeId,
      appointmentDate: new Date(data.appointmentDate),
      appointmentStatus: data.status || 'PENDING',
      appointmentStatusRecords: {
        create: {
          status: data.status || 'PENDING',
          changedAt: new Date(data.appointmentDate),
        },
      },
    },
    include: {
      patient: { select: { firstName: true, lastName: true } },
      doctor: { select: { firstName: true, lastName: true, department: { select: { name: true } } } },
      visitType: { select: { name: true } },
    },
  });
}

export async function updateAppointment(id, data) {
  return prisma.appointment.update({
    where: { id },
    data: {
      ...(data.patientId && { patientId: data.patientId }),
      ...(data.doctorId && { doctorId: data.doctorId }),
      ...(data.visitTypeId && { visitTypeId: data.visitTypeId }),
      ...(data.appointmentDate && { appointmentDate: new Date(data.appointmentDate) }),
      ...(data.status && { 
        appointmentStatus: data.status,
        appointmentStatusRecords: {
          create: {
            status: data.status,
            changedAt: new Date(),
          },
        },
      }),
    },
    include: {
      patient: { select: { firstName: true, lastName: true } },
      doctor: { select: { firstName: true, lastName: true, department: { select: { name: true } } } },
      visitType: { select: { name: true } },
    },
  });
}

export async function deleteAppointment(id) {
  return prisma.appointment.delete({
    where: { id },
  });
}

export async function getPatients() {
  return prisma.patient.findMany({
    select: { id: true, firstName: true, lastName: true },
  });
}

export async function getDoctors() {
  return prisma.doctor.findMany({
    select: { id: true, firstName: true, lastName: true, department: { select: { name: true } } },
  });
}

export async function getVisitTypes() {
  return prisma.visitType.findMany({
    select: { id: true, name: true, description: true },
  });
}

export async function getStatusHistory(appointmentId) {
  return prisma.appointmentStatus.findMany({
    where: { appointmentId },
    orderBy: { changedAt: 'desc' },
  });
}

export async function bulkCreateAppointments(appointments) {
  return prisma.$transaction(
    appointments.map((appt) =>
      prisma.appointment.create({
        data: {
          patientId: appt.patientId,
          doctorId: appt.doctorId,
          visitTypeId: appt.visitTypeId,
          appointmentDate: new Date(appt.appointmentDate),
          appointmentStatus: appt.status || 'PENDING',
          appointmentStatusRecords: {
            create: {
              status: appt.status || 'PENDING',
              changedAt: new Date(appt.appointmentDate),
            },
          },
        },
      })
    )
  );
}