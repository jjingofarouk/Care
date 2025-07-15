const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function updateEmergencyCaseIds() {
  try {
    // Fetch all existing emergency cases
    const emergencyCases = await prisma.emergencyCase.findMany();
    if (emergencyCases.length === 0) throw new Error('No emergency cases found');

    // Generate new UUIDs for emergency cases
    const updatedEmergencyCases = emergencyCases.map(emergencyCase => ({
      id: uuidv4(),
      patientId: emergencyCase.patientId,
      triageId: emergencyCase.triageId,
      admissionId: emergencyCase.admissionId,
      createdAt: emergencyCase.createdAt,
      updatedAt: new Date(),
    }));

    // Update related emergency logs to nullify emergencyCaseId, delete existing emergency cases, and insert new ones
    await prisma.$transaction([
      prisma.emergencyLog.updateMany({
        data: { emergencyCaseId: null },
        where: { emergencyCaseId: { not: null } },
      }),
      prisma.emergencyCase.deleteMany(),
      prisma.emergencyCase.createMany({ data: updatedEmergencyCases }),
    ]);

    console.log('Updated emergency case IDs with new UUIDs');
  } catch (e) {
    console.error('Error updating emergency case IDs:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateEmergencyCaseIds();