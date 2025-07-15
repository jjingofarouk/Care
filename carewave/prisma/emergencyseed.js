const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function updateEmergencyCaseIds() {
  try {
    // Fetch all existing emergency cases
    const emergencyCases = await prisma.emergencyCase.findMany();
    if (emergencyCases.length === 0) throw new Error('No emergency cases found');

    // Update each emergency case ID individually
    for (const emergencyCase of emergencyCases) {
      await prisma.emergencyCase.update({
        where: { id: emergencyCase.id },
        data: { id: uuidv4() },
      });
    }

    console.log('Updated emergency case IDs with new UUIDs');
  } catch (e) {
    console.error('Error updating emergency case IDs:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateEmergencyCaseIds();