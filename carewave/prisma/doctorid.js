const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper function to generate new appointment ID
function generateAppointmentId(index) {
  return `A-${(index + 1).toString().padStart(4, '0')}`;
}

// Alternative: Generate ID based on date and sequence
function generateAppointmentIdWithDate(appointmentDate, sequence) {
  const date = new Date(appointmentDate);
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const seq = sequence.toString().padStart(3, '0');
  return `A-${year}${month}${day}-${seq}`;
}

async function updateAppointmentIds() {
  console.log('🌱 Starting appointment ID update process...');

  try {
    // Fetch all appointments, ordered by createdAt to ensure consistent ID assignment
    const appointments = await prisma.appointment.findMany({
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        appointmentDate: true,
        createdAt: true,
        patient: { select: { firstName: true, lastName: true } },
        doctor: { select: { firstName: true, lastName: true } }
      }
    });

    console.log(`Found ${appointments.length} appointments to update`);

    // Update each appointment individually
    for (let i = 0; i < appointments.length; i++) {
      const appointment = appointments[i];
      const oldId = appointment.id;
      const newId = generateAppointmentId(i);

      try {
        // Check if the new ID already exists
        const existingAppointment = await prisma.appointment.findUnique({
          where: { id: newId },
        });

        if (existingAppointment && existingAppointment.id !== oldId) {
          console.log(`⚠️  Appointment with ID ${newId} already exists, skipping ${oldId}`);
          continue;
        }

        // If the ID is already correct, skip
        if (oldId === newId) {
          console.log(`✅ Appointment ${oldId} already has correct ID`);
          continue;
        }

        // Update the appointment's ID
        await prisma.appointment.update({
          where: { id: oldId },
          data: { id: newId },
        });

        console.log(`✅ Updated appointment ${oldId} to ${newId} (Patient: ${appointment.patient.firstName} ${appointment.patient.lastName})`);
      } catch (updateError) {
        console.error(`❌ Failed to update appointment ${oldId}:`, updateError.message);
        // Continue with other appointments instead of stopping the whole process
      }
    }

    console.log('🎉 Appointment ID update process completed!');
  } catch (error) {
    console.error('❌ Error during appointment ID update process:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Alternative approach with date-based IDs
async function updateAppointmentIdsWithDateFormat() {
  console.log('🌱 Starting appointment ID update process (date-based format)...');

  try {
    // Fetch all appointments, ordered by appointmentDate then createdAt
    const appointments = await prisma.appointment.findMany({
      orderBy: [
        { appointmentDate: 'asc' },
        { createdAt: 'asc' }
      ],
      select: {
        id: true,
        appointmentDate: true,
        createdAt: true,
        patient: { select: { firstName: true, lastName: true } },
        doctor: { select: { firstName: true, lastName: true } }
      }
    });

    console.log(`Found ${appointments.length} appointments to update`);

    // Group appointments by date to generate sequential IDs per date
    const appointmentsByDate = new Map();
    
    appointments.forEach(appointment => {
      const dateKey = appointment.appointmentDate.toISOString().split('T')[0];
      if (!appointmentsByDate.has(dateKey)) {
        appointmentsByDate.set(dateKey, []);
      }
      appointmentsByDate.get(dateKey).push(appointment);
    });

    // Update each appointment with date-based ID
    for (const [dateKey, dayAppointments] of appointmentsByDate) {
      for (let i = 0; i < dayAppointments.length; i++) {
        const appointment = dayAppointments[i];
        const oldId = appointment.id;
        const newId = generateAppointmentIdWithDate(appointment.appointmentDate, i + 1);

        try {
          // Check if the new ID already exists
          const existingAppointment = await prisma.appointment.findUnique({
            where: { id: newId },
          });

          if (existingAppointment && existingAppointment.id !== oldId) {
            console.log(`⚠️  Appointment with ID ${newId} already exists, skipping ${oldId}`);
            continue;
          }

          // If the ID is already correct, skip
          if (oldId === newId) {
            console.log(`✅ Appointment ${oldId} already has correct ID`);
            continue;
          }

          // Update the appointment's ID
          await prisma.appointment.update({
            where: { id: oldId },
            data: { id: newId },
          });

          console.log(`✅ Updated appointment ${oldId} to ${newId} (${dateKey} - Patient: ${appointment.patient.firstName} ${appointment.patient.lastName})`);
        } catch (updateError) {
          console.error(`❌ Failed to update appointment ${oldId}:`, updateError.message);
          // Continue with other appointments instead of stopping the whole process
        }
      }
    }

    console.log('🎉 Appointment ID update process completed!');
  } catch (error) {
    console.error('❌ Error during appointment ID update process:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Raw query approach for better performance with large datasets
async function updateAppointmentIdsWithRawQuery() {
  console.log('🌱 Starting appointment ID update process (raw query approach)...');

  try {
    // First, get all appointments to generate the mapping
    const appointments = await prisma.appointment.findMany({
      orderBy: { createdAt: 'asc' },
      select: { id: true }
    });

    console.log(`Found ${appointments.length} appointments to update`);

    // Create a temporary table to handle the ID mapping
    await prisma.$executeRaw`
      CREATE TEMPORARY TABLE appointment_id_mapping (
        old_id VARCHAR(255),
        new_id VARCHAR(255)
      );
    `;

    // Insert the mapping data
    for (let i = 0; i < appointments.length; i++) {
      const oldId = appointments[i].id;
      const newId = generateAppointmentId(i);
      
      await prisma.$executeRaw`
        INSERT INTO appointment_id_mapping (old_id, new_id) 
        VALUES (${oldId}, ${newId});
      `;
    }

    // Update the appointment table using the mapping
    await prisma.$executeRaw`
      UPDATE appointment a
      JOIN appointment_id_mapping m ON a.id = m.old_id
      SET a.id = m.new_id
      WHERE a.id != m.new_id;
    `;

    // Clean up the temporary table
    await prisma.$executeRaw`DROP TEMPORARY TABLE appointment_id_mapping;`;

    console.log('🎉 Appointment ID update process completed successfully!');
    console.log(`Updated ${appointments.length} appointments.`);
  } catch (error) {
    console.error('❌ Error during appointment ID update process:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the date-based approach
updateAppointmentIdsWithDateFormat().catch((e) => {
  console.error(e);
  process.exit(1);
});