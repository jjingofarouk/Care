import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const prescriptions = await prisma.prescription.findMany({
      include: { 
        patient: true, 
        doctor: true, 
        items: { include: { medication: true } } 
      },
    });

    // Flatten the data structure - create one row per prescription item
    const flattenedPrescriptions = prescriptions.flatMap(prescription => 
      prescription.items.map(item => ({
        id: `${prescription.id}-${item.id}`, // Unique ID for each row
        prescriptionId: prescription.id,
        patient: prescription.patient,
        doctor: prescription.doctor,
        drug: item.medication, // Map medication to drug for consistency
        dosage: item.dosage,
        prescribedAt: prescription.prescribedAt,
        // Include original prescription data if needed
        originalPrescription: prescription
      }))
    );

    return Response.json(flattenedPrescriptions);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch prescriptions' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const prescription = await prisma.prescription.create({
      data: {
        ...data,
        items: { create: data.items },
      },
      include: { 
        patient: true, 
        doctor: true, 
        items: { include: { medication: true } } 
      },
    });

    // Return flattened structure for consistency
    const flattenedPrescription = prescription.items.map(item => ({
      id: `${prescription.id}-${item.id}`,
      prescriptionId: prescription.id,
      patient: prescription.patient,
      doctor: prescription.doctor,
      drug: item.medication,
      dosage: item.dosage,
      prescribedAt: prescription.prescribedAt,
    }));

    return Response.json(flattenedPrescription);
  } catch (error) {
    return Response.json({ error: 'Failed to create prescription' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}