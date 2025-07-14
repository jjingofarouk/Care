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
  const patientId = searchParams.get('patientId');
  const doctorId = searchParams.get('doctorId');
  const drugId = searchParams.get('drugId');
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');
  const id = searchParams.get('id');
  const resource = searchParams.get('resource');

  try {
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

    if (resource === 'drugs') {
      const drugs = await prisma.drug.findMany({
        select: { 
          id: true, 
          name: true,
          description: true 
        },
        orderBy: { name: 'asc' }
      });
      return NextResponse.json(drugs);
    }

    if (id) {
      const prescription = await prisma.prescription.findUnique({
        where: { id },
        include: {
          patient: { select: { id: true, firstName: true, lastName: true } },
          doctor: { select: { id: true, firstName: true, lastName: true, department: { select: { name: true } } } },
          drug: { select: { id: true, name: true } }
        }
      });
      if (!prescription) {
        return NextResponse.json({ error: 'Prescription not found' }, { status: 404 });
      }
      const transformedPrescription = {
        ...prescription,
        patient: prescription.patient ? {
          ...prescription.patient,
          name: `${prescription.patient.firstName} ${prescription.patient.lastName}`
        } : null,
        doctor: prescription.doctor ? {
          ...prescription.doctor,
          name: `${prescription.doctor.firstName} ${prescription.doctor.lastName}`
        } : null
      };
      return NextResponse.json(transformedPrescription);
    }

    const prescriptions = await prisma.prescription.findMany({
      where: {
        ...(patientId && { patientId }),
        ...(doctorId && { doctorId }),
        ...(drugId && { drugId }),
        ...(dateFrom && dateTo && {
          prescribedAt: {
            gte: new Date(dateFrom),
            lte: new Date(dateTo),
          }
        })
      },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true } },
        doctor: { select: { id: true, firstName: true, lastName: true, department: { select: { name: true } } } },
        drug: { select: { id: true, name: true } }
      },
      orderBy: { prescribedAt: 'desc' }
    });

    const transformedPrescriptions = prescriptions.map(prescription => ({
      ...prescription,
      patient: prescription.patient ? {
        ...prescription.patient,
        name: `${prescription.patient.firstName} ${prescription.patient.lastName}`
      } : null,
      doctor: prescription.doctor ? {
        ...prescription.doctor,
        name: `${prescription.doctor.firstName} ${prescription.doctor.lastName}`
      } : null
    }));

    return NextResponse.json(transformedPrescriptions);
  } catch (error) {
    console.error('Error in prescriptions API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    
    const prescription = await prisma.prescription.create({
      data: {
        patientId: data.patientId,
        doctorId: data.doctorId,
        drugId: data.drugId,
        dosage: data.dosage,
        prescribedAt: new Date(data.prescribedAt)
      },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true } },
        doctor: { select: { id: true, firstName: true, lastName: true, department: { select: { name: true } } } },
        drug: { select: { id: true, name: true } }
      }
    });

    const transformedPrescription = {
      ...prescription,
      patient: prescription.patient ? {
        ...prescription.patient,
        name: `${prescription.patient.firstName} ${prescription.patient.lastName}`
      } : null,
      doctor: prescription.doctor ? {
        ...prescription.doctor,
        name: `${prescription.doctor.firstName} ${prescription.doctor.lastName}`
      } : null
    };

    return NextResponse.json(transformedPrescription);
  } catch (error) {
    console.error('Error creating prescription:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    
    const prescription = await prisma.prescription.update({
      where: { id: data.id },
      data: {
        patientId: data.patientId,
        doctorId: data.doctorId,
        drugId: data.drugId,
        dosage: data.dosage,
        prescribedAt: new Date(data.prescribedAt)
      },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true } },
        doctor: { select: { id: true, firstName: true, lastName: true, department: { select: { name: true } } } },
        drug: { select: { id: true, name: true } }
      }
    });

    const transformedPrescription = {
      ...prescription,
      patient: prescription.patient ? {
        ...prescription.patient,
        name: `${prescription.patient.firstName} ${prescription.patient.lastName}`
      } : null,
      doctor: prescription.doctor ? {
        ...prescription.doctor,
        name: `${prescription.doctor.firstName} ${prescription.doctor.lastName}`
      } : null
    };

    return NextResponse.json(transformedPrescription);
  } catch (error) {
    console.error('Error updating prescription:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    await prisma.prescription.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Prescription deleted' });
  } catch (error) {
    console.error('Error deleting prescription:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}