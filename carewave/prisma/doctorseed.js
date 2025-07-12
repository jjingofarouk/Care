const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed process...');

  // Clear existing data (optional - remove if you want to keep existing data)
  console.log('🗑️  Clearing existing data...');
  await prisma.doctorSpecialization.deleteMany({});
  await prisma.doctorSchedule.deleteMany({});
  await prisma.doctorLeave.deleteMany({});
  await prisma.doctor.deleteMany({});
  await prisma.specialization.deleteMany({});
  await prisma.unit.deleteMany({});
  await prisma.department.deleteMany({});

  // Create 10 Departments
  console.log('🏥 Creating departments...');
  const departmentData = [
    { name: 'Emergency Department', departmentType: 'CLINICAL' },
    { name: 'Internal Medicine', departmentType: 'CLINICAL' },
    { name: 'Surgery', departmentType: 'CLINICAL' },
    { name: 'Pediatrics', departmentType: 'CLINICAL' },
    { name: 'Cardiology', departmentType: 'CLINICAL' },
    { name: 'Orthopedics', departmentType: 'CLINICAL' },
    { name: 'Radiology', departmentType: 'CLINICAL' },
    { name: 'Anesthesiology', departmentType: 'CLINICAL' },
    { name: 'Administration', departmentType: 'ADMINISTRATIVE' },
    { name: 'Human Resources', departmentType: 'ADMINISTRATIVE' },
  ];

  await prisma.department.createMany({
    data: departmentData,
  });

  // Get created departments
  const departments = await prisma.department.findMany();
  console.log(`✅ Created ${departments.length} departments`);

  // Create 10 Specializations
  console.log('🎯 Creating specializations...');
  const specializationData = [
    { name: 'General Medicine', description: 'General medical practice' },
    { name: 'Emergency Medicine', description: 'Emergency and trauma care' },
    { name: 'Cardiology', description: 'Heart and cardiovascular diseases' },
    { name: 'Orthopedic Surgery', description: 'Bone and joint surgery' },
    { name: 'Pediatric Care', description: 'Child and infant healthcare' },
    { name: 'Anesthesiology', description: 'Anesthesia and pain management' },
    { name: 'Radiology', description: 'Medical imaging and diagnosis' },
    { name: 'General Surgery', description: 'General surgical procedures' },
    { name: 'Internal Medicine', description: 'Adult internal medicine' },
    { name: 'Critical Care', description: 'Intensive care medicine' },
  ];

  await prisma.specialization.createMany({
    data: specializationData,
  });

  // Get created specializations
  const specializations = await prisma.specialization.findMany();
  console.log(`✅ Created ${specializations.length} specializations`);

  // Create 10 Doctors
  console.log('👨‍⚕️ Creating doctors...');
  const doctorData = [
    {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@hospital.com',
      phone: '+256-700-123-001',
      departmentId: departments[0].id, // Emergency Department
    },
    {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@hospital.com',
      phone: '+256-700-123-002',
      departmentId: departments[1].id, // Internal Medicine
    },
    {
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.brown@hospital.com',
      phone: '+256-700-123-003',
      departmentId: departments[2].id, // Surgery
    },
    {
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@hospital.com',
      phone: '+256-700-123-004',
      departmentId: departments[3].id, // Pediatrics
    },
    {
      firstName: 'David',
      lastName: 'Wilson',
      email: 'david.wilson@hospital.com',
      phone: '+256-700-123-005',
      departmentId: departments[4].id, // Cardiology
    },
    {
      firstName: 'Jessica',
      lastName: 'Miller',
      email: 'jessica.miller@hospital.com',
      phone: '+256-700-123-006',
      departmentId: departments[5].id, // Orthopedics
    },
    {
      firstName: 'Robert',
      lastName: 'Garcia',
      email: 'robert.garcia@hospital.com',
      phone: '+256-700-123-007',
      departmentId: departments[6].id, // Radiology
    },
    {
      firstName: 'Lisa',
      lastName: 'Martinez',
      email: 'lisa.martinez@hospital.com',
      phone: '+256-700-123-008',
      departmentId: departments[7].id, // Anesthesiology
    },
    {
      firstName: 'James',
      lastName: 'Anderson',
      email: 'james.anderson@hospital.com',
      phone: '+256-700-123-009',
      departmentId: departments[0].id, // Emergency Department
    },
    {
      firstName: 'Maria',
      lastName: 'Rodriguez',
      email: 'maria.rodriguez@hospital.com',
      phone: '+256-700-123-010',
      departmentId: departments[1].id, // Internal Medicine
    },
  ];

  // Create doctors one by one to handle specializations
  const createdDoctors = [];
  for (let i = 0; i < doctorData.length; i++) {
    const doctor = await prisma.doctor.create({
      data: doctorData[i],
    });
    createdDoctors.push(doctor);
  }

  console.log(`✅ Created ${createdDoctors.length} doctors`);

  // Assign specializations to doctors
  console.log('🔗 Assigning specializations to doctors...');
  
  // Doctor-Specialization assignments
  const doctorSpecializations = [
    { doctorId: createdDoctors[0].id, specializationId: specializations[1].id }, // John - Emergency Medicine
    { doctorId: createdDoctors[1].id, specializationId: specializations[8].id }, // Sarah - Internal Medicine
    { doctorId: createdDoctors[2].id, specializationId: specializations[7].id }, // Michael - General Surgery
    { doctorId: createdDoctors[3].id, specializationId: specializations[4].id }, // Emily - Pediatric Care
    { doctorId: createdDoctors[4].id, specializationId: specializations[2].id }, // David - Cardiology
    { doctorId: createdDoctors[5].id, specializationId: specializations[3].id }, // Jessica - Orthopedic Surgery
    { doctorId: createdDoctors[6].id, specializationId: specializations[6].id }, // Robert - Radiology
    { doctorId: createdDoctors[7].id, specializationId: specializations[5].id }, // Lisa - Anesthesiology
    { doctorId: createdDoctors[8].id, specializationId: specializations[9].id }, // James - Critical Care
    { doctorId: createdDoctors[9].id, specializationId: specializations[0].id }, // Maria - General Medicine
  ];

  await prisma.doctorSpecialization.createMany({
    data: doctorSpecializations,
  });

  // Add some doctors with multiple specializations
  const additionalSpecializations = [
    { doctorId: createdDoctors[0].id, specializationId: specializations[9].id }, // John - Critical Care
    { doctorId: createdDoctors[1].id, specializationId: specializations[0].id }, // Sarah - General Medicine
    { doctorId: createdDoctors[4].id, specializationId: specializations[8].id }, // David - Internal Medicine
  ];

  await prisma.doctorSpecialization.createMany({
    data: additionalSpecializations,
  });

  console.log(`✅ Created ${doctorSpecializations.length + additionalSpecializations.length} doctor-specialization relationships`);

  // Create some sample schedules
  console.log('📅 Creating sample schedules...');
  const scheduleData = [
    {
      doctorId: createdDoctors[0].id,
      startTime: new Date('2024-01-01T08:00:00Z'),
      endTime: new Date('2024-01-01T17:00:00Z'),
      dayOfWeek: 'Monday',
    },
    {
      doctorId: createdDoctors[0].id,
      startTime: new Date('2024-01-01T08:00:00Z'),
      endTime: new Date('2024-01-01T17:00:00Z'),
      dayOfWeek: 'Tuesday',
    },
    {
      doctorId: createdDoctors[1].id,
      startTime: new Date('2024-01-01T09:00:00Z'),
      endTime: new Date('2024-01-01T16:00:00Z'),
      dayOfWeek: 'Monday',
    },
    {
      doctorId: createdDoctors[1].id,
      startTime: new Date('2024-01-01T09:00:00Z'),
      endTime: new Date('2024-01-01T16:00:00Z'),
      dayOfWeek: 'Wednesday',
    },
    {
      doctorId: createdDoctors[2].id,
      startTime: new Date('2024-01-01T07:00:00Z'),
      endTime: new Date('2024-01-01T15:00:00Z'),
      dayOfWeek: 'Monday',
    },
  ];

  await prisma.doctorSchedule.createMany({
    data: scheduleData,
  });

  console.log(`✅ Created ${scheduleData.length} schedules`);

  // Create some sample units for departments
  console.log('🏢 Creating sample units...');
  const unitData = [
    { name: 'Emergency Room 1', departmentId: departments[0].id },
    { name: 'Emergency Room 2', departmentId: departments[0].id },
    { name: 'ICU Unit 1', departmentId: departments[1].id },
    { name: 'General Ward A', departmentId: departments[1].id },
    { name: 'Operating Theater 1', departmentId: departments[2].id },
    { name: 'Operating Theater 2', departmentId: departments[2].id },
    { name: 'Pediatric Ward', departmentId: departments[3].id },
    { name: 'NICU', departmentId: departments[3].id },
    { name: 'Cardiac Unit', departmentId: departments[4].id },
    { name: 'X-Ray Room', departmentId: departments[6].id },
  ];

  await prisma.unit.createMany({
    data: unitData,
  });

  console.log(`✅ Created ${unitData.length} units`);

  console.log('🎉 Seed process completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- Departments: ${departments.length}`);
  console.log(`- Specializations: ${specializations.length}`);
  console.log(`- Doctors: ${createdDoctors.length}`);
  console.log(`- Doctor-Specialization relationships: ${doctorSpecializations.length + additionalSpecializations.length}`);
  console.log(`- Schedules: ${scheduleData.length}`);
  console.log(`- Units: ${unitData.length}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error during seed process:', e);
    await prisma.$disconnect();
    process.exit(1);
  });