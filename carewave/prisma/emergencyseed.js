const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function seedEmergencyLogs() {
  try {
    // Fetch existing emergency cases
    const emergencyCases = await prisma.emergencyCase.findMany();
    if (emergencyCases.length === 0) throw new Error('No emergency cases found');

    const emergencyCaseIds = emergencyCases.map(ec => ec.id);

    // Generate 1000 Emergency Logs
    const logs = [];
    for (let i = 1; i <= 1000; i++) {
      const emergencyIndex = Math.floor(Math.random() * emergencyCaseIds.length);
      logs.push({
        id: uuidv4(),
        emergencyCaseId: emergencyCaseIds[emergencyIndex],
        description: `Log entry for emergency case ${emergencyCaseIds[emergencyIndex]}`,
        loggedAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Insert Emergency Logs
    await prisma.emergencyLog.createMany({ data: logs });

    console.log('Seeded 1000 emergency logs');
  } catch (e) {
    console.error('Error seeding emergency logs:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedEmergencyLogs();