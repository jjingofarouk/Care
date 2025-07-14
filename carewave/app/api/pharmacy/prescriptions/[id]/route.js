// app/api/pharmacy/prescriptions/[id]/route.js
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

export async function GET(request, { params }) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Prescription ID is required' }, { status: 400 });
    }

    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: {
        patient: { 
          select: { 
            id: true, 
            firstName: true, 
            lastName: true,
            email: true,
            phone: true,
            dateOfBirth: true,
            gender: true
          } 
        },
        doctor: { 
          select: { 
            id: true, 
            firstName: true, 
            lastName: true, 
            department: { 
              select: { 
                id: true,
                name: true 
              } 
            } 
          } 
        },
        drug: { 
          select: { 
            id: true, 
            name: true,
            description: true 
          } 
        }
      }
    });

    if (!prescription) {
      return NextResponse.json({ error: 'Prescription not found' }, { status: 404 });
    }

    // Transform the data to include computed fields
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
    console.error('Error fetching prescription:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = params;
    const data = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Prescription ID is required' }, { status: 400 });
    }

    // Validate required fields
    const requiredFields = ['patientId', 'doctorId', 'drugId', 'dosage', 'prescribedAt'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // Check if prescription exists
    const existingPrescription = await prisma.prescription.findUnique({
      where: { id }
    });

    if (!existingPrescription) {
      return NextResponse.json({ error: 'Prescription not found' }, { status: 404 });
    }

    // Update the prescription
    const prescription = await prisma.prescription.update({
      where: { id },
      data: {
        patientId: data.patientId,
        doctorId: data.doctorId,
        drugId: data.drugId,
        dosage: data.dosage,
        prescribedAt: new Date(data.prescribedAt)
      },
      include: {
        patient: { 
          select: { 
            id: true, 
            firstName: true, 
            lastName: true,
            email: true,
            phone: true
          } 
        },
        doctor: { 
          select: { 
            id: true, 
            firstName: true, 
            lastName: true, 
            department: { 
              select: { 
                id: true,
                name: true 
              } 
            } 
          } 
        },
        drug: { 
          select: { 
            id: true, 
            name: true,
            description: true 
          } 
        }
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

export async function DELETE(request, { params }) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Prescription ID is required' }, { status: 400 });
    }

    // Check if prescription exists
    const existingPrescription = await prisma.prescription.findUnique({
      where: { id }
    });

    if (!existingPrescription) {
      return NextResponse.json({ error: 'Prescription not found' }, { status: 404 });
    }

    // Delete the prescription
    await prisma.prescription.delete({
      where: { id }
    });

    return NextResponse.json({ 
      message: 'Prescription deleted successfully',
      id: id 
    });
  } catch (error) {
    console.error('Error deleting prescription:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}