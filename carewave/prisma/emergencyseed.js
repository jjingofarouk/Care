const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedEmergencyData() {
  // Fetch existing patients
  const patients = await prisma.patient.findMany();
  const patientIds = patients.map(p => p.id);

  // Generate Ambulances (AMB-002 to AMB-101)
  const ambulances = [];
  for (let i = 2; i <= 101; i++) {
    ambulances.push({
      id: `AMB-${i.toString().padStart(3, '0')}`,
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
      id: `TRI-${i.toString().padStart(4, '0')}`,
      patientId: patientIds[Math.floor(Math.random() * patientIds.length)],
      triageLevel: triageLevels[Math.floor(Math.random() * triageLevels.length)],
      symptoms: `Symptoms for triage ${i}`,
      assessedAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Generate Emergency Cases
  const emergencyCases = [];
  for (let i = 1; i <= 1000; i++) {
    const triageIndex = Math.floor(Math.random() * triages.length);
    emergencyCases.push({
      id: `EM-${i.toString().padStart(4, '0')}`,
      patientId: triages[triageIndex].patientId,
      triageId: triages[triageIndex].id,
      admissionId: Math.random() > 0.3 ? `ADM-${i.toString().padStart(4, '0')}` : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Generate Emergency Logs
  const logs = [];
  for (let i = 1; i <= 1000; i++) {
    const emergencyIndex = Math.floor(Math.random() * emergencyCases.length);
    logs.push({
      id: `LOG-${i.toString().padStart(4, '0')}`,
      emergencyCaseId: emergencyCases[emergencyIndex].id,
      description: `Log entry for emergency case ${emergencyCases[emergencyIndex].id}`,
      loggedAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Insert data into database
  await prisma.ambulance.createMany({ data: ambulances });
  await prisma.triage.createMany({ data: triages });
  await prisma.emergencyCase.createMany({ data: emergencyCases });
  await prisma.emergencyLog.createMany({ data: logs });

  console.log('Seeded 100 ambulances, 1500 triage assessments, 1000 emergency cases, and 1000 emergency logs');
}

seedEmergencyData()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });