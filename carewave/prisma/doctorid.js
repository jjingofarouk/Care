const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper function to generate new doctor ID
function generateDoctorId(index) {
  return `D-${(index + 1).toString().padStart(4, '0')}`;
}

async function updateDoctorIds() {
  console.log('🌱 Starting doctor ID update process...');

  try {
    // Fetch all doctors, ordered by createdAt to ensure consistent ID assignment
    const doctors = await prisma.doctor.findMany({
      orderBy: { createdAt: 'asc' },
    });

    // Start a transaction to ensure atomic updates
    await prisma.$transaction(async (tx) => {
      // Process each doctor
      for (let i = 0; i < doctors.length; i++) {
        const doctor = doctors[i];
        const oldId = doctor.id;
        const newId = generateDoctorId(i);

        // Update the doctor's ID
        await tx.doctor.update({
          where: { id: oldId },
          data: { id: newId },
        });

        console.log(`Updated doctor ${oldId} to ${newId}`);
      }
    });

    console.log('🎉 Doctor ID update process completed successfully!');
    console.log(`Updated ${doctors.length} doctors.`);
  } catch (error) {
    console.error('❌ Error during doctor ID update process:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateDoctorIds().catch((e) => {
  console.error(e);
  process.exit(1);
});