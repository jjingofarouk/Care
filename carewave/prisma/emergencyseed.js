const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function seedAmbulances() {
  try {
    // Generate 200 Ambulances with unique vehicleNumber (AMB-002 to AMB-201)
    const ambulances = [];
    for (let i = 2; i <= 201; i++) {
      ambulances.push({
        id: uuidv4(),
        vehicleNumber: `AMB-${i.toString().padStart(3, '0')}`,
        status: ['Available', 'In Use', 'Maintenance'][Math.floor(Math.random() * 3)],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Insert Ambulances
    await prisma.ambulance.createMany({ data: ambulances });

    console.log('Seeded 200 ambulances');
  } catch (e) {
    console.error('Error seeding ambulances:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedAmbulances();