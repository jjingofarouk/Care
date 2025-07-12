const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed process...');

  // Clear existing data in proper order to avoid foreign key constraints
  console.log('🗑️  Clearing existing data...');
  
  // Delete in reverse dependency order
  await prisma.shift.deleteMany({});
  await prisma.nurseSchedule.deleteMany({});
  await prisma.nurse.deleteMany({});
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

  // Create 10 Doctors with Ugandan names
  console.log('👨‍⚕️ Creating doctors...');
  const doctorData = [
    {
      firstName: 'Moses',
      lastName: 'Kiggundu',
      email: 'moses.kiggundu@hospital.com',
      phone: '+256-700-123-001',
      departmentId: departments[0].id, // Emergency Department
    },
    {
      firstName: 'Grace',
      lastName: 'Nakamya',
      email: 'grace.nakamya@hospital.com',
      phone: '+256-700-123-002',
      departmentId: departments[1].id, // Internal Medicine
    },
    {
      firstName: 'Samuel',
      lastName: 'Okello',
      email: 'samuel.okello@hospital.com',
      phone: '+256-700-123-003',
      departmentId: departments[2].id, // Surgery
    },
    {
      firstName: 'Betty',
      lastName: 'Namugga',
      email: 'betty.namugga@hospital.com',
      phone: '+256-700-123-004',
      departmentId: departments[3].id, // Pediatrics
    },
    {
      firstName: 'Peter',
      lastName: 'Ssemakula',
      email: 'peter.ssemakula@hospital.com',
      phone: '+256-700-123-005',
      departmentId: departments[4].id, // Cardiology
    },
    {
      firstName: 'Joyce',
      lastName: 'Akello',
      email: 'joyce.akello@hospital.com',
      phone: '+256-700-123-006',
      departmentId: departments[5].id, // Orthopedics
    },
    {
      firstName: 'Robert',
      lastName: 'Mugisha',
      email: 'robert.mugisha@hospital.com',
      phone: '+256-700-123-007',
      departmentId: departments[6].id, // Radiology
    },
    {
      firstName: 'Agnes',
      lastName: 'Nakalema',
      email: 'agnes.nakalema@hospital.com',
      phone: '+256-700-123-008',
      departmentId: departments[7].id, // Anesthesiology
    },
    {
      firstName: 'James',
      lastName: 'Ochieng',
      email: 'james.ochieng@hospital.com',
      phone: '+256-700-123-009',
      departmentId: departments[0].id, // Emergency Department
    },
    {
      firstName: 'Sarah',
      lastName: 'Nassimbwa',
      email: 'sarah.nassimbwa@hospital.com',
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
    { doctorId: createdDoctors[0].id, specializationId: specializations[1].id }, // Moses - Emergency Medicine
    { doctorId: createdDoctors[1].id, specializationId: specializations[8].id }, // Grace - Internal Medicine
    { doctorId: createdDoctors[2].id, specializationId: specializations[7].id }, // Samuel - General Surgery
    { doctorId: createdDoctors[3].id, specializationId: specializations[4].id }, // Betty - Pediatric Care
    { doctorId: createdDoctors[4].id, specializationId: specializations[2].id }, // Peter - Cardiology
    { doctorId: createdDoctors[5].id, specializationId: specializations[3].id }, // Joyce - Orthopedic Surgery
    { doctorId: createdDoctors[6].id, specializationId: specializations[6].id }, // Robert - Radiology
    { doctorId: createdDoctors[7].id, specializationId: specializations[5].id }, // Agnes - Anesthesiology
    { doctorId: createdDoctors[8].id, specializationId: specializations[9].id }, // James - Critical Care
    { doctorId: createdDoctors[9].id, specializationId: specializations[0].id }, // Sarah - General Medicine
  ];

  await prisma.doctorSpecialization.createMany({
    data: doctorSpecializations,
  });

  // Add some doctors with multiple specializations
  const additionalSpecializations = [
    { doctorId: createdDoctors[0].id, specializationId: specializations[9].id }, // Moses - Critical Care
    { doctorId: createdDoctors[1].id, specializationId: specializations[0].id }, // Grace - General Medicine
    { doctorId: createdDoctors[4].id, specializationId: specializations[8].id }, // Peter - Internal Medicine
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
    {
      doctorId: createdDoctors[3].id,
      startTime: new Date('2024-01-01T08:30:00Z'),
      endTime: new Date('2024-01-01T16:30:00Z'),
      dayOfWeek: 'Tuesday',
    },
    {
      doctorId: createdDoctors[4].id,
      startTime: new Date('2024-01-01T09:30:00Z'),
      endTime: new Date('2024-01-01T17:30:00Z'),
      dayOfWeek: 'Wednesday',
    },
    {
      doctorId: createdDoctors[5].id,
      startTime: new Date('2024-01-01T08:00:00Z'),
      endTime: new Date('2024-01-01T16:00:00Z'),
      dayOfWeek: 'Thursday',
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
    { name: 'CT Scan Room', departmentId: departments[6].id },
    { name: 'Recovery Room 1', departmentId: departments[7].id },
    { name: 'Recovery Room 2', departmentId: departments[7].id },
    { name: 'Administrative Office', departmentId: departments[8].id },
    { name: 'HR Office', departmentId: departments[9].id },
  ];

  await prisma.unit.createMany({
    data: unitData,
  });

  console.log(`✅ Created ${unitData.length} units`);

  // Create some sample nurses with Ugandan names
  console.log('👩‍⚕️ Creating nurses...');
  const nurseData = [
    {
      firstName: 'Mariam',
      lastName: 'Nakato',
      email: 'mariam.nakato@hospital.com',
      phone: '+256-700-456-001',
      departmentId: departments[0].id, // Emergency Department
    },
    {
      firstName: 'Denis',
      lastName: 'Kalyango',
      email: 'denis.kalyango@hospital.com',
      phone: '+256-700-456-002',
      departmentId: departments[1].id, // Internal Medicine
    },
    {
      firstName: 'Esther',
      lastName: 'Nambi',
      email: 'esther.nambi@hospital.com',
      phone: '+256-700-456-003',
      departmentId: departments[2].id, // Surgery
    },
    {
      firstName: 'Henry',
      lastName: 'Tumwine',
      email: 'henry.tumwine@hospital.com',
      phone: '+256-700-456-004',
      departmentId: departments[3].id, // Pediatrics
    },
    {
      firstName: 'Winnie',
      lastName: 'Nalubega',
      email: 'winnie.nalubega@hospital.com',
      phone: '+256-700-456-005',
      departmentId: departments[4].id, // Cardiology
    },
    {
      firstName: 'Joseph',
      lastName: 'Ssekandi',
      email: 'joseph.ssekandi@hospital.com',
      phone: '+256-700-456-006',
      departmentId: departments[5].id, // Orthopedics
    },
    {
      firstName: 'Patricia',
      lastName: 'Namusoke',
      email: 'patricia.namusoke@hospital.com',
      phone: '+256-700-456-007',
      departmentId: departments[6].id, // Radiology
    },
    {
      firstName: 'Simon',
      lastName: 'Kayongo',
      email: 'simon.kayongo@hospital.com',
      phone: '+256-700-456-008',
      departmentId: departments[7].id, // Anesthesiology
    },
  ];

  const createdNurses = [];
  for (let i = 0; i < nurseData.length; i++) {
    const nurse = await prisma.nurse.create({
      data: nurseData[i],
    });
    createdNurses.push(nurse);
  }

  console.log(`✅ Created ${createdNurses.length} nurses`);

  // Create some sample nurse schedules
  console.log('📋 Creating nurse schedules...');
  const nurseScheduleData = [
    {
      nurseId: createdNurses[0].id,
      startTime: new Date('2024-01-01T06:00:00Z'),
      endTime: new Date('2024-01-01T14:00:00Z'),
      dayOfWeek: 'Monday',
    },
    {
      nurseId: createdNurses[0].id,
      startTime: new Date('2024-01-01T06:00:00Z'),
      endTime: new Date('2024-01-01T14:00:00Z'),
      dayOfWeek: 'Tuesday',
    },
    {
      nurseId: createdNurses[1].id,
      startTime: new Date('2024-01-01T14:00:00Z'),
      endTime: new Date('2024-01-01T22:00:00Z'),
      dayOfWeek: 'Monday',
    },
    {
      nurseId: createdNurses[2].id,
      startTime: new Date('2024-01-01T22:00:00Z'),
      endTime: new Date('2024-01-02T06:00:00Z'),
      dayOfWeek: 'Monday',
    },
    {
      nurseId: createdNurses[3].id,
      startTime: new Date('2024-01-01T08:00:00Z'),
      endTime: new Date('2024-01-01T16:00:00Z'),
      dayOfWeek: 'Wednesday',
    },
    {
      nurseId: createdNurses[4].id,
      startTime: new Date('2024-01-01T09:00:00Z'),
      endTime: new Date('2024-01-01T17:00:00Z'),
      dayOfWeek: 'Thursday',
    },
  ];

  await prisma.nurseSchedule.createMany({
    data: nurseScheduleData,
  });

  console.log(`✅ Created ${nurseScheduleData.length} nurse schedules`);

  // Create some sample doctor leaves
  console.log('🏖️ Creating sample doctor leaves...');
  const doctorLeaveData = [
    {
      doctorId: createdDoctors[0].id,
      startDate: new Date('2024-02-15'),
      endDate: new Date('2024-02-20'),
      reason: 'Annual leave',
    },
    {
      doctorId: createdDoctors[1].id,
      startDate: new Date('2024-03-10'),
      endDate: new Date('2024-03-12'),
      reason: 'Medical conference',
    },
    {
      doctorId: createdDoctors[2].id,
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-04-05'),
      reason: 'Family emergency',
    },
  ];

  await prisma.doctorLeave.createMany({
    data: doctorLeaveData,
  });

  console.log(`✅ Created ${doctorLeaveData.length} doctor leaves`);

  console.log('🎉 Seed process completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- Departments: ${departments.length}`);
  console.log(`- Specializations: ${specializations.length}`);
  console.log(`- Doctors: ${createdDoctors.length}`);
  console.log(`- Nurses: ${createdNurses.length}`);
  console.log(`- Doctor-Specialization relationships: ${doctorSpecializations.length + additionalSpecializations.length}`);
  console.log(`- Doctor schedules: ${scheduleData.length}`);
  console.log(`- Nurse schedules: ${nurseScheduleData.length}`);
  console.log(`- Doctor leaves: ${doctorLeaveData.length}`);
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