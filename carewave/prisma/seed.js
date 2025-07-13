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
    const newPatientIds = Array.from({ length: 10 }, (_, i) => `P-${(startIndex + i).toString().padStart(5, '0')}`);

    // Seed 10 new Patients with Ugandan names
    const newPatients = [
      {
        id: newPatientIds[0],
        firstName: 'Grace',
        lastName: 'Nabirye',
        dateOfBirth: new Date('1992-02-10'),
        gender: 'Female',
        phone: '+256720123456',
        email: 'grace.nabirye@example.com',
      },
      {
        id: newPatientIds[1],
        firstName: 'Joseph',
        lastName: 'Okello',
        dateOfBirth: new Date('1983-06-17'),
        gender: 'Male',
        phone: '+256721234567',
        email: 'joseph.okello@example.com',
      },
      {
        id: newPatientIds[2],
        firstName: 'Mercy',
        lastName: 'Namutebi',
        dateOfBirth: new Date('1996-09-25'),
        gender: 'Female',
        phone: '+256722345678',
        email: 'mercy.namutebi@example.com',
      },
      {
        id: newPatientIds[3],
        firstName: 'Samuel',
        lastName: 'Mukasa',
        dateOfBirth: new Date('1989-12-01'),
        gender: 'Male',
        phone: '+256723456789',
        email: 'samuel.mukasa@example.com',
      },
      {
        id: newPatientIds[4],
        firstName: 'Lillian',
        lastName: 'Atuhaire',
        dateOfBirth: new Date('1994-04-05'),
        gender: 'Female',
        phone: '+256724567890',
        email: 'lillian.atuhaire@example.com',
      },
      {
        id: newPatientIds[5],
        firstName: 'Patrick',
        lastName: 'Ojok',
        dateOfBirth: new Date('1980-08-13'),
        gender: 'Male',
        phone: '+256725678901',
        email: 'patrick.ojok@example.com',
      },
      {
        id: newPatientIds[6],
        firstName: 'Agnes',
        lastName: 'Nankya',
        dateOfBirth: new Date('1997-03-20'),
        gender: 'Female',
        phone: '+256726789012',
        email: 'agnes.nankya@example.com',
      },
      {
        id: newPatientIds[7],
        firstName: 'David',
        lastName: 'Ssentongo',
        dateOfBirth: new Date('1986-11-11'),
        gender: 'Male',
        phone: '+256727890123',
        email: 'david.ssentongo@example.com',
      },
      {
        id: newPatientIds[8],
        firstName: 'Esther',
        lastName: 'Nakitende',
        dateOfBirth: new Date('1990-07-30'),
        gender: 'Female',
        phone: '+256728901234',
        email: 'esther.nakitende@example.com',
      },
      {
        id: newPatientIds[9],
        firstName: 'Simon',
        lastName: 'Kiwanuka',
        dateOfBirth: new Date('1984-05-15'),
        gender: 'Male',
        phone: '+256729012345',
        email: 'simon.kiwanuka@example.com',
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
        street: 'Lugogo Bypass, Nakawa',
        city: 'Kampala',
        country: 'Uganda',
        postalCode: '00256',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[1],
        street: 'Arua Road, Arua',
        city: 'Arua',
        country: 'Uganda',
        postalCode: '00256',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[2],
        street: 'Hoima Road, Hoima',
        city: 'Hoima',
        country: 'Uganda',
        postalCode: '00256',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[3],
        street: 'Kira Road, Kamwokya',
        city: 'Kampala',
        country: 'Uganda',
        postalCode: '00256',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[4],
        street: 'Tororo Road, Tororo',
        city: 'Tororo',
        country: 'Uganda',
        postalCode: '00256',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[5],
        street: 'Lira Road, Gulu',
        city: 'Gulu',
        country: 'Uganda',
        postalCode: '00256',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[6],
        street: 'Mityana Road, Mityana',
        city: 'Mityana',
        country: 'Uganda',
        postalCode: '00256',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[7],
        street: 'Bushenyi Road, Bushenyi',
        city: 'Bushenyi',
        country: 'Uganda',
        postalCode: '00256',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[8],
        street: 'Iganga Road, Iganga',
        city: 'Iganga',
        country: 'Uganda',
        postalCode: '00256',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[9],
        street: 'Kasese Road, Fort Portal',
        city: 'Fort Portal',
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
        firstName: 'Robert',
        lastName: 'Musinguzi',
        relationship: 'Husband',
        phone: '+256730123456',
        email: 'robert.musinguzi@example.com',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[1],
        firstName: 'Joyce',
        lastName: 'Acen',
        relationship: 'Wife',
        phone: '+256731234567',
        email: 'joyce.acen@example.com',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[2],
        firstName: 'Peter',
        lastName: 'Waiswa',
        relationship: 'Father',
        phone: '+256732345678',
        email: 'peter.waiswa@example.com',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[3],
        firstName: 'Christine',
        lastName: 'Nassali',
        relationship: 'Sister',
        phone: '+256733456789',
        email: 'christine.nassali@example.com',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[4],
        firstName: 'Moses',
        lastName: 'Tumwesigye',
        relationship: 'Brother',
        phone: '+256734567890',
        email: 'moses.tumwesigye@example.com',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[5],
        firstName: 'Mary',
        lastName: 'Auma',
        relationship: 'Mother',
        phone: '+256735678901',
        email: 'mary.auma@example.com',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[6],
        firstName: 'James',
        lastName: 'Lubega',
        relationship: 'Husband',
        phone: '+256736789012',
        email: 'james.lubega@example.com',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[7],
        firstName: 'Sarah',
        lastName: 'Nalubega',
        relationship: 'Wife',
        phone: '+256737890123',
        email: 'sarah.nalubega@example.com',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[8],
        firstName: 'Thomas',
        lastName: 'Kato',
        relationship: 'Father',
        phone: '+256738901234',
        email: 'thomas.kato@example.com',
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[9],
        firstName: 'Beatrice',
        lastName: 'Namuganza',
        relationship: 'Mother',
        phone: '+256739012345',
        email: 'beatrice.namuganza@example.com',
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
        policyNumber: `UAP${Date.now()}001`,
        expiryDate: new Date('2027-10-31'),
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[1],
        provider: 'Jubilee Insurance',
        policyNumber: `JUB${Date.now()}002`,
        expiryDate: new Date('2028-03-15'),
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[2],
        provider: 'AIG Uganda',
        policyNumber: `AIG${Date.now()}003`,
        expiryDate: new Date('2027-07-20'),
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[3],
        provider: 'Stanbic General Insurance',
        policyNumber: `STA${Date.now()}004`,
        expiryDate: new Date('2028-01-10'),
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[4],
        provider: 'National Insurance Corporation',
        policyNumber: `NIC${Date.now()}005`,
        expiryDate: new Date('2027-09-25'),
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[5],
        provider: 'Goldstar Insurance',
        policyNumber: `GSI${Date.now()}006`,
        expiryDate: new Date('2028-02-05'),
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[6],
        provider: 'ICEA LION',
        policyNumber: `ICE${Date.now()}007`,
        expiryDate: new Date('2027-11-15'),
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[7],
        provider: 'Orient Insurance',
        policyNumber: `ORI${Date.now()}008`,
        expiryDate: new Date('2028-04-30'),
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[8],
        provider: 'Prudential Uganda',
        policyNumber: `PRU${Date.now()}009`,
        expiryDate: new Date('2027-08-12'),
      },
      {
        id: uuidv4(),
        patientId: createdPatientIds[9],
        provider: 'Chartis Uganda',
        policyNumber: `CHA${Date.now()}010`,
        expiryDate: new Date('2028-06-28'),
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
      recordDate: new Date(`2025-07-${10 + index}`),
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
        name: index % 2 === 0 ? 'Penicillin' : 'Peanuts',
        severity: index % 2 === 0 ? 'Moderate' : 'Severe',
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
      code: `ICD10-${Date.now()}-${index}`,
      description: index % 2 === 0 ? 'Hypertension' : 'Type 2 Diabetes',
      diagnosedAt: new Date(`2025-07-${10 + index}`),
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
      bloodPressure: index % 2 === 0 ? '120/80' : '140/90',
      heartRate: 70 + (index % 5) * 5,
      temperature: 36.5 + (index % 3) * 0.5,
      respiratoryRate: 16 + (index % 4),
      oxygenSaturation: 95 + (index % 5),
      recordedAt: new Date(`2025-07-${10 + index}`),
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
      description: index % 2 === 0 ? 'Persistent headache' : 'Chest pain',
      duration: '2 weeks',
      onset: 'Gradual',
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
      narrative: index % 2 === 0 ? 'Patient reports persistent headaches with occasional dizziness.' : 'Patient experiences chest pain radiating to the left arm.',
      severity: 'Moderate',
      progress: 'Stable',
      associatedSymptoms: index % 2 === 0 ? 'Nausea' : 'Shortness of breath',
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
        condition: index % 2 === 0 ? 'Asthma' : 'Malaria',
        diagnosisDate: new Date(`2020-05-${10 + index}`),
        notes: 'Managed with medication',
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
        medicationName: index % 2 === 0 ? 'Amlodipine' : 'Metformin',
        dosage: '5mg',
        frequency: 'Once daily',
        startDate: new Date(`2023-01-${10 + index}`),
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
      smokingStatus: index % 2 === 0 ? 'Non-smoker' : 'Former smoker',
      alcoholUse: 'Occasional',
      occupation: index % 2 === 0 ? 'Teacher' : 'Farmer',
      maritalStatus: 'Married',
      livingSituation: 'Lives with family',
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