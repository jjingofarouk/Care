const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateEmergencyCaseIds() {
  try {
    // Fetch all existing emergency cases
    const emergencyCases = await prisma.emergencyCase.findMany();
    if (emergencyCases.length === 0) throw new Error('No emergency cases found');

    // Update each emergency case ID with EM-XXXXXX pattern (6 random alphanumeric characters)
    for (const emergencyCase of emergencyCases) {
      const randomId = Math.random().toString(36).substring(2, 8).toUpperCase(); // 6 random alphanumeric chars
      const newId = `EM-${randomId}`;
      
      await prisma.emergencyCase.update({
        where: { id: emergencyCase.id },
        data: { id: newId },
      });
    }

    console.log('Updated emergency case IDs with EM-XXXXXX pattern');
  } catch (e) {
    console.error('Error updating emergency case IDs:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateEmergencyCaseIds();