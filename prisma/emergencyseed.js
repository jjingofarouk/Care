const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function updateEmergencyCaseIds() {
  try {
    // Fetch all existing emergency cases
    const emergencyCases = await prisma.emergencyCase.findMany();
    if (emergencyCases.length === 0) throw new Error('No emergency cases found');

    // Update each emergency case ID with a new UUID
    for (const emergencyCase of emergencyCases) {
      const newId = uuidv4().substring(0, 6).toUpperCase(); // Use first 6 characters of UUID
      await prisma.emergencyCase.update({
        where: { id: emergencyCase.id },
        data: { id: `EM-${newId}` },
      });
    }

    console.log('Updated emergency case IDs with EM-XXXXXX pattern from UUID');
  } catch (e) {
    console.error('Error updating emergency case IDs:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateEmergencyCaseIds();