const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper function to generate random date between 2020 and 2025 with weighted monthly distribution
function generateRandomDate() {
  const start = new Date(2020, 0, 1);
  const end = new Date(2025, 11, 31);
  // Generate random timestamp
  const timestamp = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  const date = new Date(timestamp);
  
  // Set random time between 8 AM and 6 PM
  date.setHours(Math.floor(Math.random() * 10) + 8, Math.floor(Math.random() * 60));
  return date;
}

// Helper function to get random element from array
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

async function main() {
  console.log('🌱 Starting appointment seed process...');

  // Fetch existing data
  console.log('📊 Fetching existing patients, doctors, and visit types...');
  const patients = await prisma.patient.findMany();
  const doctors = await prisma.doctor.findMany();
  const visitTypes = await prisma.visitType.findMany();

  console.log(`Found ${patients.length} patients, ${doctors.length} doctors, ${visitTypes.length} visit types`);

  // Define possible appointment statuses
  const appointmentStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

  // Create 20,000 appointments
  console.log('📅 Creating 20,000 appointments...');
  for (let i = 0; i < 20000; i++) {
    const patient = getRandomElement(patients);
    const doctor = getRandomElement(doctors);
    const visitType = getRandomElement(visitTypes);
    const status = getRandomElement(appointmentStatuses);
    const appointmentDate = generateRandomDate();

    try {
      console.log(`Creating appointment ${i + 1}/20000 for ${patient.firstName} ${patient.lastName} with Dr. ${doctor.firstName} ${doctor.lastName}...`);
      
      const appointment = await prisma.appointment.create({
        data: {
          patientId: patient.id,
          doctorId: doctor.id,
          visitTypeId: visitType.id,
          appointmentStatus: status,
          appointmentDate: appointmentDate,
        },
      });

      // Create appointment status record
      await prisma.appointmentStatus.create({
        data: {
          appointmentId: appointment.id,
          status: status,
          changedAt: appointmentDate,
        },
      });

      if ((i + 1) % 2000 === 0) {
        console.log(`✅ Progress: Created ${i + 1} appointments`);
      }
    } catch (error) {
      console.log(`⚠️ Error creating appointment ${i + 1}: ${error.message}`);
    }
  }

  // Final count
  const finalAppointments = await prisma.appointment.count();
  const finalStatusRecords = await prisma.appointmentStatus.count();

  console.log('🎉 Appointment seed process completed successfully!');
  console.log('\n📊 Final Summary:');
  console.log(`- Total appointments: ${finalAppointments}`);
  console.log(`- Total appointment status records: ${finalStatusRecords}`);
}

main()
  .then(async () => {
    console.log('🔌 Disconnecting from database...');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error during appointment seed process:', e);
    await prisma.$disconnect();
    process.exit(1);
  });