// app/api/vaccination/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const vaccinations = await prisma.vaccinationRecord.findMany({
      include: { 
        patient: true, 
        vaccine: true, 
        immunizationSchedule: true 
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(vaccinations);
  } catch (error) {
    console.error('Error fetching vaccinations:', error);
    return NextResponse.json({ error: 'Error fetching vaccinations' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.patientId || !data.vaccineId || !data.administeredDate) {
      return NextResponse.json({ 
        error: 'Patient ID, Vaccine ID, and Administered Date are required' 
      }, { status: 400 });
    }
    
    const vaccination = await prisma.vaccinationRecord.create({
      data: {
        patientId: data.patientId,
        vaccineId: data.vaccineId,
        immunizationScheduleId: data.immunizationScheduleId || null,
        administeredDate: new Date(data.administeredDate),
      },
      include: { 
        patient: true, 
        vaccine: true, 
        immunizationSchedule: true 
      }
    });
    
    return NextResponse.json(vaccination);
  } catch (error) {
    console.error('Error creating vaccination:', error);
    return NextResponse.json({ error: 'Error creating vaccination' }, { status: 500 });
  }
}