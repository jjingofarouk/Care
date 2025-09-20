// appointmentService.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllAppointments(filters = {}) {
  try {
    const appointments = await prisma.appointment.findMany({
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
        patient: { 
          select: { 
            id: true,
            firstName: true, 
            lastName: true 
          } 
        },
        doctor: { 
          select: { 
            id: true,
            firstName: true, 
            lastName: true, 
            department: { 
              select: { name: true } 
            } 
          } 
        },
        visitType: { 
          select: { 
            id: true,
            name: true 
          } 
        },
        appointmentStatusRecords: { 
          orderBy: { changedAt: 'desc' } 
        },
      },
      orderBy: { appointmentDate: 'asc' },
    });

    // Transform the data to include full names
    return appointments.map(appointment => ({
      ...appointment,
      patient: appointment.patient ? {
        ...appointment.patient,
        name: `${appointment.patient.firstName} ${appointment.patient.lastName}`
      } : null,
      doctor: appointment.doctor ? {
        ...appointment.doctor,
        name: `${appointment.doctor.firstName} ${appointment.doctor.lastName}`
      } : null
    }));
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
}

export async function getAppointmentById(id) {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: { 
          select: { 
            id: true,
            firstName: true, 
            lastName: true 
          } 
        },
        doctor: { 
          select: { 
            id: true,
            firstName: true, 
            lastName: true, 
            department: { 
              select: { name: true } 
            } 
          } 
        },
        visitType: { 
          select: { 
            id: true,
            name: true 
          } 
        },
        appointmentStatusRecords: { 
          orderBy: { changedAt: 'desc' } 
        },
      },
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    // Transform the data to include full names
    return {
      ...appointment,
      patient: appointment.patient ? {
        ...appointment.patient,
        name: `${appointment.patient.firstName} ${appointment.patient.lastName}`
      } : null,
      doctor: appointment.doctor ? {
        ...appointment.doctor,
        name: `${appointment.doctor.firstName} ${appointment.doctor.lastName}`
      } : null
    };
  } catch (error) {
    console.error('Error fetching appointment:', error);
    throw error;
  }
}

export async function createAppointment(data) {
  try {
    const appointment = await prisma.appointment.create({
      data: {
        patientId: data.patientId,
        doctorId: data.doctorId,
        visitTypeId: data.visitTypeId,
        appointmentDate: new Date(data.appointmentDate),
        appointmentStatus: data.status || 'PENDING',
        appointmentStatusRecords: {
          create: {
            status: data.status || 'PENDING',
            changedAt: new Date(),
          },
        },
      },
      include: {
        patient: { 
          select: { 
            id: true,
            firstName: true, 
            lastName: true 
          } 
        },
        doctor: { 
          select: { 
            id: true,
            firstName: true, 
            lastName: true, 
            department: { 
              select: { name: true } 
            } 
          } 
        },
        visitType: { 
          select: { 
            id: true,
            name: true 
          } 
        },
      },
    });

    // Transform the data to include full names
    return {
      ...appointment,
      patient: appointment.patient ? {
        ...appointment.patient,
        name: `${appointment.patient.firstName} ${appointment.patient.lastName}`
      } : null,
      doctor: appointment.doctor ? {
        ...appointment.doctor,
        name: `${appointment.doctor.firstName} ${appointment.doctor.lastName}`
      } : null
    };
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
}

export async function updateAppointment(id, data) {
  try {
    const appointment = await prisma.appointment.update({
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
        patient: { 
          select: { 
            id: true,
            firstName: true, 
            lastName: true 
          } 
        },
        doctor: { 
          select: { 
            id: true,
            firstName: true, 
            lastName: true, 
            department: { 
              select: { name: true } 
            } 
          } 
        },
        visitType: { 
          select: { 
            id: true,
            name: true 
          } 
        },
      },
    });

    // Transform the data to include full names
    return {
      ...appointment,
      patient: appointment.patient ? {
        ...appointment.patient,
        name: `${appointment.patient.firstName} ${appointment.patient.lastName}`
      } : null,
      doctor: appointment.doctor ? {
        ...appointment.doctor,
        name: `${appointment.doctor.firstName} ${appointment.doctor.lastName}`
      } : null
    };
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
}

export async function deleteAppointment(id) {
  try {
    return await prisma.appointment.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
}

export async function getPatients() {
  try {
    const patients = await prisma.patient.findMany({
      select: { 
        id: true, 
        firstName: true, 
        lastName: true 
      },
      orderBy: [
        { firstName: 'asc' },
        { lastName: 'asc' }
      ]
    });

    // Transform data to include full name
    return patients.map(patient => ({
      id: patient.id,
      name: `${patient.firstName} ${patient.lastName}`,
      firstName: patient.firstName,
      lastName: patient.lastName
    }));
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
}

export async function getDoctors() {
  try {
    const doctors = await prisma.doctor.findMany({
      select: { 
        id: true, 
        firstName: true, 
        lastName: true, 
        department: { 
          select: { name: true } 
        } 
      },
      orderBy: [
        { firstName: 'asc' },
        { lastName: 'asc' }
      ]
    });

    // Transform data to include full name
    return doctors.map(doctor => ({
      id: doctor.id,
      name: `${doctor.firstName} ${doctor.lastName}`,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      department: doctor.department
    }));
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
}

export async function getVisitTypes() {
  try {
    return await prisma.visitType.findMany({
      select: { 
        id: true, 
        name: true, 
        description: true 
      },
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.error('Error fetching visit types:', error);
    throw error;
  }
}

export async function getStatusHistory(appointmentId) {
  try {
    return await prisma.appointmentStatus.findMany({
      where: { appointmentId },
      orderBy: { changedAt: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching status history:', error);
    throw error;
  }
}

export async function bulkCreateAppointments(appointments) {
  try {
    const createdAppointments = await prisma.$transaction(
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
                changedAt: new Date(),
              },
            },
          },
          include: {
            patient: { 
              select: { 
                id: true,
                firstName: true, 
                lastName: true 
              } 
            },
            doctor: { 
              select: { 
                id: true,
                firstName: true, 
                lastName: true, 
                department: { 
                  select: { name: true } 
                } 
              } 
            },
            visitType: { 
              select: { 
                id: true,
                name: true 
              } 
            },
          },
        })
      )
    );

    // Transform the data to include full names
    return createdAppointments.map(appointment => ({
      ...appointment,
      patient: appointment.patient ? {
        ...appointment.patient,
        name: `${appointment.patient.firstName} ${appointment.patient.lastName}`
      } : null,
      doctor: appointment.doctor ? {
        ...appointment.doctor,
        name: `${appointment.doctor.firstName} ${appointment.doctor.lastName}`
      } : null
    }));
  } catch (error) {
    console.error('Error bulk creating appointments:', error);
    throw error;
  }
}

// Statistics and analytics functions
export async function getAppointmentStats(filters = {}) {
  try {
    const where = {
      ...(filters.doctorId && { doctorId: filters.doctorId }),
      ...(filters.patientId && { patientId: filters.patientId }),
      ...(filters.dateFrom && filters.dateTo && {
        appointmentDate: {
          gte: new Date(filters.dateFrom),
          lte: new Date(filters.dateTo),
        },
      }),
    };

    const [total, pending, confirmed, cancelled, completed] = await Promise.all([
      prisma.appointment.count({ where }),
      prisma.appointment.count({ where: { ...where, appointmentStatus: 'PENDING' } }),
      prisma.appointment.count({ where: { ...where, appointmentStatus: 'CONFIRMED' } }),
      prisma.appointment.count({ where: { ...where, appointmentStatus: 'CANCELLED' } }),
      prisma.appointment.count({ where: { ...where, appointmentStatus: 'COMPLETED' } }),
    ]);

    return {
      total,
      pending,
      confirmed,
      cancelled,
      completed,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      cancellationRate: total > 0 ? (cancelled / total) * 100 : 0,
    };
  } catch (error) {
    console.error('Error fetching appointment stats:', error);
    throw error;
  }
}

export async function getUpcomingAppointments(limit = 10) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        appointmentDate: {
          gte: new Date(),
        },
        appointmentStatus: {
          in: ['PENDING', 'CONFIRMED']
        }
      },
      include: {
        patient: { 
          select: { 
            id: true,
            firstName: true, 
            lastName: true 
          } 
        },
        doctor: { 
          select: { 
            id: true,
            firstName: true, 
            lastName: true, 
            department: { 
              select: { name: true } 
            } 
          } 
        },
        visitType: { 
          select: { 
            id: true,
            name: true 
          } 
        },
      },
      orderBy: { appointmentDate: 'asc' },
      take: limit,
    });

    // Transform the data to include full names
    return appointments.map(appointment => ({
      ...appointment,
      patient: appointment.patient ? {
        ...appointment.patient,
        name: `${appointment.patient.firstName} ${appointment.patient.lastName}`
      } : null,
      doctor: appointment.doctor ? {
        ...appointment.doctor,
        name: `${appointment.doctor.firstName} ${appointment.doctor.lastName}`
      } : null
    }));
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    throw error;
  }
}

// Default export
const appointmentService = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getPatients,
  getDoctors,
  getVisitTypes,
  getStatusHistory,
  bulkCreateAppointments,
  getAppointmentStats,
  getUpcomingAppointments,
};

export default appointmentService;