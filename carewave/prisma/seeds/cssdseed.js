const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding process...');

  const cssdItems = Array.from({ length: 50 }, (_, i) => ({
    id: uuidv4(),
    name: `Surgical Instrument ${i + 1}`,
    description: `Description for surgical instrument ${i + 1}, used in various procedures.`,
  }));

  console.log(`Prepared ${cssdItems.length} CSSD items for seeding.`);

  const sterilizationCycles = [];
  const instrumentRequests = [];

  cssdItems.forEach((item, index) => {
    const cycleCount = Math.floor(Math.random() * 5) + 3;
    for (let i = 0; i < cycleCount; i++) {
      sterilizationCycles.push({
        id: uuidv4(),
        cssdItemId: item.id,
        cycleDate: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        status: ['Completed', 'In Progress', 'Failed'][Math.floor(Math.random() * 3)],
      });
    }

    const requestCount = Math.floor(Math.random() * 4) + 2;
    for (let i = 0; i < requestCount; i++) {
      instrumentRequests.push({
        id: uuidv4(),
        cssdItemId: item.id,
        departmentId: uuidv4(),
        requestedAt: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      });
    }
  });

  console.log(`Prepared ${sterilizationCycles.length} sterilization cycles and ${instrumentRequests.length} instrument requests.`);

  let itemCount = 0;
  for (const item of cssdItems) {
    await prisma.cSSDItem.upsert({
      where: { name: item.name },
      update: {},
      create: {
        id: item.id,
        name: item.name,
        description: item.description,
      },
    });
    itemCount++;
    console.log(`Seeded CSSD item ${itemCount}/${cssdItems.length}: ${item.name}`);
  }

  let cycleCount = 0;
  for (const cycle of sterilizationCycles) {
    await prisma.sterilizationCycle.upsert({
      where: { id: cycle.id },
      update: {},
      create: {
        id: cycle.id,
        cssdItemId: cycle.cssdItemId,
        cycleDate: cycle.cycleDate,
        status: cycle.status,
      },
    });
    cycleCount++;
    console.log(`Seeded sterilization cycle ${cycleCount}/${sterilizationCycles.length}`);
  }

  let requestCount = 0;
  for (const request of instrumentRequests) {
    await prisma.instrumentRequest.upsert({
      where: { id: request.id },
      update: {},
      create: {
        id: request.id,
        cssdItemId: request.cssdItemId,
        departmentId: request.departmentId,
        requestedAt: request.requestedAt,
      },
    });
    requestCount++;
    console.log(`Seeded instrument request ${requestCount}/${instrumentRequests.length}`);
  }

  console.log(`Seeding completed: ${cssdItems.length} CSSD items, ${sterilizationCycles.length} sterilization cycles, and ${instrumentRequests.length} instrument requests.`);
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Database connection closed.');
  });