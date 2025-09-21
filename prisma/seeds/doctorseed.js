const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper function to generate random Ugandan phone number
function generatePhoneNumber() {
  const prefixes = ['+256700', '+256701', '+256702', '+256703', '+256704', '+256705', '+256706', '+256707', '+256708', '+256709'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}${number}`;
}

// Helper function to generate random doctor ID
async function generateDoctorId(index) {
  return `D-${(index + 1).toString().padStart(4, '0')}`;
}

async function main() {
  console.log('🌱 Starting seed process...');

  // Lists of names
  const firstNames = [
    'John', 'Mary', 'James', 'Sarah', 'David', 'Esther', 'Peter', 'Grace', 'Michael', 'Jane',
    'Robert', 'Ruth', 'Joseph', 'Lillian', 'Thomas', 'Elizabeth', 'Charles', 'Patricia', 'Daniel', 'Nancy',
    'William', 'Margaret', 'George', 'Dorothy', 'Paul', 'Betty', 'Steven', 'Helen', 'Richard', 'Susan',
    'Edward', 'Barbara', 'Andrew', 'Linda', 'Mark', 'Jennifer', 'Stephen', 'Deborah', 'Kenneth', 'Carol',
    'Donald', 'Karen', 'Ronald', 'Cynthia', 'Philip', 'Sharon', 'Patrick', 'Rebecca', 'Brian', 'Laura',
    'Christopher', 'Amy', 'Dennis', 'Shirley', 'Timothy', 'Angela', 'Kevin', 'Pamela', 'Jeffrey', 'Debra',
    'Gary', 'Katherine', 'Eric', 'Kathleen', 'Jonathan', 'Janet', 'Samuel', 'Lisa', 'Benjamin', 'Christine',
    'Frank', 'Ann', 'Henry', 'Joyce', 'Lawrence', 'Diane', 'Raymond', 'Virginia', 'Albert', 'Gloria',
    'Walter', 'Judith', 'Jerry', 'Brenda', 'Arthur', 'Cheryl', 'Douglas', 'Martha', 'Roger', 'Carolyn',
    'Gerald', 'Joan', 'Keith', 'Frances', 'Harold', 'Beverly', 'Carl', 'Alice', 'Bruce', 'Rose'
  ];

  const lastNames = [
    'Kato', 'Namugerwa', 'Okello', 'Nakamya', 'Mugisha', 'Nalubega', 'Ssemakula', 'Nassali', 'Kyeyune', 'Nabukenya',
    'Ochieng', 'Namazzi', 'Tumwine', 'Nakalema', 'Ssali', 'Nakato', 'Kalyango', 'Nambi', 'Ssekandi', 'Namusoke',
    'Kayongo', 'Namugga', 'Akello', 'Kiggundu', 'Walusimbi', 'Nabirye', 'Mukasa', 'Nansubuga', 'Lubega', 'Nankya',
    'Muwonge', 'Namubiru', 'Kizito', 'Nalwoga', 'Mukwaya', 'Nabatanzi', 'Ssekitoleko', 'Nalukwago', 'Mwesigwa', 'Nabwire',
    'Kibira', 'Namuli', 'Ssekyanzi', 'Naggayi', 'Muwanga', 'Nalule', 'Kisakye', 'Namutebi', 'Ssebunya', 'Nansamba',
    'Mukalazi', 'Namugenyi', 'Ssentongo', 'Nababi', 'Mukibi', 'Namirimu', 'Ssebuguzi', 'Naluyima', 'Mukooza', 'Nabiruma',
    'Ssemanda', 'Namukasa', 'Kiwanuka', 'Nabawesi', 'Mugalu', 'Namuddu', 'Ssebulime', 'Nabakooza', 'Mukembo', 'Namuyanja',
    'Ssewanyana', 'Nabasinga', 'Mukasa', 'Namukwaya', 'Ssebowa', 'Nabatanzi', 'Mukwayanzo', 'Namugenyi', 'Ssekimpi', 'Nabukenya',
    'Muwanika', 'Namukose', 'Ssekiziyivu', 'Nabukalu', 'Mukalazi', 'Namutosi', 'Ssenyonga', 'Nabiryo', 'Mukwanga', 'Namulindwa',
    'Ssebaduka', 'Nabukwasi', 'Mukisa', 'Namukwaya', 'Ssekabira', 'Nabukera', 'Muwonge', 'Namuganza', 'Ssemwanga', 'Nabukalu'
  ];

  // Additional departments
  const additionalDepartments = [
    { name: 'Oncology', departmentType: 'CLINICAL' },
    { name: 'Urology', departmentType: 'CLINICAL' },
    { name: 'Gastroenterology', departmentType: 'CLINICAL' },
    { name: 'Endocrinology', departmentType: 'CLINICAL' },
    { name: 'Rheumatology', departmentType: 'CLINICAL' },
    { name: 'Nephrology', departmentType: 'CLINICAL' },
    { name: 'Hematology', departmentType: 'CLINICAL' },
    { name: 'Infectious Diseases', departmentType: 'CLINICAL' },
    { name: 'Pulmonology', departmentType: 'CLINICAL' },
    { name: 'Allergy and Immunology', departmentType: 'CLINICAL' },
    { name: 'Geriatrics', departmentType: 'CLINICAL' },
    { name: 'Physical Therapy', departmentType: 'CLINICAL' },
    { name: 'Occupational Therapy', departmentType: 'CLINICAL' },
    { name: 'Speech Therapy', departmentType: 'CLINICAL' },
    { name: 'Pathology', departmentType: 'CLINICAL' },
    { name: 'Pharmacy', departmentType: 'SUPPORT' },
    { name: 'Laboratory Services', departmentType: 'SUPPORT' },
    { name: 'Medical Records', departmentType: 'ADMINISTRATIVE' },
    { name: 'Billing', departmentType: 'ADMINISTRATIVE' },
    { name: 'IT Services', departmentType: 'SUPPORT' },
    { name: 'Maintenance', departmentType: 'SUPPORT' },
    { name: 'Security', departmentType: 'SUPPORT' },
    { name: 'Housekeeping', departmentType: 'SUPPORT' },
    { name: 'Nutrition Services', departmentType: 'SUPPORT' },
    { name: 'Chaplaincy', departmentType: 'SUPPORT' },
    { name: 'Social Work', departmentType: 'SUPPORT' },
    { name: 'Quality Assurance', departmentType: 'ADMINISTRATIVE' },
    { name: 'Patient Services', departmentType: 'SUPPORT' },
    { name: 'Volunteer Services', departmentType: 'SUPPORT' },
    { name: 'Transport Services', departmentType: 'SUPPORT' },
    { name: 'Palliative Care', departmentType: 'CLINICAL' },
    { name: 'Rehabilitation Services', departmentType: 'CLINICAL' },
    { name: 'Pain Management', departmentType: 'CLINICAL' },
    { name: 'Sleep Medicine', departmentType: 'CLINICAL' },
    { name: 'Sports Medicine', departmentType: 'CLINICAL' }
  ];

  // Additional specializations
  const additionalSpecializations = [
    { name: 'Oncology', description: 'Cancer treatment and care' },
    { name: 'Urology', description: 'Urinary tract and male reproductive system' },
    { name: 'Gastroenterology', description: 'Digestive system disorders' },
    { name: 'Endocrinology', description: 'Hormonal and metabolic disorders' },
    { name: 'Rheumatology', description: 'Autoimmune and musculoskeletal disorders' },
    { name: 'Nephrology', description: 'Kidney diseases and treatment' },
    { name: 'Hematology', description: 'Blood disorders and diseases' },
    { name: 'Infectious Diseases', description: 'Infectious disease management' },
    { name: 'Pulmonology', description: 'Respiratory system disorders' },
    { name: 'Allergy and Immunology', description: 'Allergic and immune system disorders' },
    { name: 'Geriatrics', description: 'Elderly care and age-related conditions' },
    { name: 'Physical Medicine', description: 'Physical rehabilitation and therapy' },
    { name: 'Occupational Medicine', description: 'Work-related health issues' },
    { name: 'Speech Pathology', description: 'Speech and language disorders' },
    { name: 'Pathology', description: 'Disease diagnosis through laboratory analysis' },
    { name: 'Clinical Pharmacology', description: 'Medication management and therapy' },
    { name: 'Neonatology', description: 'Newborn intensive care' },
    { name: 'Vascular Surgery', description: 'Blood vessel surgery' },
    { name: 'Thoracic Surgery', description: 'Chest surgery' },
    { name: 'Plastic Surgery', description: 'Reconstructive and cosmetic surgery' },
    { name: 'Neurosurgery', description: 'Brain and spinal surgery' },
    { name: 'Cardiothoracic Surgery', description: 'Heart and chest surgery' },
    { name: 'Pediatric Surgery', description: 'Surgical care for children' },
    { name: 'Bariatric Surgery', description: 'Weight loss surgery' },
    { name: 'Colorectal Surgery', description: 'Colon and rectal surgery' },
    { name: 'Hepatology', description: 'Liver diseases and treatment' },
    { name: 'Medical Genetics', description: 'Genetic disorders and testing' },
    { name: 'Nuclear Medicine', description: 'Radioactive substances in diagnosis' },
    { name: 'Pain Medicine', description: 'Chronic pain management' },
    { name: 'Palliative Medicine', description: 'End-of-life care and symptom management' },
    { name: 'Sleep Medicine', description: 'Sleep disorders and treatment' },
    { name: 'Sports Medicine', description: 'Sports-related injuries and prevention' },
    { name: 'Transplant Surgery', description: 'Organ transplantation' },
    { name: 'Trauma Surgery', description: 'Acute injury treatment' },
    { name: 'Interventional Radiology', description: 'Minimally invasive image-guided procedures' }
  ];

  // Additional units
  const additionalUnits = [
    { name: 'Oncology Ward', departmentName: 'Oncology' },
    { name: 'Urology Clinic', departmentName: 'Urology' },
    { name: 'Gastroenterology Lab', departmentName: 'Gastroenterology' },
    { name: 'Endocrinology Clinic', departmentName: 'Endocrinology' },
    { name: 'Rheumatology Clinic', departmentName: 'Rheumatology' },
    { name: 'Dialysis Unit', departmentName: 'Nephrology' },
    { name: 'Hematology Lab', departmentName: 'Hematology' },
    { name: 'Infectious Disease Isolation', departmentName: 'Infectious Diseases' },
    { name: 'Pulmonary Function Lab', departmentName: 'Pulmonology' },
    { name: 'Allergy Testing Lab', departmentName: 'Allergy and Immunology' },
    { name: 'Geriatric Ward', departmentName: 'Geriatrics' },
    { name: 'Physical Therapy Gym', departmentName: 'Physical Therapy' },
    { name: 'Occupational Therapy Room', departmentName: 'Occupational Therapy' },
    { name: 'Speech Therapy Room', departmentName: 'Speech Therapy' },
    { name: 'Pathology Lab', departmentName: 'Pathology' },
    { name: 'Pharmacy Dispensary', departmentName: 'Pharmacy' },
    { name: 'Main Laboratory', departmentName: 'Laboratory Services' },
    { name: 'Records Office', departmentName: 'Medical Records' },
    { name: 'Billing Office', departmentName: 'Billing' },
    { name: 'IT Support Center', departmentName: 'IT Services' }
  ];

  // Create additional departments
  const createdDepartments = [];
  for (const dept of additionalDepartments) {
    const department = await prisma.department.upsert({
      where: { name: dept.name },
      update: {},
      create: dept,
    });
    createdDepartments.push(department);
  }

  // Get all departments
  const allDepartments = await prisma.department.findMany();

  // Create additional specializations
  const createdSpecializations = [];
  for (const spec of additionalSpecializations) {
    const specialization = await prisma.specialization.upsert({
      where: { name: spec.name },
      update: {},
      create: spec,
    });
    createdSpecializations.push(specialization);
  }

  // Get all specializations
  const allSpecializations = await prisma.specialization.findMany();

  // Create doctors
  const existingDoctorCount = await prisma.doctor.count();
  const doctorData = [];
  for (let i = 0; i < 1000; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@carewave.com`;
    doctorData.push({
      firstName,
      lastName,
      email,
      phone: generatePhoneNumber(),
      departmentId: allDepartments[Math.floor(Math.random() * allDepartments.length)].id,
    });
  }

  const createdDoctors = [];
  for (const doctor of doctorData) {
    const existingDoctor = await prisma.doctor.findUnique({
      where: { email: doctor.email }
    });
    
    if (!existingDoctor) {
      const newDoctor = await prisma.doctor.create({
        data: doctor,
      });
      createdDoctors.push(newDoctor);
    }
  }

  // Assign specializations to doctors
  for (const doctor of createdDoctors) {
    const specializationCount = Math.floor(Math.random() * 3) + 1;
    const assignedSpecializations = new Set();
    
    for (let i = 0; i < specializationCount; i++) {
      const specialization = allSpecializations[Math.floor(Math.random() * allSpecializations.length)];
      if (!assignedSpecializations.has(specialization.id)) {
        await prisma.doctorSpecialization.create({
          data: {
            doctorId: doctor.id,
            specializationId: specialization.id,
          }
        });
        assignedSpecializations.add(specialization.id);
      }
    }
  }

  // Create nurses
  const nurseData = [];
  for (let i = 0; i < 500; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@carewave.com`;
    nurseData.push({
      firstName,
      lastName,
      email,
      phone: generatePhoneNumber(),
      departmentId: allDepartments[Math.floor(Math.random() * allDepartments.length)].id,
    });
  }

  const createdNurses = [];
  for (const nurse of nurseData) {
    const existingNurse = await prisma.nurse.findUnique({
      where: { email: nurse.email }
    });
    
    if (!existingNurse) {
      const newNurse = await prisma.nurse.create({
        data: nurse,
      });
      createdNurses.push(newNurse);
    }
  }

  // Create additional units
  let unitCount = 0;
  for (const unit of additionalUnits) {
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
  }

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