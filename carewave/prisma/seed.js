const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Logging utility
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

async function main() {
  const logger = new Logger();
  
  try {
    logger.log('Starting database seeding for additional patients...');

    // Get existing patient emails and policy numbers to avoid duplicates
    const existingPatients = await prisma.patient.findMany({
      select: { email: true, id: true }
    });
    const existingEmails = new Set(existingPatients.map(p => p.email).filter(Boolean));
    const existingPatientIds = new Set(existingPatients.map(p => p.id));

    const existingInsurance = await prisma.insuranceInfo.findMany({
      select: { policyNumber: true }
    });
    const existingPolicyNumbers = new Set(existingInsurance.map(i => i.policyNumber));

    // Get the count of existing patients to continue the ID sequence
    const existingPatientsCount = await prisma.patient.count();
    const startIndex = existingPatientsCount + 1;

    // Generate new patient IDs in the format P-XXXXX
    const newPatientIds = Array.from({ length: 20 }, (_, i) => `P-${(startIndex + i).toString().padStart(5, '0')}`);

    // Seed 20 new Patients with Ugandan names
    const newPatients = [
      {
        id: newPatientIds[0],
        firstName: 'Florence',
        lastName: 'Nalwanga',
        dateOfBirth: new Date('1990-03-22'),
        gender: 'Female',
        phone: '+256740123456',
        email: 'florence.nalwanga@example.com',
      },
      {
        id: newPatientIds[1],
        firstName: 'Emmanuel',
        lastName: 'Wabwire',
        dateOfBirth: new Date('1985-07-14'),
        gender: 'Male',
        phone: '+256741234567',
        email: 'emmanuel.wabwire@example.com',
      },
      {
        id: newPatientIds[2],
        firstName: 'Catherine',
        lastName: 'Namuddu',
        dateOfBirth: new Date('1998-01-30'),
        gender: 'Female',
        phone: '+256742345678',
        email: 'catherine.namuddu@example.com',
      },
      {
        id: newPatientIds[3],
        firstName: 'Isaac',
        lastName: 'Byarugaba',
        dateOfBirth: new Date('1987-10-05'),
        gender: 'Male',
        phone: '+256743456789',
        email: 'isaac.byarugaba@example.com',
      },
      {
        id: newPatientIds[4],
        firstName: 'Ruth',
        lastName: 'Nakimuli',
        dateOfBirth: new Date('1993-05-12'),
        gender: 'Female',
        phone: '+256744567890',
        email: 'ruth.nakimuli@example.com',
      },
      {
        id: newPatientIds[5],
        firstName: 'Vincent',
        lastName: 'Okot',
        dateOfBirth: new Date('1982-09-28'),
        gender: 'Male',
        phone: '+256745678901',
        email: 'vincent.okot@example.com',
      },
      {
        id: newPatientIds[6],
        firstName: 'Priscilla',
        lastName: 'Nansubuga',
        dateOfBirth: new Date('1995-12-15'),
        gender: 'Female',
        phone: '+256746789012',
        email: 'priscilla.nansubuga@example.com',
      },
      {
        id: newPatientIds[7],
        firstName: 'Ronald',
        lastName: 'Mugisha',
        dateOfBirth: new Date('1988-04-03'),
        gender: 'Male',
        phone: '+256747890123',
        email: 'ronald.mugisha@example.com',
      },
      {
        id: newPatientIds[8],
        firstName: 'Doreen',
        lastName: 'Nabukenya',
        dateOfBirth: new Date('1991-08-19'),
        gender: 'Female',
        phone: '+256748901234',
        email: 'doreen.nabukenya@example.com',
      },
      {
        id: newPatientIds[9],
        firstName: 'Brian',
        lastName: 'Tumusiime',
        dateOfBirth: new Date('1986-02-27'),
        gender: 'Male',
        phone: '+256749012345',
        email: 'brian.tumusiime@example.com',
      },
      {
        id: newPatientIds[10],
        firstName: 'Winnie',
        lastName: 'Namagembe',
        dateOfBirth: new Date('1994-06-08'),
        gender: 'Female',
        phone: '+256750123456',
        email: 'winnie.namagembe@example.com',
      },
      {
        id: newPatientIds[11],
        firstName: 'Martin',
        lastName: 'Odeke',
        dateOfBirth: new Date('1984-11-22'),
        gender: 'Male',
        phone: '+256751234567',
        email: 'martin.odeke@example.com',
      },
      {
        id: newPatientIds[12],
        firstName: 'Joy',
        lastName: 'Nabatanzi',
        dateOfBirth: new Date('1997-03-17'),
        gender: 'Female',
        phone: '+256752345678',
        email: 'joy.nabatanzi@example.com',
      },
      {
        id: newPatientIds[13],
        firstName: 'Godfrey',
        lastName: 'Mwesigye',
        dateOfBirth: new Date('1989-09-09'),
        gender: 'Male',
        phone: '+256753456789',
        email: 'godfrey.mwesigye@example.com',
      },
      {
        id: newPatientIds[14],
        firstName: 'Harriet',
        lastName: 'Namuyanja',
        dateOfBirth: new Date('1992-01-25'),
        gender: 'Female',
        phone: '+256754567890',
        email: 'harriet.namuyanja@example.com',
      },
      {
        id: newPatientIds[15],
        firstName: 'Alfred',
        lastName: 'Okumu',
        dateOfBirth: new Date('1981-07-07'),
        gender: 'Male',
        phone: '+256755678901',
        email: 'alfred.okumu@example.com',
      },
      {
        id: newPatientIds[16],
        firstName: 'Sylvia',
        lastName: 'Nansamba',
        dateOfBirth: new Date('1996-04-14'),
        gender: 'Female',
        phone: '+256756789012',
        email: 'sylvia.nansamba@example.com',
      },
      {
        id: newPatientIds[17],
        firstName: 'Charles',
        lastName: 'Kizito',
        dateOfBirth: new Date('1987-12-30'),
        gender: 'Male',
        phone: '+256757890123',
        email: 'charles.kizito@example.com',
      },
      {
        id: newPatientIds[18],
        firstName: 'Jane',
        lastName: 'Nankunda',
        dateOfBirth: new Date('1993-10-11'),
        gender: 'Female',
        phone: '+256758901234',
        email: 'jane.nankunda@example.com',
      },
      {
        id: newPatientIds[19],
        firstName: 'Edward',
        lastName: 'Ssekitoleko',
        dateOfBirth: new Date('1985-05-04'),
        gender: 'Male',
        phone: '+256759012345',
        email: 'edward.ssekitoleko@example.com',
      },
    ];

    // Filter out patients with existing emails
    const validPatients = newPatients.filter(patient => {
      if (existingEmails.has(patient.email)) {
        logger.skip(`Patient with email ${patient.email} already exists`);
        return false;
      }
      if (existingPatientIds.has(patient.id)) {
        logger.skip(`Patient with ID ${patient.id} already exists`);
        return false;
      }
      return true;
    });

    logger.log(`Seeding ${validPatients.length} new patients...`);
    const createdPatientIds = [];

    for (const patient of validPatients) {
      try {
        await prisma.patient.create({
          data: patient,
        });
        createdPatientIds.push(patient.id);
        logger.success(`Created patient: ${patient.firstName} ${patient.lastName} (${patient.id})`);
      } catch (error) {
        logger.error(`Failed to create patient ${patient.firstName} ${patient.lastName}: ${error.message}`);
      }
    }

    // Only proceed with related data for successfully created patients
    if (createdPatientIds.length === 0) {
      logger.log('No new patients were created. Skipping related data seeding.');
      return;
    }

    // Seed Patient Addresses with Ugandan locations
    const addresses = [
      {
        id: uuidv4(),
        patientId: createdPatientIds[0],
        street: 'Bombo Road, Kawempe',
        city: 'Kampala',
        country: 'Uganda',
        postalCode: '00256',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[1],
        street: 'Mbale Road, Mbale',
        city: 'Mbale',
        country: 'Uganda',
        postalCode: '00256',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[2],
        street: 'Mbarara Road, Mbarara',
        city: 'Mbarara',
        country: 'Uganda',
        postalCode: '00256',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[3],
        street: 'Jinja Road, Jinja',
        city: 'Jinja',
        country: 'Uganda',
        postalCode: '00256',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[4],
        street: 'Masaka Road, Masaka',
        city: 'Masaka',
        country: 'Uganda',
        postalCode: '00256',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[5],
        street: 'Soroti Road, Soroti',
        city: 'Soroti',
        country: 'Uganda',
        postalCode: '00256',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[6],
        street: 'Luwero Road, Luwero',
        city: 'Luwero',
        country: 'Uganda',
        postalCode: '00256',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[7],
        street: 'Kabale Road, Kabale',
        city: 'Kabale',
        country: 'Uganda',
        postalCode: '00256',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[8],
        street: 'Mukono Road, Mukono',
        city: 'Mukono',
        country: 'Uganda',
        postalCode: '00256',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[9],
        street: 'Entebbe Road, Entebbe',
        city: 'Entebbe',
        country: 'Uganda',
        postalCode: '00256',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[10],
        street: 'Gaba Road, Bunga',
        city: 'Kampala',
        country: 'Uganda',
        postalCode: '00256',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[11],
        street: 'Lira Road, Lira',
        city: 'Lira',
        country: 'Uganda',
        postalCode: '00256',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[12],
        street: 'Kumi Road, Kumi',
        city: 'Kumi',
        country: 'Uganda',
        postalCode: '00256',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[13],
        street: 'Rukungiri Road, Rukungiri',
        city: 'Rukungiri',
        country: 'Uganda',
        postalCode: '00256',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[14],
        street: 'Moroto Road, Moroto',
        city: 'Moroto',
        country: 'Uganda',
        postalCode: '00256',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[15],
        street: 'Nebbi Road, Nebbi',
        city: 'Nebbi',
        country: 'Uganda',
        postalCode: '00256',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[16],
        street: 'Masindi Road, Masindi',
        city: 'Masindi',
        country: 'Uganda',
        postalCode: '00256',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[17],
        street: 'Adjumani Road, Adjumani',
        city: 'Adjumani',
        country: 'Uganda',
        postalCode: '00256',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[18],
        street: 'Kitgum Road, Kitgum',
        city: 'Kitgum',
        country: 'Uganda',
        postalCode: '00256',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[19],
        street: 'Pallisa Road, Pallisa',
        city: 'Pallisa',
        country: 'Uganda',
        postalCode: '00256',
      },
    ].filter(addr => createdPatientIds.includes(addr.patientId));

    logger.log(`Seeding ${addresses.length} patient addresses...`);
    for (const address of addresses) {
      try {
        await prisma.patientAddress.create({
          data: address,
        });
        logger.success(`Created address for patient in: ${address.city}`);
      } catch (error) {
        logger.error(`Failed to create address for patient ${address.patientId}: ${error.message}`);
      }
    }

    // Seed Next of Kin with Ugandan names
    const nextOfKins = [
      {
        id: uuidv4(),
        patientId: createdPatientIds[0],
        firstName: 'Michael',
        lastName: 'Tumwebaze',
        relationship: 'Husband',
        phone: '+256760123456',
        email: 'michael.tumwebaze@example.com',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[1],
        firstName: 'Rose',
        lastName: 'Adongo',
        relationship: 'Wife',
        phone: '+256761234567',
        email: 'rose.adongo@example.com',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[2],
        firstName: 'William',
        lastName: 'Nsubuga',
        relationship: 'Father',
        phone: '+256762345678',
        email: 'william.nsubuga@example.com',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[3],
        firstName: 'Betty',
        lastName: 'Nalukwago',
        relationship: 'Sister',
        phone: '+256763456789',
        email: 'betty.nalukwago@example.com',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[4],
        firstName: 'Stephen',
        lastName: 'Mugabe',
        relationship: 'Brother',
        phone: '+256764567890',
        email: 'stephen.mugabe@example.com',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[5],
        firstName: 'Margaret',
        lastName: 'Aciro',
        relationship: 'Mother',
        phone: '+256765678901',
        email: 'margaret.aciro@example.com',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[6],
        firstName: 'George',
        lastName: 'Kiwanuka',
        relationship: 'Husband',
        phone: '+256766789012',
        email: 'george.kiwanuka@example.com',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[7],
        firstName: 'Agnes',
        lastName: 'Namusoke',
        relationship: 'Wife',
        phone: '+256767890123',
        email: 'agnes.namusoke@example.com',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[8],
        firstName: 'Paul',
        lastName: 'Ssemwanga',
        relationship: 'Father',
        phone: '+256768901234',
        email: 'paul.ssemwanga@example.com',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[9],
        firstName: 'Monica',
        lastName: 'Nabiryo',
        relationship: 'Mother',
        phone: '+256769012345',
        email: 'monica.nabiryo@example.com',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[10],
        firstName: 'Andrew',
        lastName: 'Mukwaya',
        relationship: 'Husband',
        phone: '+256770123456',
        email: 'andrew.mukwaya@example.com',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[11],
        firstName: 'Susan',
        lastName: 'Akello',
        relationship: 'Wife',
        phone: '+256771234567',
        email: 'susan.akello@example.com',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[12],
        firstName: 'Joseph',
        lastName: 'Sserwadda',
        relationship: 'Father',
        phone: '+256772345678',
        email: 'joseph.sserwadda@example.com',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[13],
        firstName: 'Esther',
        lastName: 'Nalubega',
        relationship: 'Sister',
        phone: '+256773456789',
        email: 'esther.nalubega@example.com',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[14],
        firstName: 'Francis',
        lastName: 'Tumuhairwe',
        relationship: 'Brother',
        phone: '+256774567890',
        email: 'francis.tumuhairwe@example.com',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[15],
        firstName: 'Grace',
        lastName: 'Auma',
        relationship: 'Mother',
        phone: '+256775678901',
        email: 'grace.auma@example.com',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[16],
        firstName: 'Richard',
        lastName: 'Lubega',
        relationship: 'Husband',
        phone: '+256776789012',
        email: 'richard.lubega@example.com',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[17],
        firstName: 'Lillian',
        lastName: 'Namutebi',
        relationship: 'Wife',
        phone: '+256777890123',
        email: 'lillian.namutebi@example.com',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[18],
        firstName: 'David',
        lastName: 'Kato',
        relationship: 'Father',
        phone: '+256778901234',
        email: 'david.kato@example.com',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[19],
        firstName: 'Sarah',
        lastName: 'Nanziri',
        relationship: 'Mother',
        phone: '+256779012345',
        email: 'sarah.nanziri@example.com',
      },
    ].filter(nok => createdPatientIds.includes(nok.patientId));

    logger.log(`Seeding ${nextOfKins.length} next of kin records...`);
    for (const nok of nextOfKins) {
      try {
        await prisma.nextOfKin.create({
          data: nok,
        });
        logger.success(`Created next of kin: ${nok.firstName} ${nok.lastName} for patient ${nok.patientId}`);
      } catch (error) {
        logger.error(`Failed to create next of kin for patient ${nok.patientId}: ${error.message}`);
      }
    }

    // Seed Insurance Info with Ugandan insurance providers
    const insuranceInfos = [
      {
        id: uuidv4(),
        patientId: createdPatientIds[0],
        provider: 'UAP Old Mutual',
        policyNumber: `UAP${Date.now()}011`,
        expiryDate: new Date('2027-12-31'),
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[1],
        provider: 'Jubilee Insurance',
        policyNumber: `JUB${Date.now()}012`,
        expiryDate: new Date('2028-05-15'),
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[2],
        provider: 'AIG Uganda',
        policyNumber: `AIG${Date.now()}013`,
        expiryDate: new Date('2027-09-20'),
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[3],
        provider: 'Stanbic General Insurance',
        policyNumber: `STA${Date.now()}014`,
        expiryDate: new Date('2028-03-10'),
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[4],
        provider: 'National Insurance Corporation',
        policyNumber: `NIC${Date.now()}015`,
        expiryDate: new Date('2027-11-25'),
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[5],
        provider: 'Goldstar Insurance',
        policyNumber: `GSI${Date.now()}016`,
        expiryDate: new Date('2028-04-05'),
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[6],
        provider: 'ICEA LION',
        policyNumber: `ICE${Date.now()}017`,
        expiryDate: new Date('2027-10-15'),
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[7],
        provider: 'Orient Insurance',
        policyNumber: `ORI${Date.now()}018`,
        expiryDate: new Date('2028-06-30'),
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[8],
        provider: 'Prudential Uganda',
        policyNumber: `PRU${Date.now()}019`,
        expiryDate: new Date('2027-09-12'),
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[9],
        provider: 'Chartis Uganda',
        policyNumber: `CHA${Date.now()}020`,
        expiryDate: new Date('2028-07-28'),
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[10],
        provider: 'UAP Old Mutual',
        policyNumber: `UAP${Date.now()}021`,
        expiryDate: new Date('2027-08-31'),
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[11],
        provider: 'Jubilee Insurance',
        policyNumber: `JUB${Date.now()}022`,
        expiryDate: new Date('2028-02-15'),
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[12],
        provider: 'AIG Uganda',
        policyNumber: `AIG${Date.now()}023`,
        expiryDate: new Date('2027-06-20'),
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[13],
        provider: 'Stanbic General Insurance',
        policyNumber: `STA${Date.now()}024`,
        expiryDate: new Date('2028-01-10'),
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[14],
        provider: 'National Insurance Corporation',
        policyNumber: `NIC${Date.now()}025`,
        expiryDate: new Date('2027-10-25'),
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[15],
        provider: 'Goldstar Insurance',
        policyNumber: `GSI${Date.now()}026`,
        expiryDate: new Date('2028-03-05'),
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[16],
        provider: 'ICEA LION',
        policyNumber: `ICE${Date.now()}027`,
        expiryDate: new Date('2027-12-15'),
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[17],
        provider: 'Orient Insurance',
        policyNumber: `ORI${Date.now()}028`,
        expiryDate: new Date('2028-05-30'),
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[18],
        provider: 'Prudential Uganda',
        policyNumber: `PRU${Date.now()}029`,
        expiryDate: new Date('2027-07-12'),
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[19],
        provider: 'Chartis Uganda',
        policyNumber: `CHA${Date.now()}030`,
        expiryDate: new Date('2028-08-28'),
      },
    ].filter(ins => createdPatientIds.includes(ins.patientId));

    // Filter out insurance with existing policy numbers
    const validInsurance = insuranceInfos.filter(ins => {
      if (existingPolicyNumbers.has(ins.policyNumber)) {
        logger.skip(`Insurance policy ${ins.policyNumber} already exists`);
        return false;
      }
      return true;
    });

    logger.log(`Seeding ${validInsurance.length} insurance records...`);
    for (const insurance of validInsurance) {
      try {
        await prisma.insuranceInfo.create({
          data: insurance,
        });
        logger.success(`Created insurance for patient ${insurance.patientId} with provider: ${insurance.provider}`);
      } catch (error) {
        logger.error(`Failed to create insurance for patient ${insurance.patientId}: ${error.message}`);
      }
    }

    // Seed Medical Records and related clinical data
    const medicalRecords = createdPatientIds.map((patientId, index) => ({
      id: uuidv4(),
      patientId,
      recordDate: new Date(`2025-07-${15 + index}`),
    }));

    logger.log(`Seeding ${medicalRecords.length} medical records...`);
    const createdMedicalRecords = [];
    for (const record of medicalRecords) {
      try {
        await prisma.medicalRecord.create({
          data: record,
        });
        createdMedicalRecords.push(record);
        logger.success(`Created medical record for patient: ${record.patientId}`);
      } catch (error) {
        logger.error(`Failed to create medical record for patient ${record.patientId}: ${error.message}`);
      }
    }

    // Seed Allergies
    const allergies = createdMedicalRecords.flatMap((record, index) => [
      {
        id: uuidv4(),
        medicalRecordId: record.id,
        name: index % 3 === 0 ? 'Dust Mites' : index % 3 === 1 ? 'Shellfish' : 'Pollen',
        severity: index % 3 === 0 ? 'Mild' : index % 3 === 1 ? 'Moderate' : 'Severe',
      },
    ]);

    logger.log(`Seeding ${allergies.length} allergies...`);
    for (const allergy of allergies) {
      try {
        await prisma.allergy.create({
          data: allergy,
        });
        logger.success(`Created allergy: ${allergy.name} for medical record ${allergy.medicalRecordId}`);
      } catch (error) {
        logger.error(`Failed to create allergy for medical record ${allergy.medicalRecordId}: ${error.message}`);
      }
    }

    // Seed Diagnoses
    const diagnoses = createdMedicalRecords.map((record, index) => ({
      id: uuidv4(),
      medicalRecordId: record.id,
      code: `ICD10-${Date.now()}-${index + 10}`,
      description: index % 3 === 0 ? 'Asthma' : index % 3 === 1 ? 'Malaria' : 'Hypertension',
      diagnosedAt: new Date(`2025-07-${15 + index}`),
    }));

    logger.log(`Seeding ${diagnoses.length} diagnoses...`);
    for (const diagnosis of diagnoses) {
      try {
        await prisma.diagnosis.create({
          data: diagnosis,
        });
        logger.success(`Created diagnosis: ${diagnosis.description} for medical record ${diagnosis.medicalRecordId}`);
      } catch (error) {
        logger.error(`Failed to create diagnosis for medical record ${diagnosis.medicalRecordId}: ${error.message}`);
      }
    }

    // Seed Vital Signs
    const vitalSigns = createdMedicalRecords.map((record, index) => ({
      id: uuidv4(),
      medicalRecordId: record.id,
      bloodPressure: index % 3 === 0 ? '130/85' : index % 3 === 1 ? '135/90' : '125/80',
      heartRate: 65 + (index % 6) * 5,
      temperature: 36.6 + (index % 4) * 0.4,
      respiratoryRate: 15 + (index % 5),
      oxygenSaturation: 94 + (index % 6),
      recordedAt: new Date(`2025-07-${15 + index}`),
    }));

    logger.log(`Seeding ${vitalSigns.length} vital signs...`);
    for (const vitalSign of vitalSigns) {
      try {
        await prisma.vitalSign.create({
          data: vitalSign,
        });
        logger.success(`Created vital sign for medical record: ${vitalSign.medicalRecordId}`);
      } catch (error) {
        logger.error(`Failed to create vital sign for medical record ${vitalSign.medicalRecordId}: ${error.message}`);
      }
    }

    // Seed Chief Complaint (1:1 relationship)
    const chiefComplaints = createdMedicalRecords.map((record, index) => ({
      id: uuidv4(),
      medicalRecordId: record.id,
      description: index % 3 === 0 ? 'Chronic cough' : index % 3 === 1 ? 'Fever' : 'Joint pain',
      duration: '3 weeks',
      onset: 'Sudden',
    }));

    logger.log(`Seeding ${chiefComplaints.length} chief complaints...`);
    for (const complaint of chiefComplaints) {
      try {
        await prisma.chiefComplaint.create({
          data: complaint,
        });
        logger.success(`Created chief complaint for medical record: ${complaint.medicalRecordId}`);
      } catch (error) {
        logger.error(`Failed to create chief complaint for medical record ${complaint.medicalRecordId}: ${error.message}`);
      }
    }

    // Seed Present Illness (1:1 relationship)
    const presentIllnesses = createdMedicalRecords.map((record, index) => ({
      id: uuidv4(),
      medicalRecordId: record.id,
      narrative: index % 3 === 0 ? 'Patient reports chronic cough with sputum production.' : index % 3 === 1 ? 'Patient has recurring fever with chills.' : 'Patient experiences joint pain in knees.',
      severity: 'Moderate',
      progress: 'Improving',
      associatedSymptoms: index % 3 === 0 ? 'Wheezing' : index % 3 === 1 ? 'Fatigue' : 'Swelling',
    }));

    logger.log(`Seeding ${presentIllnesses.length} present illnesses...`);
    for (const illness of presentIllnesses) {
      try {
        await prisma.presentIllness.create({
          data: illness,
        });
        logger.success(`Created present illness for medical record: ${illness.medicalRecordId}`);
      } catch (error) {
        logger.error(`Failed to create present illness for medical record ${illness.medicalRecordId}: ${error.message}`);
      }
    }

    // Seed Past Medical Conditions
    const pastMedicalConditions = createdMedicalRecords.flatMap((record, index) => [
      {
        id: uuidv4(),
        medicalRecordId: record.id,
        condition: index % 3 === 0 ? 'Tuberculosis' : index % 3 === 1 ? 'Typhoid' : 'Arthritis',
        diagnosisDate: new Date(`2021-06-${15 + index}`),
        notes: 'Treated and resolved',
      },
    ]);

    logger.log(`Seeding ${pastMedicalConditions.length} past medical conditions...`);
    for (const condition of pastMedicalConditions) {
      try {
        await prisma.pastMedicalCondition.create({
          data: condition,
        });
        logger.success(`Created past medical condition: ${condition.condition} for medical record ${condition.medicalRecordId}`);
      } catch (error) {
        logger.error(`Failed to create past medical condition for medical record ${condition.medicalRecordId}: ${error.message}`);
      }
    }

    // Seed Medication History
    const medicationHistories = createdMedicalRecords.flatMap((record, index) => [
      {
        id: uuidv4(),
        medicalRecordId: record.id,
        medicationName: index % 3 === 0 ? 'Salbutamol' : index % 3 === 1 ? 'Ciprofloxacin' : 'Ibuprofen',
        dosage: '10mg',
        frequency: 'Twice daily',
        startDate: new Date(`2023-02-${15 + index}`),
        isCurrent: true,
      },
    ]);

    logger.log(`Seeding ${medicationHistories.length} medication histories...`);
    for (const medication of medicationHistories) {
      try {
        await prisma.medicationHistory.create({
          data: medication,
        });
        logger.success(`Created medication history: ${medication.medicationName} for medical record ${medication.medicalRecordId}`);
      } catch (error) {
        logger.error(`Failed to create medication history for medical record ${medication.medicalRecordId}: ${error.message}`);
      }
    }

    // Seed Social History (1:1 relationship)
    const socialHistories = createdMedicalRecords.map((record, index) => ({
      id: uuidv4(),
      medicalRecordId: record.id,
      smokingStatus: index % 3 === 0 ? 'Non-smoker' : index % 3 === 1 ? 'Current smoker' : 'Former smoker',
      alcoholUse: 'None',
      occupation: index % 3 === 0 ? 'Nurse' : index % 3 === 1 ? 'Driver' : 'Trader',
      maritalStatus: 'Single',
      livingSituation: 'Lives alone',
    }));

    logger.log(`Seeding ${socialHistories.length} social histories...`);
    for (const history of socialHistories) {
      try {
        await prisma.socialHistory.create({
          data: history,
        });
        logger.success(`Created social history for medical record: ${history.medicalRecordId}`);
      } catch (error) {
        logger.error(`Failed to create social history for medical record ${history.medicalRecordId}: ${error.message}`);
      }
    }

    logger.log('Database seeding completed successfully!');
    logger.log(`Total patients attempted: ${newPatients.length}`);
    logger.log(`Total patients created: ${createdPatientIds.length}`);
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