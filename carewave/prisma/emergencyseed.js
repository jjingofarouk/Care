const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid'); // Add uuid package for generating UUIDs

const prisma = new PrismaClient();

async function seedEmergencyData() {
  try {
    // Fetch existing patients
    const patients = await prisma.patient.findMany();
    if (patients.length === 0) {
      throw new Error('No patients found in the database. Please seed patients first.');
    }
    const patientIds = patients.map(p => p.id);

    // Generate Ambulances
    const ambulances = [];
    for (let i = 2; i <= 101; i++) {
      ambulances.push({
        id: uuidv4(), // Use UUID for id
        vehicleNumber: `AMB-${i.toString().padStart(3, '0')}`,
        status: ['Available', 'In Use', 'Maintenance'][Math.floor(Math.random() * 3)],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Generate Triage Assessments
    const triages = [];
    const triageLevels = ['Critical', 'Urgent', 'Stable', 'Non-urgent'];
    for (let i = 1; i <= 1500; i++) {
      triages.push({
        id: uuidv4(), // Use UUID for id
        patientId: patientIds[Math.floor(Math.random() * patientIds.length)],
        triageLevel: triageLevels[Math.floor(Math.random() * triageLevels.length)],
        symptoms: `Symptoms for triage ${i}`,
        assessedAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Insert Triage Assessments first to ensure IDs are available for Emergency Cases
    await prisma.triage.createMany({ data: triages });

    // Fetch inserted triages to get their UUIDs
    const insertedTriages = await prisma.triage.findMany();
    const triageIds = insertedTriages.map(t => t.id);

    // Generate Emergency Cases
    const emergencyCases = [];
    for (let i = 1; i <= 1000; i++) {
      const triageIndex = Math.floor(Math.random() * triageIds.length);
      const triage = insertedTriages[triageIndex];
      emergencyCases.push({
        id: uuidv4(), // Use UUID for id
        patientId: triage.patientId, // Use patientId from the selected triage for consistency
        triageId: triage.id,
        admissionId: null, // Set to null since no Admission records are seeded
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Insert Emergency Cases
    await prisma.emergencyCase.createMany({ data: emergencyCases });

    // Fetch inserted emergency cases to get their UUIDs
    const insertedEmergencyCases = await prisma.emergencyCase.findMany();
    const emergencyCaseIds = insertedEmergencyCases.map(ec => ec.id);

    // Generate Emergency Logs
    const logs = [];
    for (let i = 1; i <= 1000; i++) {
      const emergencyIndex = Math.floor(Math.random() * emergencyCaseIds.length);
      logs.push({
        id: uuidv4(), // Use UUID for id
        emergencyCaseId: emergencyCaseIds[emergencyIndex],
        description: `Log entry for emergency case ${emergencyCaseIds[emergencyIndex]}`,
        loggedAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Insert data into database
    await prisma.ambulance.createMany({ data: ambulances });
    await prisma.emergencyLog.createMany({ data: logs });

    console.log('Seeded 100 ambulances, 1500 triage assessments, 1000 emergency cases, and 1000 emergency logs');
  } catch (e) {
    console.error('Error seeding data:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedEmergencyData();