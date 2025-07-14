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

    console.log(`Found ${doctors.length} doctors to update`);

    // Update each doctor individually (not in a transaction for ID updates)
    for (let i = 0; i < doctors.length; i++) {
      const doctor = doctors[i];
      const oldId = doctor.id;
      const newId = generateDoctorId(i);

      try {
        // Check if the new ID already exists
        const existingDoctor = await prisma.doctor.findUnique({
          where: { id: newId },
        });

        if (existingDoctor && existingDoctor.id !== oldId) {
          console.log(`⚠️  Doctor with ID ${newId} already exists, skipping ${oldId}`);
          continue;
        }

        // If the ID is already correct, skip
        if (oldId === newId) {
          console.log(`✅ Doctor ${oldId} already has correct ID`);
          continue;
        }

        // Update the doctor's ID
        await prisma.doctor.update({
          where: { id: oldId },
          data: { id: newId },
        });

        console.log(`✅ Updated doctor ${oldId} to ${newId}`);
      } catch (updateError) {
        console.error(`❌ Failed to update doctor ${oldId}:`, updateError.message);
        // Continue with other doctors instead of stopping the whole process
      }
    }

    console.log('🎉 Doctor ID update process completed!');
  } catch (error) {
    console.error('❌ Error during doctor ID update process:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Alternative approach using database-level operations (more robust)
async function updateDoctorIdsWithRawQuery() {
  console.log('🌱 Starting doctor ID update process (raw query approach)...');

  try {
    // First, get all doctors to generate the mapping
    const doctors = await prisma.doctor.findMany({
      orderBy: { createdAt: 'asc' },
      select: { id: true }
    });

    console.log(`Found ${doctors.length} doctors to update`);

    // Create a temporary table to handle the ID mapping
    await prisma.$executeRaw`
      CREATE TEMPORARY TABLE doctor_id_mapping (
        old_id VARCHAR(255),
        new_id VARCHAR(255)
      );
    `;

    // Insert the mapping data
    for (let i = 0; i < doctors.length; i++) {
      const oldId = doctors[i].id;
      const newId = generateDoctorId(i);
      
      await prisma.$executeRaw`
        INSERT INTO doctor_id_mapping (old_id, new_id) 
        VALUES (${oldId}, ${newId});
      `;
    }

    // Update the doctor table using the mapping
    await prisma.$executeRaw`
      UPDATE doctor d
      JOIN doctor_id_mapping m ON d.id = m.old_id
      SET d.id = m.new_id
      WHERE d.id != m.new_id;
    `;

    // Clean up the temporary table
    await prisma.$executeRaw`DROP TEMPORARY TABLE doctor_id_mapping;`;

    console.log('🎉 Doctor ID update process completed successfully!');
    console.log(`Updated ${doctors.length} doctors.`);
  } catch (error) {
    console.error('❌ Error during doctor ID update process:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update
updateDoctorIds().catch((e) => {
  console.error(e);
  process.exit(1);
});

// Uncomment the line below to use the raw query approach instead
// updateDoctorIdsWithRawQuery().catch((e) => { console.error(e); process.exit(1); });