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
    // Handle resource-specific requests
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
      
      // Transform data to include full name
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
      
      // Transform data to include full name
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
    
    // Handle single appointment request
    if (id) {
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
        return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
      }
      
      // Transform the appointment data
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

    // Handle appointments list request
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
    });

    // Transform the appointments data
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
      
      // Transform the created appointment
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
    
    // Handle appointment update
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
    
    // Transform the updated appointment
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

    // Delete appointment and its status records
    await prisma.appointment.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: 'Appointment deleted' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}