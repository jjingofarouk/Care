const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper function to generate meaningful IDs
function generateId(prefix, number) {
  return `${prefix}-${number.toString().padStart(4, '0')}`;
}

// Helper function to get random element from array
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to get random number between min and max
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log('Starting hospital queue database seeding...');

  try {
    // First, let's fetch existing patients to get their IDs
    console.log('Fetching existing patients...');
    const existingPatients = await prisma.patient.findMany({
      select: { id: true }
    });

    if (existingPatients.length === 0) {
      throw new Error('No patients found in database. Please seed patients first.');
    }

    console.log(`Found ${existingPatients.length} existing patients`);

    // Fetch existing departments (assuming they exist)
    console.log('Fetching existing departments...');
    const existingDepartments = await prisma.department.findMany({
      select: { id: true, name: true }
    });

    if (existingDepartments.length === 0) {
      throw new Error('No departments found in database. Please seed departments first.');
    }

    console.log(`Found ${existingDepartments.length} existing departments`);

    // 1. Seed Queue Statuses
    console.log('Seeding queue statuses...');
    const queueStatuses = [
      { id: 'qs-0001', name: 'Waiting' },
      { id: 'qs-0002', name: 'In Progress' },
      { id: 'qs-0003', name: 'Completed' },
      { id: 'qs-0004', name: 'Cancelled' },
      { id: 'qs-0005', name: 'No Show' },
      { id: 'qs-0006', name: 'Transferred' }
    ];

    for (const status of queueStatuses) {
      await prisma.queueStatus.upsert({
        where: { id: status.id },
        update: { name: status.name },
        create: status
      });
    }

    console.log(`✓ Created ${queueStatuses.length} queue statuses`);

    // 2. Seed Service Counters
    console.log('Seeding service counters...');
    const serviceCounterData = [
      // Reception/Registration counters
      { name: 'Reception Counter 1', department: 'Reception' },
      { name: 'Reception Counter 2', department: 'Reception' },
      { name: 'Registration Desk', department: 'Reception' },
      
      // Emergency counters
      { name: 'Emergency Triage', department: 'Emergency' },
      { name: 'Emergency Counter 1', department: 'Emergency' },
      { name: 'Emergency Counter 2', department: 'Emergency' },
      
      // Outpatient counters
      { name: 'OPD Counter 1', department: 'Outpatient' },
      { name: 'OPD Counter 2', department: 'Outpatient' },
      { name: 'OPD Counter 3', department: 'Outpatient' },
      
      // Specialty counters
      { name: 'Cardiology Counter', department: 'Cardiology' },
      { name: 'Neurology Counter', department: 'Neurology' },
      { name: 'Pediatrics Counter', department: 'Pediatrics' },
      { name: 'Orthopedics Counter', department: 'Orthopedics' },
      { name: 'Radiology Counter', department: 'Radiology' },
      { name: 'Laboratory Counter', department: 'Laboratory' },
      { name: 'Pharmacy Counter', department: 'Pharmacy' },
      
      // Surgery counters
      { name: 'Surgery Pre-Op', department: 'Surgery' },
      { name: 'Surgery Post-Op', department: 'Surgery' },
      
      // ICU counters
      { name: 'ICU Admission', department: 'ICU' },
      { name: 'ICU Discharge', department: 'ICU' }
    ];

    const serviceCounters = [];
    
    for (let i = 0; i < serviceCounterData.length; i++) {
      const counterData = serviceCounterData[i];
      
      // Find department by name (case-insensitive)
      const department = existingDepartments.find(dept => 
        dept.name.toLowerCase().includes(counterData.department.toLowerCase())
      );
      
      if (!department) {
        console.warn(`⚠️  Department not found for ${counterData.name}, using first available department`);
      }
      
      const serviceCounter = {
        id: generateId('sc', i + 1),
        name: counterData.name,
        departmentId: department ? department.id : existingDepartments[0].id
      };
      
      await prisma.serviceCounter.upsert({
        where: { id: serviceCounter.id },
        update: { 
          name: serviceCounter.name,
          departmentId: serviceCounter.departmentId
        },
        create: serviceCounter
      });
      
      serviceCounters.push(serviceCounter);
    }

    console.log(`✓ Created ${serviceCounters.length} service counters`);

    // 3. Seed Queue Entries
    console.log('Seeding queue entries...');
    const numberOfQueueEntries = 1000;
    const queueEntries = [];

    // Define status distribution (realistic hospital queue distribution)
    const statusDistribution = [
      { statusId: 'qs-0001', weight: 30 }, // Waiting - 30%
      { statusId: 'qs-0002', weight: 25 }, // In Progress - 25%
      { statusId: 'qs-0003', weight: 35 }, // Completed - 35%
      { statusId: 'qs-0004', weight: 5 },  // Cancelled - 5%
      { statusId: 'qs-0005', weight: 3 },  // No Show - 3%
      { statusId: 'qs-0006', weight: 2 }   // Transferred - 2%
    ];

    // Create weighted array for status selection
    const weightedStatuses = [];
    statusDistribution.forEach(status => {
      for (let i = 0; i < status.weight; i++) {
        weightedStatuses.push(status.statusId);
      }
    });

    // Generate queue entries in batches for better performance
    const batchSize = 100;
    let currentQueueNumber = 1;

    for (let batch = 0; batch < Math.ceil(numberOfQueueEntries / batchSize); batch++) {
      const batchEntries = [];
      const batchStart = batch * batchSize;
      const batchEnd = Math.min((batch + 1) * batchSize, numberOfQueueEntries);

      for (let i = batchStart; i < batchEnd; i++) {
        // Generate creation time (last 30 days)
        const daysAgo = getRandomNumber(0, 30);
        const hoursAgo = getRandomNumber(0, 23);
        const minutesAgo = getRandomNumber(0, 59);
        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - daysAgo);
        createdAt.setHours(createdAt.getHours() - hoursAgo);
        createdAt.setMinutes(createdAt.getMinutes() - minutesAgo);

        // Generate updated time (after created time)
        const updatedAt = new Date(createdAt);
        updatedAt.setMinutes(updatedAt.getMinutes() + getRandomNumber(1, 120));

        const queueEntry = {
          id: generateId('qe', currentQueueNumber),
          patientId: getRandomElement(existingPatients).id,
          serviceCounterId: getRandomElement(serviceCounters).id,
          queueStatusId: getRandomElement(weightedStatuses),
          queueNumber: currentQueueNumber,
          createdAt,
          updatedAt
        };

        batchEntries.push(queueEntry);
        currentQueueNumber++;
      }

      // Insert batch
      await prisma.queueEntry.createMany({
        data: batchEntries,
        skipDuplicates: true
      });

      console.log(`✓ Created batch ${batch + 1}/${Math.ceil(numberOfQueueEntries / batchSize)} (${batchEntries.length} entries)`);
    }

    console.log(`✓ Created ${numberOfQueueEntries} queue entries`);

    // 4. Generate summary statistics
    console.log('\n📊 Generating summary statistics...');
    
    const statusCounts = await prisma.queueEntry.groupBy({
      by: ['queueStatusId'],
      _count: {
        id: true
      }
    });

    const counterCounts = await prisma.queueEntry.groupBy({
      by: ['serviceCounterId'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 5
    });

    console.log('\n📈 Summary Statistics:');
    console.log('='.repeat(50));
    
    console.log('\n🟢 Queue Status Distribution:');
    for (const statusCount of statusCounts) {
      const status = queueStatuses.find(s => s.id === statusCount.queueStatusId);
      console.log(`  ${status.name}: ${statusCount._count.id} entries`);
    }

    console.log('\n🏥 Top 5 Service Counters by Queue Volume:');
    for (const counterCount of counterCounts) {
      const counter = serviceCounters.find(c => c.id === counterCount.serviceCounterId);
      console.log(`  ${counter.name}: ${counterCount._count.id} entries`);
    }

    const totalEntries = await prisma.queueEntry.count();
    const totalCounters = await prisma.serviceCounter.count();
    const totalStatuses = await prisma.queueStatus.count();

    console.log('\n📋 Final Counts:');
    console.log(`  Queue Entries: ${totalEntries}`);
    console.log(`  Service Counters: ${totalCounters}`);
    console.log(`  Queue Statuses: ${totalStatuses}`);

    console.log('\n✅ Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

// Execute the seed function
main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// Export for use in other scripts
module.exports = { main };