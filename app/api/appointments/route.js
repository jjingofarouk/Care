import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

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
  const status = searchParams.get('status');
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');
  const doctorId = searchParams.get('doctorId');
  const patientId = searchParams.get('patientId');
  const resource = searchParams.get('resource');
  const id = searchParams.get('id');
  const appointmentId = searchParams.get('appointmentId');

  try {
    if (resource === 'stats') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Build where clause based on filters
      const whereClause = {
        ...(status && { appointmentStatus: status }),
        ...(doctorId && { doctorId }),
        ...(patientId && { patientId }),
        ...(dateFrom && dateTo && {
          appointmentDate: {
            gte: new Date(dateFrom),
            lte: new Date(dateTo),
          },
        }),
      };

      // Fetch appointments with necessary relations
      const appointments = await prisma.appointment.findMany({
        where: whereClause,
        include: {
          patient: { select: { id: true, firstName: true, lastName: true } },
          doctor: { select: { id: true, firstName: true, lastName: true, department: { select: { name: true } } } },
          visitType: { select: { id: true, name: true } },
        },
      });

      // Calculate statistics
      const statusCounts = appointments.reduce(
        (acc, appt) => {
          const status = appt.appointmentStatus?.toLowerCase() || 'pending';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        },
        { pending: 0, confirmed: 0, cancelled: 0, completed: 0 }
      );

      const todayAppointments = appointments.filter(appt => 
        new Date(appt.appointmentDate) >= today
      ).length;

      const thisWeekAppointments = appointments.filter(appt => 
        new Date(appt.appointmentDate) >= thisWeek
      ).length;

      const thisMonthAppointments = appointments.filter(appt => 
        new Date(appt.appointmentDate) >= thisMonth
      ).length;

      const departmentCounts = appointments.reduce((acc, appt) => {
        const dept = appt.doctor?.department?.name || 'Unknown';
        acc[dept] = (acc[dept] || 0) + 1;
        return acc;
      }, {});
      const topDepartments = Object.entries(departmentCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

      const visitTypeCounts = appointments.reduce((acc, appt) => {
        const visitType = appt.visitType?.name || 'Unknown';
        acc[visitType] = (acc[visitType] || 0) + 1;
        return acc;
      }, {});
      const topVisitTypes = Object.entries(visitTypeCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

      const doctorCounts = appointments.reduce((acc, appt) => {
        if (appt.doctor) {
          const doctorName = `${appt.doctor.firstName} ${appt.doctor.lastName}`;
          acc[doctorName] = (acc[doctorName] || 0) + 1;
        }
        return acc;
      }, {});
      const topDoctors = Object.entries(doctorCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

      const totalAppointments = appointments.length;
      const completionRate = totalAppointments > 0 ? 
        ((statusCounts.completed / totalAppointments) * 100).toFixed(1) : 0;
      const cancellationRate = totalAppointments > 0 ? 
        ((statusCounts.cancelled / totalAppointments) * 100).toFixed(1) : 0;

      const weeklyDistribution = Array.from({ length: 7 }, (_, i) => {
        const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i];
        const count = appointments.filter(appt => 
          new Date(appt.appointmentDate).getDay() === i
        ).length;
        return { day: dayName, count };
      });

      const monthlyTrend = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        const count = appointments.filter(appt => {
          const apptDate = new Date(appt.appointmentDate);
          return apptDate.getMonth() === date.getMonth() && 
                 apptDate.getFullYear() === date.getFullYear();
        }).length;
        return { month: monthName, count };
      }).reverse();

      const timeSlotDistribution = appointments.reduce((acc, appt) => {
        const hour = new Date(appt.appointmentDate).getHours();
        let timeSlot;
        if (hour < 6) timeSlot = 'Early Morning (12-6 AM)';
        else if (hour < 12) timeSlot = 'Morning (6-12 PM)';
        else if (hour < 17) timeSlot = 'Afternoon (12-5 PM)';
        else timeSlot = 'Evening (5-11 PM)';
        acc[timeSlot] = (acc[timeSlot] || 0) + 1;
        return acc;
      }, {});

      const avgAppointmentsPerDay = totalAppointments > 0 ? 
        Math.round(totalAppointments / 30) : 0;

      // Calculate trend percentages
      const lastMonthCount = monthlyTrend[1]?.count || 0;
      const thisMonthCount = monthlyTrend[0]?.count || 0;
      const monthTrend = lastMonthCount > 0 ? 
        ((thisMonthCount - lastMonthCount) / lastMonthCount * 100).toFixed(1) : '0';

      const lastWeekCount = appointments.filter(appt => {
        const apptDate = new Date(appt.appointmentDate);
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        return apptDate >= twoWeeksAgo && apptDate < thisWeek;
      }).length;
      const weekTrend = lastWeekCount > 0 ? 
        ((thisWeekAppointments - lastWeekCount) / lastWeekCount * 100).toFixed(1) : '0';

      return NextResponse.json({
        pending: statusCounts.pending,
        confirmed: statusCounts.confirmed,
        cancelled: statusCounts.cancelled,
        completed: statusCounts.completed,
        totalAppointments,
        todayAppointments,
        thisWeekAppointments,
        thisMonthAppointments,
        topDepartments,
        topVisitTypes,
        topDoctors,
        avgAppointmentsPerDay,
        completionRate: parseFloat(completionRate),
        cancellationRate: parseFloat(cancellationRate),
        monthlyTrend,
        weeklyDistribution,
        timeSlotDistribution: Object.entries(timeSlotDistribution)
          .map(([slot, count]) => ({ slot, count })),
        monthTrend: parseFloat(monthTrend),
        weekTrend: parseFloat(weekTrend),
      });
    }

    if (resource === 'patients') {
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
      const transformedPatients = patients.map(patient => ({
        id: patient.id,
        name: `${patient.firstName} ${patient.lastName}`,
        firstName: patient.firstName,
        lastName: patient.lastName
      }));
      return NextResponse.json(transformedPatients);
    }
    
    if (resource === 'doctors') {
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
      const transformedDoctors = doctors.map(doctor => ({
        id: doctor.id,
        name: `${doctor.firstName} ${doctor.lastName}`,
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        department: doctor.department
      }));
      return NextResponse.json(transformedDoctors);
    }
    
    if (resource === 'visitTypes') {
      const visitTypes = await prisma.visitType.findMany({
        select: { id: true, name: true, description: true },
        orderBy: { name: 'asc' }
      });
      return NextResponse.json(visitTypes);
    }
    
    if (resource === 'statusHistory' && appointmentId) {
      const history = await prisma.appointmentStatus.findMany({
        where: { appointmentId },
        orderBy: { changedAt: 'desc' },
      });
      return NextResponse.json(history);
    }
    
    if (id) {
      const appointment = await prisma.appointment.findUnique({
        where: { id },
        include: {
          patient: { select: { id: true, firstName: true, lastName: true } },
          doctor: { select: { id: true, firstName: true, lastName: true, department: { select: { name: true } } } },
          visitType: { select: { id: true, name: true } },
          appointmentStatusRecords: { orderBy: { changedAt: 'desc' } },
        },
      });
      if (!appointment) {
        return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
      }
      const transformedAppointment = {
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
      return NextResponse.json(transformedAppointment);
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        ...(status && { appointmentStatus: status }),
        ...(doctorId && { doctorId }),
        ...(patientId && { patientId }),
        ...(dateFrom && dateTo && {
          appointmentDate: {
            gte: new Date(dateFrom),
            lte: new Date(dateTo),
          },
        }),
      },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true } },
        doctor: { select: { id: true, firstName: true, lastName: true, department: { select: { name: true } } } },
        visitType: { select: { id: true, name: true } },
      },
      orderBy: { appointmentDate: 'asc' },
    });

    const transformedAppointments = appointments.map(appointment => ({
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

    return NextResponse.json(transformedAppointments);
  } catch (error) {
    console.error('Error in appointments API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    
    if (data.resource === 'appointment') {
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
          patient: { select: { id: true, firstName: true, lastName: true } },
          doctor: { select: { id: true, firstName: true, lastName: true, department: { select: { name: true } } } },
          visitType: { select: { id: true, name: true } },
        },
      });
      const transformedAppointment = {
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
      return NextResponse.json(transformedAppointment);
    }
    
    if (data.resource === 'visitType') {
      const visitType = await prisma.visitType.create({
        data: {
          name: data.name,
          description: data.description,
        },
      });
      return NextResponse.json(visitType);
    }
    
    return NextResponse.json({ error: 'Invalid resource' }, { status: 400 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    
    if (data.resource === 'visitType') {
      const visitType = await prisma.visitType.update({
        where: { id: data.id },
        data: {
          name: data.name,
          description: data.description,
        },
      });
      return NextResponse.json(visitType);
    }
    
    const appointment = await prisma.appointment.update({
      where: { id: data.id },
      data: {
        patientId: data.patientId,
        doctorId: data.doctorId,
        visitTypeId: data.visitTypeId,
        appointmentDate: new Date(data.appointmentDate),
        appointmentStatus: data.status,
        appointmentStatusRecords: {
          create: {
            status: data.status,
            changedAt: new Date(),
          },
        },
      },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true } },
        doctor: { select: { id: true, firstName: true, lastName: true, department: { select: { name: true } } } },
        visitType: { select: { id: true, name: true } },
      },
    });
    
    const transformedAppointment = {
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
    
    return NextResponse.json(transformedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const resource = searchParams.get('resource');
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    if (resource === 'visitType') {
      await prisma.visitType.delete({
        where: { id },
      });
      return NextResponse.json({ message: 'Visit type deleted' });
    }

    await prisma.appointment.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: 'Appointment deleted' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}