const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper function to generate date-based medical record ID
function generateMedicalRecordIdWithDate(recordDate, sequence) {
  const date = new Date(recordDate);
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const seq = sequence.toString().padStart(4, '0');
  return `MR-${year}${month}${day}-${seq}`;
}

async function updateMedicalRecordIdsWithDateFormat() {
  console.log('🌱 Starting medical record ID update process (date-based format)...');

  try {
    // Fetch all medical records, ordered by recordDate then createdAt
    const medicalRecords = await prisma.medicalRecord.findMany({
      orderBy: [
        { recordDate: 'asc' },
        { createdAt: 'asc' }
      ],
      select: {
        id: true,
        recordDate: true,
        createdAt: true,
        patient: { select: { firstName: true, lastName: true } }
      }
    });

    console.log(`Found ${medicalRecords.length} medical records to update`);

    // Group records by date to generate sequential IDs per date
    const recordsByDate = new Map();
    
    medicalRecords.forEach(record => {
      const dateKey = record.recordDate.toISOString().split('T')[0];
      if (!recordsByDate.has(dateKey)) {
        recordsByDate.set(dateKey, []);
      }
      recordsByDate.get(dateKey).push(record);
    });

    // Update each medical record with date-based ID
    for (const [dateKey, dayRecords] of recordsByDate) {
      for (let i = 0; i < dayRecords.length; i++) {
        const record = dayRecords[i];
        const oldId = record.id;
        const newId = generateMedicalRecordIdWithDate(record.recordDate, i + 1);

        try {
          // Check if the new ID already exists
          const existingRecord = await prisma.medicalRecord.findUnique({
            where: { id: newId },
          });

          if (existingRecord && existingRecord.id !== oldId) {
            console.log(`⚠️  Medical record with ID ${newId} already exists, skipping ${oldId}`);
            continue;
          }

          // If the ID is already correct, skip
          if (oldId === newId) {
            console.log(`✅ Medical record ${oldId} already has correct ID`);
            continue;
          }

          // Update the medical record's ID
          await prisma.medicalRecord.update({
            where: { id: oldId },
            data: { id: newId },
          });

          console.log(`✅ Updated medical record ${oldId} to ${newId} (${dateKey} - Patient: ${record.patient.firstName} ${record.patient.lastName})`);
        } catch (updateError) {
          console.error(`❌ Failed to update medical record ${oldId}:`, updateError.message);
          // Continue with other records instead of stopping
        }
      }
    }

    console.log('🎉 Medical record ID update process completed!');
  } catch (error) {
    console.error('❌ Error during medical record ID update process:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the date-based approach
updateMedicalRecordIdsWithDateFormat().catch((e) => {
  console.error(e);
  process.exit(1);
});