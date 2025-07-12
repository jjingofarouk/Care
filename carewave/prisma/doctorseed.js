const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed process...');

  // Check existing data first
  console.log('📊 Checking existing data...');
  const existingDepartments = await prisma.department.count();
  const existingDoctors = await prisma.doctor.count();
  const existingNurses = await prisma.nurse.count();
  const existingSpecializations = await prisma.specialization.count();
  
  console.log(`Existing: ${existingDepartments} departments, ${existingDoctors} doctors, ${existingNurses} nurses, ${existingSpecializations} specializations`);

  // Create Departments (only if they don't exist)
  console.log('🏥 Creating departments...');
  const departmentNames = [
    'Emergency Department',
    'Internal Medicine',
    'Surgery',
    'Pediatrics',
    'Cardiology',
    'Orthopedics',
    'Radiology',
    'Anesthesiology',
    'Administration',
    'Human Resources',
    'Obstetrics and Gynecology',
    'Neurology',
    'Psychiatry',
    'Dermatology',
    'Ophthalmology'
  ];

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
    { name: 'Obstetrics and Gynecology', departmentType: 'CLINICAL' },
    { name: 'Neurology', departmentType: 'CLINICAL' },
    { name: 'Psychiatry', departmentType: 'CLINICAL' },
    { name: 'Dermatology', departmentType: 'CLINICAL' },
    { name: 'Ophthalmology', departmentType: 'CLINICAL' },
  ];

  const createdDepartments = [];
  for (const dept of departmentData) {
    try {
      const department = await prisma.department.upsert({
        where: { name: dept.name },
        update: {},
        create: dept,
      });
      createdDepartments.push(department);
    } catch (error) {
      console.log(`Department ${dept.name} already exists or error occurred`);
    }
  }

  // Get all departments for reference
  const allDepartments = await prisma.department.findMany();
  console.log(`✅ Total departments: ${allDepartments.length}`);

  // Create Specializations (only if they don't exist)
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
    { name: 'Obstetrics and Gynecology', description: 'Women\'s health and childbirth' },
    { name: 'Neurology', description: 'Brain and nervous system disorders' },
    { name: 'Psychiatry', description: 'Mental health and behavioral disorders' },
    { name: 'Dermatology', description: 'Skin and related disorders' },
    { name: 'Ophthalmology', description: 'Eye and vision care' },
  ];

  const createdSpecializations = [];
  for (const spec of specializationData) {
    try {
      const specialization = await prisma.specialization.upsert({
        where: { name: spec.name },
        update: {},
        create: spec,
      });
      createdSpecializations.push(specialization);
    } catch (error) {
      console.log(`Specialization ${spec.name} already exists or error occurred`);
    }
  }

  // Get all specializations for reference
  const allSpecializations = await prisma.specialization.findMany();
  console.log(`✅ Total specializations: ${allSpecializations.length}`);

  // Create Doctors with Ugandan names
  console.log('👨‍⚕️ Creating doctors...');
  const doctorData = [
    {
      firstName: 'Moses',
      lastName: 'Kiggundu',
      email: 'moses.kiggundu@hospital.com',
      phone: '+256-700-123-001',
      departmentId: allDepartments.find(d => d.name === 'Emergency Department')?.id || allDepartments[0].id,
    },
    {
      firstName: 'Grace',
      lastName: 'Nakamya',
      email: 'grace.nakamya@hospital.com',
      phone: '+256-700-123-002',
      departmentId: allDepartments.find(d => d.name === 'Internal Medicine')?.id || allDepartments[1].id,
    },
    {
      firstName: 'Samuel',
      lastName: 'Okello',
      email: 'samuel.okello@hospital.com',
      phone: '+256-700-123-003',
      departmentId: allDepartments.find(d => d.name === 'Surgery')?.id || allDepartments[2].id,
    },
    {
      firstName: 'Betty',
      lastName: 'Namugga',
      email: 'betty.namugga@hospital.com',
      phone: '+256-700-123-004',
      departmentId: allDepartments.find(d => d.name === 'Pediatrics')?.id || allDepartments[3].id,
    },
    {
      firstName: 'Peter',
      lastName: 'Ssemakula',
      email: 'peter.ssemakula@hospital.com',
      phone: '+256-700-123-005',
      departmentId: allDepartments.find(d => d.name === 'Cardiology')?.id || allDepartments[4].id,
    },
    {
      firstName: 'Joyce',
      lastName: 'Akello',
      email: 'joyce.akello@hospital.com',
      phone: '+256-700-123-006',
      departmentId: allDepartments.find(d => d.name === 'Orthopedics')?.id || allDepartments[5].id,
    },
    {
      firstName: 'Robert',
      lastName: 'Mugisha',
      email: 'robert.mugisha@hospital.com',
      phone: '+256-700-123-007',
      departmentId: allDepartments.find(d => d.name === 'Radiology')?.id || allDepartments[6].id,
    },
    {
      firstName: 'Agnes',
      lastName: 'Nakalema',
      email: 'agnes.nakalema@hospital.com',
      phone: '+256-700-123-008',
      departmentId: allDepartments.find(d => d.name === 'Anesthesiology')?.id || allDepartments[7].id,
    },
    {
      firstName: 'James',
      lastName: 'Ochieng',
      email: 'james.ochieng@hospital.com',
      phone: '+256-700-123-009',
      departmentId: allDepartments.find(d => d.name === 'Emergency Department')?.id || allDepartments[0].id,
    },
    {
      firstName: 'Sarah',
      lastName: 'Nassimbwa',
      email: 'sarah.nassimbwa@hospital.com',
      phone: '+256-700-123-010',
      departmentId: allDepartments.find(d => d.name === 'Internal Medicine')?.id || allDepartments[1].id,
    },
    {
      firstName: 'Daniel',
      lastName: 'Katende',
      email: 'daniel.katende@hospital.com',
      phone: '+256-700-123-011',
      departmentId: allDepartments.find(d => d.name === 'Obstetrics and Gynecology')?.id || allDepartments[0].id,
    },
    {
      firstName: 'Ruth',
      lastName: 'Nabukenya',
      email: 'ruth.nabukenya@hospital.com',
      phone: '+256-700-123-012',
      departmentId: allDepartments.find(d => d.name === 'Neurology')?.id || allDepartments[0].id,
    },
    {
      firstName: 'Francis',
      lastName: 'Ssali',
      email: 'francis.ssali@hospital.com',
      phone: '+256-700-123-013',
      departmentId: allDepartments.find(d => d.name === 'Psychiatry')?.id || allDepartments[0].id,
    },
    {
      firstName: 'Immaculate',
      lastName: 'Nalwoga',
      email: 'immaculate.nalwoga@hospital.com',
      phone: '+256-700-123-014',
      departmentId: allDepartments.find(d => d.name === 'Dermatology')?.id || allDepartments[0].id,
    },
    {
      firstName: 'Andrew',
      lastName: 'Kyeyune',
      email: 'andrew.kyeyune@hospital.com',
      phone: '+256-700-123-015',
      departmentId: allDepartments.find(d => d.name === 'Ophthalmology')?.id || allDepartments[0].id,
    },
  ];

  const createdDoctors = [];
  for (const doctor of doctorData) {
    try {
      const existingDoctor = await prisma.doctor.findUnique({
        where: { email: doctor.email }
      });
      
      if (!existingDoctor) {
        const newDoctor = await prisma.doctor.create({
          data: doctor,
        });
        createdDoctors.push(newDoctor);
      } else {
        console.log(`Doctor ${doctor.firstName} ${doctor.lastName} already exists`);
        createdDoctors.push(existingDoctor);
      }
    } catch (error) {
      console.log(`Error creating doctor ${doctor.firstName} ${doctor.lastName}:`, error.message);
    }
  }

  // Get all doctors for reference
  const allDoctors = await prisma.doctor.findMany();
  console.log(`✅ Total doctors: ${allDoctors.length}`);

  // Create Nurses with Ugandan names
  console.log('👩‍⚕️ Creating nurses...');
  const nurseData = [
    {
      firstName: 'Mariam',
      lastName: 'Nakato',
      email: 'mariam.nakato@hospital.com',
      phone: '+256-700-456-001',
      departmentId: allDepartments.find(d => d.name === 'Emergency Department')?.id || allDepartments[0].id,
    },
    {
      firstName: 'Denis',
      lastName: 'Kalyango',
      email: 'denis.kalyango@hospital.com',
      phone: '+256-700-456-002',
      departmentId: allDepartments.find(d => d.name === 'Internal Medicine')?.id || allDepartments[1].id,
    },
    {
      firstName: 'Esther',
      lastName: 'Nambi',
      email: 'esther.nambi@hospital.com',
      phone: '+256-700-456-003',
      departmentId: allDepartments.find(d => d.name === 'Surgery')?.id || allDepartments[2].id,
    },
    {
      firstName: 'Henry',
      lastName: 'Tumwine',
      email: 'henry.tumwine@hospital.com',
      phone: '+256-700-456-004',
      departmentId: allDepartments.find(d => d.name === 'Pediatrics')?.id || allDepartments[3].id,
    },
    {
      firstName: 'Winnie',
      lastName: 'Nalubega',
      email: 'winnie.nalubega@hospital.com',
      phone: '+256-700-456-005',
      departmentId: allDepartments.find(d => d.name === 'Cardiology')?.id || allDepartments[4].id,
    },
    {
      firstName: 'Joseph',
      lastName: 'Ssekandi',
      email: 'joseph.ssekandi@hospital.com',
      phone: '+256-700-456-006',
      departmentId: allDepartments.find(d => d.name === 'Orthopedics')?.id || allDepartments[5].id,
    },
    {
      firstName: 'Patricia',
      lastName: 'Namusoke',
      email: 'patricia.namusoke@hospital.com',
      phone: '+256-700-456-007',
      departmentId: allDepartments.find(d => d.name === 'Radiology')?.id || allDepartments[6].id,
    },
    {
      firstName: 'Simon',
      lastName: 'Kayongo',
      email: 'simon.kayongo@hospital.com',
      phone: '+256-700-456-008',
      departmentId: allDepartments.find(d => d.name === 'Anesthesiology')?.id || allDepartments[7].id,
    },
    {
      firstName: 'Christine',
      lastName: 'Namazzi',
      email: 'christine.namazzi@hospital.com',
      phone: '+256-700-456-009',
      departmentId: allDepartments.find(d => d.name === 'Obstetrics and Gynecology')?.id || allDepartments[0].id,
    },
    {
      firstName: 'Paul',
      lastName: 'Walusimbi',
      email: 'paul.walusimbi@hospital.com',
      phone: '+256-700-456-010',
      departmentId: allDepartments.find(d => d.name === 'Neurology')?.id || allDepartments[0].id,
    },
  ];

  const createdNurses = [];
  for (const nurse of nurseData) {
    try {
      const existingNurse = await prisma.nurse.findUnique({
        where: { email: nurse.email }
      });
      
      if (!existingNurse) {
        const newNurse = await prisma.nurse.create({
          data: nurse,
        });
        createdNurses.push(newNurse);
      } else {
        console.log(`Nurse ${nurse.firstName} ${nurse.lastName} already exists`);
        createdNurses.push(existingNurse);
      }
    } catch (error) {
      console.log(`Error creating nurse ${nurse.firstName} ${nurse.lastName}:`, error.message);
    }
  }

  // Get all nurses for reference
  const allNurses = await prisma.nurse.findMany();
  console.log(`✅ Total nurses: ${allNurses.length}`);

  // Assign specializations to doctors (check if relationship already exists)
  console.log('🔗 Assigning specializations to doctors...');
  
  const doctorSpecializations = [
    { doctorEmail: 'moses.kiggundu@hospital.com', specializationName: 'Emergency Medicine' },
    { doctorEmail: 'grace.nakamya@hospital.com', specializationName: 'Internal Medicine' },
    { doctorEmail: 'samuel.okello@hospital.com', specializationName: 'General Surgery' },
    { doctorEmail: 'betty.namugga@hospital.com', specializationName: 'Pediatric Care' },
    { doctorEmail: 'peter.ssemakula@hospital.com', specializationName: 'Cardiology' },
    { doctorEmail: 'joyce.akello@hospital.com', specializationName: 'Orthopedic Surgery' },
    { doctorEmail: 'robert.mugisha@hospital.com', specializationName: 'Radiology' },
    { doctorEmail: 'agnes.nakalema@hospital.com', specializationName: 'Anesthesiology' },
    { doctorEmail: 'james.ochieng@hospital.com', specializationName: 'Critical Care' },
    { doctorEmail: 'sarah.nassimbwa@hospital.com', specializationName: 'General Medicine' },
    { doctorEmail: 'daniel.katende@hospital.com', specializationName: 'Obstetrics and Gynecology' },
    { doctorEmail: 'ruth.nabukenya@hospital.com', specializationName: 'Neurology' },
    { doctorEmail: 'francis.ssali@hospital.com', specializationName: 'Psychiatry' },
    { doctorEmail: 'immaculate.nalwoga@hospital.com', specializationName: 'Dermatology' },
    { doctorEmail: 'andrew.kyeyune@hospital.com', specializationName: 'Ophthalmology' },
  ];

  let specializationCount = 0;
  for (const assignment of doctorSpecializations) {
    try {
      const doctor = await prisma.doctor.findUnique({
        where: { email: assignment.doctorEmail }
      });
      
      const specialization = await prisma.specialization.findUnique({
        where: { name: assignment.specializationName }
      });

      if (doctor && specialization) {
        const existingAssignment = await prisma.doctorSpecialization.findFirst({
          where: {
            doctorId: doctor.id,
            specializationId: specialization.id
          }
        });

        if (!existingAssignment) {
          await prisma.doctorSpecialization.create({
            data: {
              doctorId: doctor.id,
              specializationId: specialization.id,
            }
          });
          specializationCount++;
        }
      }
    } catch (error) {
      console.log(`Error assigning specialization:`, error.message);
    }
  }

  console.log(`✅ Created ${specializationCount} new doctor-specialization relationships`);

  // Create sample units
  console.log('🏢 Creating sample units...');
  const unitData = [
    { name: 'Emergency Room 1', departmentName: 'Emergency Department' },
    { name: 'Emergency Room 2', departmentName: 'Emergency Department' },
    { name: 'ICU Unit 1', departmentName: 'Internal Medicine' },
    { name: 'General Ward A', departmentName: 'Internal Medicine' },
    { name: 'Operating Theater 1', departmentName: 'Surgery' },
    { name: 'Operating Theater 2', departmentName: 'Surgery' },
    { name: 'Pediatric Ward', departmentName: 'Pediatrics' },
    { name: 'NICU', departmentName: 'Pediatrics' },
    { name: 'Cardiac Unit', departmentName: 'Cardiology' },
    { name: 'X-Ray Room', departmentName: 'Radiology' },
    { name: 'CT Scan Room', departmentName: 'Radiology' },
    { name: 'Recovery Room 1', departmentName: 'Anesthesiology' },
    { name: 'Recovery Room 2', departmentName: 'Anesthesiology' },
    { name: 'Administrative Office', departmentName: 'Administration' },
    { name: 'HR Office', departmentName: 'Human Resources' },
    { name: 'Delivery Room 1', departmentName: 'Obstetrics and Gynecology' },
    { name: 'Delivery Room 2', departmentName: 'Obstetrics and Gynecology' },
    { name: 'Neurology Ward', departmentName: 'Neurology' },
    { name: 'Psychiatry Ward', departmentName: 'Psychiatry' },
    { name: 'Dermatology Clinic', departmentName: 'Dermatology' },
    { name: 'Eye Clinic', departmentName: 'Ophthalmology' },
  ];

  let unitCount = 0;
  for (const unit of unitData) {
    try {
      const department = allDepartments.find(d => d.name === unit.departmentName);
      if (department) {
        const existingUnit = await prisma.unit.findUnique({
          where: { name: unit.name }
        });

        if (!existingUnit) {
          await prisma.unit.create({
            data: {
              name: unit.name,
              departmentId: department.id,
            }
          });
          unitCount++;
        }
      }
    } catch (error) {
      console.log(`Error creating unit ${unit.name}:`, error.message);
    }
  }

  console.log(`✅ Created ${unitCount} new units`);

  // Final count
  const finalDepartments = await prisma.department.count();
  const finalDoctors = await prisma.doctor.count();
  const finalNurses = await prisma.nurse.count();
  const finalSpecializations = await prisma.specialization.count();
  const finalUnits = await prisma.unit.count();
  const finalDoctorSpecializations = await prisma.doctorSpecialization.count();

  console.log('🎉 Seed process completed successfully!');
  console.log('\n📊 Final Summary:');
  console.log(`- Departments: ${finalDepartments}`);
  console.log(`- Specializations: ${finalSpecializations}`);
  console.log(`- Doctors: ${finalDoctors}`);
  console.log(`- Nurses: ${finalNurses}`);
  console.log(`- Units: ${finalUnits}`);
  console.log(`- Doctor-Specialization relationships: ${finalDoctorSpecializations}`);
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