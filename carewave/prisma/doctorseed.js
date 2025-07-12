const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed process...');

  // Clear existing data
  console.log('🗑️ Clearing existing data...');
  await prisma.nurseSchedule.deleteMany({});
  await prisma.shift.deleteMany({});
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

  const specializations = await prisma.specialization.findMany();
  console.log(`✅ Created ${specializations.length} specializations`);

  // Create 10 Doctors with Ugandan names
  console.log('👨‍⚕️ Creating doctors...');
  const doctorData = [
    {
      firstName: 'Kizza',
      lastName: 'Muwanga',
      email: 'kizza.muwanga@hospital.com',
      phone: '+256-700-123-001',
      departmentId: departments[0].id,
    },
    {
      firstName: 'Nalubega',
      lastName: 'Aisha',
      email: 'nalubega.aisha@hospital.com',
      phone: '+256-700-123-002',
      departmentId: departments[1].id,
    },
    {
      firstName: 'Ssentongo',
      lastName: 'Ibrahim',
      email: 'ssentongo.ibrahim@hospital.com',
      phone: '+256-700-123-003',
      departmentId: departments[2].id,
    },
    {
      firstName: 'Namutebi',
      lastName: 'Fatuma',
      email: 'namutebi.fatuma@hospital.com',
      phone: '+256-700-123-004',
      departmentId: departments[3].id,
    },
    {
      firstName: 'Okello',
      lastName: 'David',
      email: 'okello.david@hospital.com',
      phone: '+256-700-123-005',
      departmentId: departments[4].id,
    },
    {
      firstName: 'Nankya',
      lastName: 'Sarah',
      email: 'nankya.sarah@hospital.com',
      phone: '+256-700-123-006',
      departmentId: departments[5].id,
    },
    {
      firstName: 'Mukasa',
      lastName: 'Joseph',
      email: 'mukasa.joseph@hospital.com',
      phone: '+256-700-123-007',
      departmentId: departments[6].id,
    },
    {
      firstName: 'Nabirye',
      lastName: 'Esther',
      email: 'nabirye.esther@hospital.com',
      phone: '+256-700-123-008',
      departmentId: departments[7].id,
    },
    {
      firstName: 'Wasswa',
      lastName: 'Hassan',
      email: 'wasswa.hassan@hospital.com',
      phone: '+256-700-123-009',
      departmentId: departments[0].id,
    },
    {
      firstName: 'Nakato',
      lastName: 'Mary',
      email: 'nakato.mary@hospital.com',
      phone: '+256-700-123-010',
      departmentId: departments[1].id,
    },
  ];

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
  const doctorSpecializations = [
    { doctorId: createdDoctors[0].id, specializationId: specializations[1].id },
    { doctorId: createdDoctors[1].id, specializationId: specializations[8].id },
    { doctorId: createdDoctors[2].id, specializationId: specializations[7].id },
    { doctorId: createdDoctors[3].id, specializationId: specializations[4].id },
    { doctorId: createdDoctors[4].id, specializationId: specializations[2].id },
    { doctorId: createdDoctors[5].id, specializationId: specializations[3].id },
    { doctorId: createdDoctors[6].id, specializationId: specializations[6].id },
    { doctorId: createdDoctors[7].id, specializationId: specializations[5].id },
    { doctorId: createdDoctors[8].id, specializationId: specializations[9].id },
    { doctorId: createdDoctors[9].id, specializationId: specializations[0].id },
  ];

  await prisma.doctorSpecialization.createMany({
    data: doctorSpecializations,
  });

  const additionalSpecializations = [
    { doctorId: createdDoctors[0].id, specializationId: specializations[9].id },
    { doctorId: createdDoctors[1].id, specializationId: specializations[0].id },
    { doctorId: createdDoctors[4].id, specializationId: specializations[8].id },
  ];

  await prisma.doctorSpecialization.createMany({
    data: additionalSpecializations,
  });

  console.log(`✅ Created ${doctorSpecializations.length + additionalSpecializations.length} doctor-specialization relationships`);

  // Create sample schedules
  console.log('📅 Creating sample schedules...');
  const scheduleData = [
    {
      doctorId: createdDoctors[0].id,
      startTime: new Date('2025-01-01T08:00:00Z'),
      endTime: new Date('2025-01-01T17:00:00Z'),
      dayOfWeek: 'Monday',
    },
    {
      doctorId: createdDoctors[0].id,
      startTime: new Date('2025-01-01T08:00:00Z'),
      endTime: new Date('2025-01-01T17:00:00Z'),
      dayOfWeek: 'Tuesday',
    },
    {
      doctorId: createdDoctors[1].id,
      startTime: new Date('2025-01-01T09:00:00Z'),
      endTime: new Date('2025-01-01T16:00:00Z'),
      dayOfWeek: 'Monday',
    },
    {
      doctorId: createdDoctors[1].id,
      startTime: new Date('2025-01-01T09:00:00Z'),
      endTime: new Date('2025-01-01T16:00:00Z'),
      dayOfWeek: 'Wednesday',
    },
    {
      doctorId: createdDoctors[2 Ascending
System: You are Grok 3 built by xAI.

```doctorseed.js
  {
    doctorId: createdDoctors[2].id,
    startTime: new Date('2025-01-01T07:00:00Z'),
    endTime: new Date('2025-01-01T15:00:00Z'),
    dayOfWeek: 'Monday',
  },
];

await prisma.doctorSchedule.createMany({
  data: scheduleData,
});

console.log(`✅ Created ${scheduleData.length} schedules`);

// Create sample units
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

// Create 10 Nurses with Ugandan names
console.log('👩‍⚕️ Creating nurses...');
const nurseData = [
  {
    firstName: 'Achen',
    lastName: 'Auma',
    email: 'achen.auma@hospital.com',
    phone: '+256-700-123-011',
    departmentId: departments[0].id,
  },
  {
    firstName: 'Atim',
    lastName: 'Mercy',
    email: 'atim.mercy@hospital.com',
    phone: '+256-700-123-012',
    departmentId: departments[1].id,
  },
  {
    firstName: 'Nabukenya',
    lastName: 'Joyce',
    email: 'nabukenya.joyce@hospital.com',
    phone: '+256-700-123-013',
    departmentId: departments[2].id,
  },
  {
    firstName: 'Nassanga',
    lastName: 'Grace',
    email: 'nassanga.grace@hospital.com',
    phone: '+256-700-123-014',
    departmentId: departments[3].id,
  },
  {
    firstName: 'Apio',
    lastName: 'Rose',
    email: 'apio.rose@hospital.com',
    phone: '+256-700-123-015',
    departmentId: departments[4].id,
  },
  {
    firstName: 'Nalwanga',
    lastName: 'Christine',
    email: 'nalwanga.christine@hospital.com',
    phone: '+256-700-123-016',
    departmentId: departments[5].id,
  },
  {
    firstName: 'Nambi',
    lastName: 'Ruth',
    email: 'nambi.ruth@hospital.com',
    phone: '+256-700-123-017',
    departmentId: departments[6].id,
  },
  {
    firstName: 'Namugenyi',
    lastName: 'Jane',
    email: 'namugenyi.jane@hospital.com',
    phone: '+256-700-123-018',
    departmentId: departments[7].id,
  },
  {
    firstName: 'Nankunda',
    lastName: 'Patricia',
    email: 'nankunda.patricia@hospital.com',
    phone: '+256-700-123-019',
    departmentId: departments[0].id,
  },
  {
    firstName: 'Namuddu',
    lastName: 'Betty',
    email: 'namuddu.betty@hospital.com',
    phone: '+256-700-123-020',
    departmentId: departments[1].id,
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

// Create sample nurse schedules
console.log('📅 Creating sample nurse schedules...');
const nurseScheduleData = [
  {
    nurseId: createdNurses[0].id,
    startTime: new Date('2025-01-01T07:00:00Z'),
    endTime: new Date('2025-01-01T19:00:00Z'),
    dayOfWeek: 'Monday',
  },
  {
    nurseId: createdNurses[0].id,
    startTime: new Date('2025-01-01T07:00:00Z'),
    endTime: new Date('2025-01-01T19:00:00Z'),
    dayOfWeek: 'Tuesday',
  },
  {
    nurseId: createdNurses[1].id,
    startTime: new Date('2025-01-01T19:00:00Z'),
    endTime: new Date('2025-01-02T07:00:00Z'),
    dayOfWeek: 'Monday',
  },
  {
    nurseId: createdNurses[1].id,
    startTime: new Date('2025-01-01T19:00:00Z'),
    endTime: new Date('2025-01-02T07:00:00Z'),
    dayOfWeek: 'Wednesday',
  },
  {
    nurseId: createdNurses[2].id,
    startTime: new Date('2025-01-01T07:00:00Z'),
    endTime: new Date('2025-01-01T19:00:00Z'),
    dayOfWeek: 'Monday',
  },
];

await prisma.nurseSchedule.createMany({
  data: nurseScheduleData,
});

console.log(`✅ Created ${nurseScheduleData.length} nurse schedules`);

console.log('🎉 Seed process completed successfully!');
console.log('\n📊 Summary:');
console.log(`- Departments: ${departments.length}`);
console.log(`- Specializations: ${specializations.length}`);
console.log(`- Doctors: ${createdDoctors.length}`);
console.log(`- Doctor-Specialization relationships: ${doctorSpecializations.length + additionalSpecializations.length}`);
console.log(`- Schedules: ${scheduleData.length}`);
console.log(`- Units: ${unitData.length}`);
console.log(`- Nurses: ${createdNurses.length}`);
console.log(`- Nurse Schedules: ${nurseScheduleData.length}`);
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