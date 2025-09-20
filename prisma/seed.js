
const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Logging utility (unchanged from your script)
class Logger {
  constructor() {
    this.logs = [];
    this.errors = [];
    this.successes = [];
    this.skipped = [];
  }

  log(message) {
    console.log(message);
    this.logs.push(`[${new Date().toISOString()}] ${message}`);
  }

  error(message) {
    console.error(message);
    this.errors.push(`[${new Date().toISOString()}] ERROR: ${message}`);
  }

  success(message) {
    console.log(message);
    this.successes.push(`[${new Date().toISOString()}] SUCCESS: ${message}`);
  }

  skip(message) {
    console.log(message);
    this.skipped.push(`[${new Date().toISOString()}] SKIPPED: ${message}`);
  }

  generateReport() {
    const report = [
      '='.repeat(60),
      'DATABASE SEEDING REPORT',
      '='.repeat(60),
      `Generated at: ${new Date().toISOString()}`,
      '',
      `Total Operations: ${this.logs.length}`,
      `Successful Operations: ${this.successes.length}`,
      `Skipped Operations: ${this.skipped.length}`,
      `Failed Operations: ${this.errors.length}`,
      '',
      '='.repeat(60),
      'SUCCESSFUL OPERATIONS',
      '='.repeat(60),
      ...this.successes,
      '',
      '='.repeat(60),
      'SKIPPED OPERATIONS',
      '='.repeat(60),
      ...this.skipped,
      '',
      '='.repeat(60),
      'FAILED OPERATIONS',
      '='.repeat(60),
      ...this.errors,
      '',
      '='.repeat(60),
      'ALL LOGS',
      '='.repeat(60),
      ...this.logs,
    ].join('\n');

    return report;
  }

  async writeReportToFile() {
    const report = this.generateReport();
    const fileName = `seeding_report_${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
    const filePath = path.join(process.cwd(), fileName);
    
    try {
      await fs.promises.writeFile(filePath, report, 'utf8');
      this.log(`Report written to: ${filePath}`);
    } catch (error) {
      this.error(`Failed to write report file: ${error.message}`);
    }
  }
}

// Utility to generate random dates
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Lists of names provided
const firstNames = [
  'James', 'Michael', 'Robert', 'John', 'David', 'William', 'Richard', 'Christopher', 'Matthew', 'Anthony',
  'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua', 'Kenneth', 'Kevin', 'Brian', 'George',
  'Timothy', 'Ronald', 'Jason', 'Edward', 'Jeffrey', 'Ryan', 'Jacob', 'Gary', 'Nicholas', 'Eric',
  'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon', 'Benjamin', 'Samuel', 'Gregory', 'Alexander',
  'Patrick', 'Frank', 'Raymond', 'Jack', 'Dennis', 'Jerry', 'Tyler', 'Aaron', 'Jose', 'Henry',
  'Adam', 'Douglas', 'Nathan', 'Peter', 'Zachary', 'Kyle', 'Noah', 'Alan', 'Carl', 'Jeremy',
  'Keith', 'Sean', 'Arthur', 'Harold', 'Jordan', 'Lawrence', 'Wayne', 'Ralph', 'Roy', 'Eugene',
  'Louis', 'Philip', 'Bobby', 'Mason', 'Ethan', 'Lucas', 'Oliver', 'Liam', 'Elijah', 'Daniel',
  'Aiden', 'Jackson', 'Sebastian', 'Carter', 'Owen', 'Wyatt', 'Luke', 'Gabriel', 'Isaac', 'Grayson',
  'Julian', 'Levi', 'Hunter', 'Eli', 'Connor', 'Landon', 'Adrian', 'Asher', 'Cameron', 'Leo',
  'Theodore', 'Jeremiah', 'Hudson', 'Easton', 'Nolan', 'Ezra', 'Colton', 'Angel', 'Brayden', 'Jordan',
  'Dominic', 'Austin', 'Ian', 'Elias', 'Jaxson', 'Greyson', 'Jose', 'Ezekiel', 'Carson', 'Evan',
  'Maverick', 'Bryson', 'Jace', 'Cooper', 'Xavier', 'Parker', 'Roman', 'Santiago', 'Chase', 'Sawyer',
  'Gavin', 'Leonardo', 'Kayden', 'Ayden', 'Jameson', 'Kevin', 'Bentley', 'Zachary', 'Everett', 'Axel',
  'Tyler', 'Micah', 'Vincent', 'Weston', 'Miles', 'Wesley', 'Nathaniel', 'Harrison', 'Brandon', 'Cole',
  'Declan', 'Luis', 'Braxton', 'Damian', 'Silas', 'Tristan', 'Ryder', 'Bennett', 'George', 'Emmett',
  'Justin', 'Kai', 'Max', 'Diego', 'Luca', 'Ryker', 'Carlos', 'Maxwell', 'Kingston', 'Ivan',
  'Maddox', 'Juan', 'Ashton', 'Jayce', 'Rowan', 'Kaiden', 'Giovanni', 'Eric', 'Jesus', 'Calvin',
  'Abel', 'King', 'Camden', 'Amir', 'Blake', 'Alex', 'Brody', 'Malachi', 'Emmanuel', 'Jonah',
  'Beau', 'Jude', 'Antonio', 'Alan', 'Elliott', 'Elliot', 'Waylon', 'Xander', 'Timothy', 'Victor',
  'Bryce', 'Finn', 'Brantley', 'Edward', 'Abraham', 'Patrick', 'Grant', 'Karter', 'Hayden', 'Richard',
  'Miguel', 'Joel', 'Gael', 'Tucker', 'Rhett', 'Avery', 'Steven', 'Graham', 'Kaleb', 'Jasper',
  'Jesse', 'Matteo', 'Dean', 'Zayden', 'Preston', 'August', 'Oscar', 'Jeremy', 'Alejandro', 'Marcus',
  'Dawson', 'Lorenzo', 'Messiah', 'Zion', 'Maximus', 'River', 'Zane', 'Mark', 'Brooks', 'Nicolas',
  'Paxton', 'Judah', 'Emilio', 'Colt', 'Phoenix', 'Shepherd', 'McKenzie', 'Knox', 'Tanner', 'Gunnar',
  'Cody', 'Cruz', 'Israel', 'Amara', 'Sophia', 'Emma', 'Olivia', 'Ava', 'Isabella', 'Aria', 'Riley',
  'Amelia', 'Mia', 'Layla', 'Zoe', 'Camila', 'Charlotte', 'Nora', 'Lily', 'Zoey', 'Mila', 'Aubrey',
  'Hannah', 'Chloe', 'Madison', 'Leah', 'Elizabeth', 'Penelope', 'Lillian', 'Addison', 'Natalie', 'Scarlett',
  'Grace', 'Victoria', 'Anna', 'Abigail', 'Maya', 'Elena', 'Savannah', 'Claire', 'Stella', 'Aaliyah',
  'Violet', 'Hazel', 'Audrey', 'Lucy', 'Evelyn', 'Isla', 'Samantha', 'Naomi', 'Genesis', 'Allison',
  'Gabriella', 'Sarah', 'Madeline', 'Katherine', 'Julia', 'Jasmine', 'Serenity', 'Bella', 'Ariana', 'Piper',
  'Rylee', 'Paisley', 'Nevaeh', 'Kinsley', 'Luna', 'Nova', 'Willow', 'Delilah', 'Autumn', 'Skylar',
  'Ellie', 'Brooklyn', 'Kylie', 'Hailey', 'Lydia', 'Alyssa', 'Alexa', 'Melody', 'Mackenzie', 'Ruby',
  'Brielle', 'Maria', 'Cora', 'Reagan', 'Jade', 'Kaylee', 'Peyton', 'Sophie', 'Hadley', 'Raelynn',
  'Gianna', 'Valentina', 'Natalia', 'Josephine', 'Athena', 'Quinn', 'Emery', 'Adriana', 'Ivy', 'Andrea',
  'Khloe', 'Alexis', 'Makayla', 'Melanie', 'Brooke', 'Ashlyn', 'Kimberly', 'Leilani', 'Sadie', 'Destiny',
  'Everly', 'Paige', 'Ariel', 'Kayla', 'Eliana', 'Cecilia', 'Harmony', 'Sienna', 'Magnolia', 'Daisy',
  'Alicia', 'Ryleigh', 'Lilly', 'Arianna', 'Vivian', 'Amy', 'Annabelle', 'Hope', 'Londyn', 'Madelyn',
  'Eliza', 'Adalynn', 'Jocelyn', 'Daniela', 'Adelyn', 'Fiona', 'Alina', 'Juliana', 'Kaitlyn', 'Emilia',
  'Sloane', 'Valeria', 'Stephanie', 'Norah', 'Mya', 'Iris', 'Lyla', 'Alana', 'Callie', 'Molly',
  'Blakely', 'Reese', 'Margaret', 'Alaina', 'Kendall', 'Arabella', 'Presley', 'Lila', 'Esther', 'Maddison',
  'Ayla', 'Teagan', 'Marley', 'Jenna', 'Valerie', 'Gracie', 'Adalyn', 'Anastasia', 'Lilliana', 'Aliyah',
  'Lucia', 'Kinley', 'Megan', 'Brynlee', 'Kyla', 'Delaney', 'Jacqueline', 'Amira', 'Rosalie', 'Daniella',
  'Joanna', 'Celeste', 'Finley', 'Julianna', 'Noelle', 'Sawyer', 'Lola', 'Gabrielle', 'Kendra', 'Kyla',
  'Brielle', 'Tessa', 'Kehlani', 'Nyla', 'Eloise', 'Makenzie', 'Lyla', 'Mila', 'Adeline', 'Kaia',
  'Aliyah', 'Leila', 'Amira', 'Rosemary', 'Alanna', 'Kaitlyn', 'Mariana', 'Bianca', 'Fatima', 'Priya',
  'Zara', 'Laila', 'Amina', 'Sasha', 'Tamara', 'Ximena', 'Yasmin', 'Aaliyah', 'Amara', 'Anaya',
  'Ariana', 'Camila', 'Esperanza', 'Guadalupe', 'Isabela', 'Jada', 'Jaliyah', 'Khadijah', 'Kiara', 'Layla',
  'Leilani', 'Liliana', 'Marisol', 'Nyla', 'Paloma', 'Raquel', 'Samara', 'Selena', 'Serena', 'Sophia',
  'Valeria', 'Yara', 'Aaliyah', 'Adara', 'Amara', 'Aria', 'Asma', 'Ayanna', 'Azalea', 'Camille',
  'Dalia', 'Eliana', 'Esperanza', 'Fatima', 'Hala', 'Iman', 'Jasmin', 'Kaia', 'Layla', 'Leyla',
  'Maryam', 'Nia', 'Nora', 'Paloma', 'Rania', 'Samira', 'Sana', 'Tahlia', 'Yasmina', 'Zainab',
  'Zara', 'Adaora', 'Amara', 'Chioma', 'Folake', 'Ifeoma', 'Kemi', 'Ngozi', 'Nkechi', 'Obioma',
  'Temiloluwa', 'Titilayo', 'Yetunde', 'Zara', 'Akira', 'Emiko', 'Hana', 'Haruka', 'Keiko', 'Kimiko',
  'Maki', 'Naomi', 'Rei', 'Sakura', 'Yuki', 'Yuna', 'Ahana', 'Ananya', 'Diya', 'Kavya',
  'Priya', 'Riya', 'Sanya', 'Shreya', 'Tara', 'Zara', 'Mei', 'Xin', 'Ying', 'Li',
  'Jun', 'Yun', 'Hao', 'Wei', 'Yan', 'Ping', 'Anastasia', 'Ekaterina', 'Irina', 'Natasha',
  'Olga', 'Svetlana', 'Tatiana', 'Yelena', 'Aisha', 'Amina', 'Fatima', 'Khadija', 'Layla', 'Maryam',
  'Nadia', 'Safiya', 'Zara', 'Aaliyah', 'Esperanza', 'Fernanda', 'Gabriela', 'Isabella', 'Lucia', 'Maria',
  'Paloma', 'Sofia', 'Valeria', 'Astrid', 'Ingrid', 'Maja', 'Nora', 'Saga', 'Signe', 'Solveig',
  'Thea', 'Aoife', 'Ciara', 'Niamh', 'Orla', 'Roisin', 'Saoirse', 'Siobhan', 'Una', 'Brigitte',
  'Camille', 'Celeste', 'Eloise', 'Genevieve', 'Margot', 'Oceane', 'Sylvie', 'Chiara', 'Francesca', 'Giulia',
  'Isabella', 'Lucia', 'Martina', 'Sofia', 'Valentina', 'Alba', 'Carmen', 'Elena', 'Esperanza', 'Lucia',
  'Marta', 'Paloma', 'Sofia', 'Amara', 'Chiara', 'Elena', 'Giulia', 'Lucia', 'Martina', 'Sofia',
  'Valentina', 'Anna', 'Emma', 'Hanna', 'Lena', 'Maja', 'Nora', 'Saga', 'Astrid', 'Freya', 'Ingrid',
  'Maja', 'Nora', 'Saga', 'Thea', 'Elif', 'Emine', 'Fatma', 'Merve', 'Nur', 'Selin',
  'Zehra', 'Zeynep', 'Amal'
];

const lastNames = firstNames; // Use the same list for last names for simplicity and variety

// Utility to generate random phone numbers
const generatePhoneNumber = () => {
  const number = Math.floor(100000000 + Math.random() * 900000000);
  return `+256${number}`;
};

// Utility to generate unique policy number
const generatePolicyNumber = (index) => `POL${Date.now()}${index.toString().padStart(4, '0')}`;

// Utility to generate unique email
const generateEmail = (firstName, lastName, index, existingEmails) => {
  let baseEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@carewave.com`;
  let uniqueIndex = index;
  while (existingEmails.has(baseEmail)) {
    uniqueIndex++;
    baseEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${uniqueIndex}@carewave.com`;
  }
  return baseEmail;
};

async function main() {
  const logger = new Logger();
  
  try {
    logger.log('Starting database seeding for patients and admissions...');

    // Get existing data to avoid duplicates
    const existingPatients = await prisma.patient.findMany({
      select: { id: true, email: true }
    });
    const existingEmails = new Set(existingPatients.map(p => p.email).filter(Boolean));
    const existingPatientIds = new Set(existingPatients.map(p => p.id));
    const existingInsurance = await prisma.insuranceInfo.findMany({
      select: { policyNumber: true }
    });
    const existingPolicyNumbers = new Set(existingInsurance.map(i => i.policyNumber));
    const existingBeds = await prisma.bed.findMany({
      select: { id: true, bedNumber: true }
    });
    const existingBedNumbers = new Set(existingBeds.map(b => b.bedNumber));

    // Seed Departments if none exist
    let department = await prisma.department.findFirst({ where: { name: 'General Medicine' } });
    if (!department) {
      department = await prisma.department.create({
        data: {
          id: uuidv4(),
          name: 'General Medicine',
          departmentType: 'CLINICAL', // Fixed: Added required departmentType
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      logger.success('Created department: General Medicine');
    }

    // Seed Units for the department
    const unitNames = ['Cardiology Unit', 'Neurology Unit', 'General Medicine Unit'];
    const existingUnits = await prisma.unit.findMany({ where: { departmentId: department.id } });
    const existingUnitNames = new Set(existingUnits.map(u => u.name));
    const newUnits = unitNames
      .filter(name => !existingUnitNames.has(name))
      .map(name => ({
        id: uuidv4(),
        departmentId: department.id,
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

    logger.log(`Seeding ${newUnits.length} units...`);
    for (const unit of newUnits) {
      try {
        await prisma.unit.create({ data: unit });
        logger.success(`Created unit: ${unit.name}`);
      } catch (error) {
        logger.error(`Failed to create unit ${unit.name}: ${error.message}`);
      }
    }

    // Seed Wards if none exist
    let wards = await prisma.ward.findMany();
    if (wards.length === 0) {
      const wardNames = ['General Ward', 'ICU', 'Pediatric Ward', 'Maternity Ward'];
      wards = await Promise.all(
        wardNames.map(async (name, index) => {
          const ward = await prisma.ward.create({
            data: {
              id: uuidv4(),
              name,
              departmentId: department.id,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
          logger.success(`Created ward: ${name}`);
          return ward;
        })
      );
    }

    // Seed Beds if none exist
    let beds = await prisma.bed.findMany();
    if (beds.length < 100) {
      const newBeds = [];
      for (const ward of wards) {
        for (let i = 1; i <= 25; i++) {
          const bedNumber = `${ward.name.replace(/\s+/g, '')}-B${i.toString().padStart(3, '0')}`;
          if (!existingBedNumbers.has(bedNumber)) {
            newBeds.push({
              id: uuidv4(),
              wardId: ward.id,
              bedNumber,
              isOccupied: false,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            existingBedNumbers.add(bedNumber);
          }
        }
      }
      for (const bed of newBeds) {
        try {
          await prisma.bed.create({ data: bed });
          logger.success(`Created bed: ${bed.bedNumber}`);
        } catch (error) {
          logger.error(`Failed to create bed ${bed.bedNumber}: ${error.message}`);
        }
      }
      beds = await prisma.bed.findMany();
    }

    // Generate 5,000 new patient IDs
    const existingPatientsCount = await prisma.patient.count();
    const startIndex = existingPatientsCount + 1;
    const newPatientIds = Array.from({ length: 5000 }, (_, i) => `P-${(startIndex + i).toString().padStart(5, '0')}`);

    // Generate 5,000 new patients
    const newPatients = [];
    for (let i = 0; i < 5000; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const email = generateEmail(firstName, lastName, i, existingEmails);
      const patientId = newPatientIds[i];
      if (existingPatientIds.has(patientId) || existingEmails.has(email)) {
        logger.skip(`Skipping patient with ID ${patientId} or email ${email} due to conflict`);
        continue;
      }
      newPatients.push({
        id: patientId,
        firstName,
        lastName,
        dateOfBirth: randomDate(new Date('1960-01-01'), new Date('2010-01-01')),
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        phone: generatePhoneNumber(),
        email,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      existingEmails.add(email);
      existingPatientIds.add(patientId);
    }

    logger.log(`Seeding ${newPatients.length} new patients...`);
    const createdPatientIds = [];
    for (const patient of newPatients) {
      try {
        await prisma.patient.create({ data: patient });
        createdPatientIds.push(patient.id);
        logger.success(`Created patient: ${patient.firstName} ${patient.lastName} (${patient.id})`);
      } catch (error) {
        logger.error(`Failed to create patient ${patient.firstName} ${patient.lastName}: ${error.message}`);
      }
    }

    if (createdPatientIds.length === 0) {
      logger.log('No new patients created. Skipping related data seeding.');
      return;
    }

    // Seed Patient Addresses
    const addresses = createdPatientIds.map((patientId) => ({
      id: uuidv4(),
      patientId,
      street: `Street ${Math.floor(Math.random() * 1000)}`,
      city: ['Kampala', 'Mbale', 'Mbarara', 'Jinja', 'Masaka'][Math.floor(Math.random() * 5)],
      country: 'Uganda',
      postalCode: '00256',
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    logger.log(`Seeding ${addresses.length} patient addresses...`);
    for (const address of addresses) {
      try {
        await prisma.patientAddress.create({ data: address });
        logger.success(`Created address for patient in: ${address.city}`);
      } catch (error) {
        logger.error(`Failed to create address for patient ${address.patientId}: ${error.message}`);
      }
    }

    // Seed Next of Kin
    const nextOfKins = createdPatientIds.map((patientId) => ({
      id: uuidv4(),
      patientId,
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
      relationship: ['Husband', 'Wife', 'Father', 'Mother', 'Sister', 'Brother'][Math.floor(Math.random() * 6)],
      phone: generatePhoneNumber(),
      email: generateEmail(
        firstNames[Math.floor(Math.random() * firstNames.length)],
        lastNames[Math.floor(Math.random() * lastNames.length)],
        Math.floor(Math.random() * 1000),
        existingEmails
      ),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    logger.log(`Seeding ${nextOfKins.length} next of kin records...`);
    for (const nok of nextOfKins) {
      try {
        await prisma.nextOfKin.create({ data: nok });
        logger.success(`Created next of kin: ${nok.firstName} ${nok.lastName} for patient ${nok.patientId}`);
      } catch (error) {
        logger.error(`Failed to create next of kin for patient ${nok.patientId}: ${error.message}`);
      }
    }

    // Seed Insurance Info
    const insuranceInfos = createdPatientIds.map((patientId, index) => {
      const policyNumber = generatePolicyNumber(index);
      return {
        id: uuidv4(),
        patientId,
        provider: ['UAP Old Mutual', 'Jubilee Insurance', 'AIG Uganda', 'Stanbic General Insurance', 'National Insurance Corporation'][Math.floor(Math.random() * 5)],
        policyNumber,
        expiryDate: randomDate(new Date('2026-01-01'), new Date('2030-01-01')),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }).filter(ins => !existingPolicyNumbers.has(ins.policyNumber));

    logger.log(`Seeding ${insuranceInfos.length} insurance records...`);
    for (const insurance of insuranceInfos) {
      try {
        await prisma.insuranceInfo.create({ data: insurance });
        logger.success(`Created insurance for patient ${insurance.patientId} with provider: ${insurance.provider}`);
      } catch (error) {
        logger.error(`Failed to create insurance for patient ${insurance.patientId}: ${error.message}`);
      }
    }

    // Seed Admissions (1,000 admissions)
    const admissionPatients = createdPatientIds.slice(0, 1000); // Select first 1,000 patients
    const availableBeds = await prisma.bed.findMany({ where: { isOccupied: false } });
    const admissions = [];
    for (let i = 0; i < 1000 && i < admissionPatients.length && availableBeds.length > 0; i++) {
      const bed = availableBeds[Math.floor(Math.random() * availableBeds.length)];
      const ward = wards.find(w => w.id === bed.wardId);
      admissions.push({
        id: uuidv4(),
        patientId: admissionPatients[i],
        wardId: ward.id,
        bedId: bed.id,
        admissionDate: randomDate(new Date('2025-01-01'), new Date('2025-07-14')),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    logger.log(`Seeding ${admissions.length} admissions...`);
    const createdAdmissions = [];
    for (const admission of admissions) {
      try {
        await prisma.$transaction(async (tx) => {
          await tx.admission.create({ data: admission });
          await tx.bed.update({
            where: { id: admission.bedId },
            data: { isOccupied: true },
          });
        });
        createdAdmissions.push(admission);
        logger.success(`Created admission for patient: ${admission.patientId}`);
      } catch (error) {
        logger.error(`Failed to create admission for patient ${admission.patientId}: ${error.message}`);
      }
    }

    // Seed Medical Records (one per admission, plus some non-admission records)
    const medicalRecords = [
      ...createdAdmissions.map((admission) => ({
        id: uuidv4(),
        patientId: admission.patientId,
        admissionId: admission.id,
        recordDate: admission.admissionDate,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      ...createdPatientIds.slice(1000, 1500).map((patientId) => ({
        id: uuidv4(),
        patientId,
        recordDate: randomDate(new Date('2025-01-01'), new Date('2025-07-14')),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    ];

    logger.log(`Seeding ${medicalRecords.length} medical records...`);
    const createdMedicalRecords = [];
    for (const record of medicalRecords) {
      try {
        await prisma.medicalRecord.create({ data: record });
        createdMedicalRecords.push(record);
        logger.success(`Created medical record for patient: ${record.patientId}`);
      } catch (error) {
        logger.error(`Failed to create medical record for patient ${record.patientId}: ${error.message}`);
      }
    }

    // Seed Allergies
    const allergies = createdMedicalRecords.map((record) => ({
      id: uuidv4(),
      medicalRecordId: record.id,
      name: ['Dust Mites', 'Shellfish', 'Pollen', 'Peanuts', 'Penicillin'][Math.floor(Math.random() * 5)],
      severity: ['Mild', 'Moderate', 'Severe'][Math.floor(Math.random() * 3)],
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    logger.log(`Seeding ${allergies.length} allergies...`);
    for (const allergy of allergies) {
      try {
        await prisma.allergy.create({ data: allergy });
        logger.success(`Created allergy: ${allergy.name} for medical record ${allergy.medicalRecordId}`);
      } catch (error) {
        logger.error(`Failed to create allergy for medical record ${allergy.medicalRecordId}: ${error.message}`);
      }
    }

    // Seed Diagnoses
    const diagnoses = createdMedicalRecords.map((record) => ({
      id: uuidv4(),
      medicalRecordId: record.id,
      code: `ICD10-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      description: ['Asthma', 'Malaria', 'Hypertension', 'Diabetes', 'Pneumonia'][Math.floor(Math.random() * 5)],
      diagnosedAt: record.recordDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    logger.log(`Seeding ${diagnoses.length} diagnoses...`);
    for (const diagnosis of diagnoses) {
      try {
        await prisma.diagnosis.create({ data: diagnosis });
        logger.success(`Created diagnosis: ${diagnosis.description} for medical record ${diagnosis.medicalRecordId}`);
      } catch (error) {
        logger.error(`Failed to create diagnosis for medical record ${diagnosis.medicalRecordId}: ${error.message}`);
      }
    }

    // Seed Vital Signs
    const vitalSigns = createdMedicalRecords.map((record) => ({
      id: uuidv4(),
      medicalRecordId: record.id,
      bloodPressure: ['120/80', '130/85', '135/90', '125/80', '140/90'][Math.floor(Math.random() * 5)],
      heartRate: 60 + Math.floor(Math.random() * 40),
      temperature: 36.5 + Math.random() * 1.5,
      respiratoryRate: 12 + Math.floor(Math.random() * 8),
      oxygenSaturation: 92 + Math.floor(Math.random() * 8),
      recordedAt: record.recordDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    logger.log(`Seeding ${vitalSigns.length} vital signs...`);
    for (const vitalSign of vitalSigns) {
      try {
        await prisma.vitalSign.create({ data: vitalSign });
        logger.success(`Created vital sign for medical record: ${vitalSign.medicalRecordId}`);
      } catch (error) {
        logger.error(`Failed to create vital sign for medical record ${vitalSign.medicalRecordId}: ${error.message}`);
      }
    }

    // Seed Chief Complaints
    const chiefComplaints = createdMedicalRecords.map((record) => ({
      id: uuidv4(),
      medicalRecordId: record.id,
      description: ['Chronic cough', 'Fever', 'Joint pain', 'Chest pain', 'Fatigue'][Math.floor(Math.random() * 5)],
      duration: ['1 week', '2 weeks', '3 weeks', '1 month'][Math.floor(Math.random() * 4)],
      onset: ['Sudden', 'Gradual'][Math.floor(Math.random() * 2)],
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    logger.log(`Seeding ${chiefComplaints.length} chief complaints...`);
    for (const complaint of chiefComplaints) {
      try {
        await prisma.chiefComplaint.create({ data: complaint });
        logger.success(`Created chief complaint for medical record: ${complaint.medicalRecordId}`);
      } catch (error) {
        logger.error(`Failed to create chief complaint for medical record ${complaint.medicalRecordId}: ${error.message}`);
      }
    }

    // Seed Present Illness
    const presentIllnesses = createdMedicalRecords.map((record) => ({
      id: uuidv4(),
      medicalRecordId: record.id,
      narrative: ['Patient reports chronic cough with sputum.', 'Recurring fever with chills.', 'Joint pain in knees.', 'Chest pain on exertion.', 'Persistent fatigue.'][Math.floor(Math.random() * 5)],
      severity: ['Mild', 'Moderate', 'Severe'][Math.floor(Math.random() * 3)],
      progress: ['Improving', 'Stable', 'Worsening'][Math.floor(Math.random() * 3)],
      associatedSymptoms: ['Wheezing', 'Fatigue', 'Swelling', 'Dyspnea', 'Nausea'][Math.floor(Math.random() * 5)],
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    logger.log(`Seeding ${presentIllnesses.length} present illnesses...`);
    for (const illness of presentIllnesses) {
      try {
        await prisma.presentIllness.create({ data: illness });
        logger.success(`Created present illness for medical record: ${illness.medicalRecordId}`);
      } catch (error) {
        logger.error(`Failed to create present illness for medical record ${illness.medicalRecordId}: ${error.message}`);
      }
    }

    // Seed Past Medical Conditions
    const pastMedicalConditions = createdMedicalRecords.map((record) => ({
      id: uuidv4(),
      medicalRecordId: record.id,
      condition: ['Tuberculosis', 'Typhoid', 'Arthritis', 'Diabetes', 'Hypertension'][Math.floor(Math.random() * 5)],
      diagnosisDate: randomDate(new Date('2015-01-01'), new Date('2024-01-01')),
      notes: 'Treated and resolved',
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    logger.log(`Seeding ${pastMedicalConditions.length} past medical conditions...`);
    for (const condition of pastMedicalConditions) {
      try {
        await prisma.pastMedicalCondition.create({ data: condition });
        logger.success(`Created past medical condition: ${condition.condition} for medical record ${condition.medicalRecordId}`);
      } catch (error) {
        logger.error(`Failed to create past medical condition for medical record ${condition.medicalRecordId}: ${error.message}`);
      }
    }

    // Seed Medication History
    const medicationHistories = createdMedicalRecords.map((record) => ({
      id: uuidv4(),
      medicalRecordId: record.id,
      medicationName: ['Salbutamol', 'Ciprofloxacin', 'Ibuprofen', 'Metformin', 'Amlodipine'][Math.floor(Math.random() * 5)],
      dosage: ['10mg', '500mg', '200mg', '100mg', '5mg'][Math.floor(Math.random() * 5)],
      frequency: ['Twice daily', 'Once daily', 'As needed'][Math.floor(Math.random() * 3)],
      startDate: randomDate(new Date('2023-01-01'), new Date('2025-01-01')),
      isCurrent: Math.random() > 0.5,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    logger.log(`Seeding ${medicationHistories.length} medication histories...`);
    for (const medication of medicationHistories) {
      try {
        await prisma.medicationHistory.create({ data: medication });
        logger.success(`Created medication history: ${medication.medicationName} for medical record ${medication.medicalRecordId}`);
      } catch (error) {
        logger.error(`Failed to create medication history for medical record ${medication.medicalRecordId}: ${error.message}`);
      }
    }

    // Seed Social History
    const socialHistories = createdMedicalRecords.map((record) => ({
      id: uuidv4(),
      medicalRecordId: record.id,
      smokingStatus: ['Non-smoker', 'Current smoker', 'Former smoker'][Math.floor(Math.random() * 3)],
      alcoholUse: ['None', 'Occasional', 'Regular'][Math.floor(Math.random() * 3)],
      occupation: ['Nurse', 'Driver', 'Trader', 'Teacher', 'Farmer'][Math.floor(Math.random() * 5)],
      maritalStatus: ['Single', 'Married', 'Divorced'][Math.floor(Math.random() * 3)],
      livingSituation: ['Lives alone', 'With family', 'With partner'][Math.floor(Math.random() * 3)],
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    logger.log(`Seeding ${socialHistories.length} social histories...`);
    for (const history of socialHistories) {
      try {
        await prisma.socialHistory.create({ data: history });
        logger.success(`Created social history for medical record: ${history.medicalRecordId}`);
      } catch (error) {
        logger.error(`Failed to create social history for medical record ${history.medicalRecordId}: ${error.message}`);
      }
    }

    // Seed Discharges (for half of the admissions)
    const discharges = createdAdmissions.slice(0, 500).map((admission) => ({
      id: uuidv4(),
      admissionId: admission.id,
      dischargeDate: randomDate(admission.admissionDate, new Date('2025-07-14')),
      notes: 'Patient discharged in stable condition',
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    logger.log(`Seeding ${discharges.length} discharges...`);
    for (const discharge of discharges) {
      try {
        await prisma.$transaction(async (tx) => {
          await tx.discharge.create({ data: discharge });
          const admission = createdAdmissions.find(a => a.id === discharge.admissionId);
          await tx.bed.update({
            where: { id: admission.bedId },
            data: { isOccupied: false },
          });
        });
        logger.success(`Created discharge for admission: ${discharge.admissionId}`);
      } catch (error) {
        logger.error(`Failed to create discharge for admission ${discharge.admissionId}: ${error.message}`);
      }
    }

    // Seed Transfers (for 200 admissions)
    const transfers = createdAdmissions.slice(500, 700).map((admission) => {
      const fromWard = wards.find(w => w.id === admission.wardId);
      const toWard = wards.filter(w => w.id !== fromWard.id)[Math.floor(Math.random() * (wards.length - 1))];
      const availableBeds = beds.filter(b => b.wardId === toWard.id && !b.isOccupied);
      if (availableBeds.length === 0) return null;
      const toBed = availableBeds[Math.floor(Math.random() * availableBeds.length)];
      return {
        id: uuidv4(),
        admissionId: admission.id,
        fromWardId: fromWard.id,
        toWardId: toWard.id,
        transferDate: randomDate(admission.admissionDate, new Date('2025-07-14')),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }).filter(t => t !== null);

    logger.log(`Seeding ${transfers.length} transfers...`);
    for (const transfer of transfers) {
      try {
        await prisma.$transaction(async (tx) => {
          await tx.transfer.create({ data: transfer });
          const admission = createdAdmissions.find(a => a.id === transfer.admissionId);
          const toBed = beds.find(b => b.wardId === transfer.toWardId && !b.isOccupied);
          if (toBed) {
            await tx.bed.update({
              where: { id: admission.bedId },
              data: { isOccupied: false },
            });
            await tx.bed.update({
              where: { id: toBed.id },
              data: { isOccupied: true },
            });
            await tx.admission.update({
              where: { id: admission.id },
              data: { wardId: transfer.toWardId, bedId: toBed.id },
            });
          }
        });
        logger.success(`Created transfer for admission: ${transfer.admissionId}`);
      } catch (error) {
        logger.error(`Failed to create transfer for admission ${transfer.admissionId}: ${error.message}`);
      }
    }

    logger.log('Database seeding completed successfully!');
    logger.log(`Total patients attempted: ${newPatients.length}`);
    logger.log(`Total patients created: ${createdPatientIds.length}`);
    logger.log(`Total admissions created: ${createdAdmissions.length}`);
    logger.log(`Total medical records created: ${createdMedicalRecords.length}`);

  } catch (error) {
    logger.error(`Seeding failed with error: ${error.message}`);
    logger.error(`Stack trace: ${error.stack}`);
  } finally {
    await logger.writeReportToFile();
    await prisma.$disconnect();
    logger.log('Database connection closed.');
  }
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  });
