const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding for additional patients...');

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

  console.log('Seeding new patients...');
  for (const patient of newPatients) {
    await prisma.patient.upsert({
      where: { email: patient.email },
      update: {},
      create: patient,
    });
    console.log(`Created/Updated patient: ${patient.firstName} ${patient.lastName}`);
  }

  // Seed Patient Addresses with Ugandan locations
  const addresses = [
    {
      id: uuidv4(),
      patientId: newPatientIds[0],
      street: 'Lugogo Bypass, Nakawa',
      city: 'Kampala',
      country: 'Uganda',
      postalCode: '00256',
    },
    {
      id: uuidv4(),
      patientId: newPatientIds[1],
      street: 'Arua Road, Arua',
      city: 'Arua',
      country: 'Uganda',
      postalCode: '00256',
    },
    {
      id: uuidv4(),
      patientId: newPatientIds[2],
      street: 'Hoima Road, Hoima',
      city: 'Hoima',
      country: 'Uganda',
      postalCode: '00256',
    },
    {
      id: uuidv4(),
      patientId: newPatientIds[3],
      street: 'Kira Road, Kamwokya',
      city: 'Kampala',
      country: 'Uganda',
      postalCode: '00256',
    },
    {
      id: uuidv4(),
      patientId: newPatientIds[4],
      street: 'Tororo Road, Tororo',
      city: 'Tororo',
      country: 'Uganda',
      postalCode: '00256',
    },
    {
      id: uuidv4(),
      patientId: newPatientIds[5],
      street: 'Lira Road, Gulu',
      city: 'Gulu',
      country: 'Uganda',
      postalCode: '00256',
    },
    {
      id: uuidv4(),
      patientId: newPatientIds[6],
      street: 'Mityana Road, Mityana',
      city: 'Mityana',
      country: 'Uganda',
      postalCode: '00256',
    },
    {
      id: uuidv4(),
      patientId: newPatientIds[7],
      street: 'Bushenyi Road, Bushenyi',
      city: 'Bushenyi',
      country: 'Uganda',
      postalCode: '00256',
    },
    {
      id: uuidv4(),
      patientId: newPatientIds[8],
      street: 'Iganga Road, Iganga',
      city: 'Iganga',
      country: 'Uganda',
      postalCode: '00256',
    },
    {
      id: uuidv4(),
      patientId: newPatientIds[9],
      street: 'Kasese Road, Fort Portal',
      city: 'Fort Portal',
      country: 'Uganda',
      postalCode: '00256',
    },
  ];

  console.log('Seeding patient addresses...');
  for (const address of addresses) {
    try {
      // Check if address already exists for this patient
      const existingAddress = await prisma.patientAddress.findFirst({
        where: { patientId: address.patientId }
      });
      
      if (!existingAddress) {
        await prisma.patientAddress.create({
          data: address,
        });
        console.log(`Created address for patient in: ${address.city}`);
      } else {
        console.log(`Address already exists for patient: ${address.patientId}`);
      }
    } catch (error) {
      console.error(`Error creating address for patient ${address.patientId}:`, error.message);
    }
  }

  // Seed Next of Kin with Ugandan names
  const nextOfKins = [
    {
      id: uuidv4(),
      patientId: newPatientIds[0],
      firstName: 'Robert',
      lastName: 'Musinguzi',
      relationship: 'Husband',
      phone: '+256730123456',
      email: 'robert.musinguzi@example.com',
    },
    {
      id: uuidv4(),
      patientId: newPatientIds[1],
      firstName: 'Joyce',
      lastName: 'Acen',
      relationship: 'Wife',
      phone: '+256731234567',
      email: 'joyce.acen@example.com',
    },
    {
      id: uuidv4(),
      patientId: newPatientIds[2],
      firstName: 'Peter',
      lastName: 'Waiswa',
      relationship: 'Father',
      phone: '+256732345678',
      email: 'peter.waiswa@example.com',
    },
    {
      id: uuidv4(),
      patientId: newPatientIds[3],
      firstName: 'Christine',
      lastName: 'Nassali',
      relationship: 'Sister',
      phone: '+256733456789',
      email: 'christine.nassali@example.com',
    },
    {
      id: uuidv4(),
      patientId: newPatientIds[4],
      firstName: 'Moses',
      lastName: 'Tumwesigye',
      relationship: 'Brother',
      phone: '+256734567890',
      email: 'moses.tumwesigye@example.com',
    },
    {
      id: uuidv4(),
      patientId: newPatientIds[5],
      firstName: 'Mary',
      lastName: 'Auma',
      relationship: 'Mother',
      phone: '+256735678901',
      email: 'mary.auma@example.com',
    },
    {
      id: uuidv4(),
      patientId: newPatientIds[6],
      firstName: 'James',
      lastName: 'Lubega',
      relationship: 'Husband',
      phone: '+256736789012',
      email: 'james.lubega@example.com',
    },
    {
      id: uuidv4(),
      patientId: newPatientIds[7],
      firstName: 'Sarah',
      lastName: 'Nalubega',
      relationship: 'Wife',
      phone: '+256737890123',
      email: 'sarah.nalubega@example.com',
    },
    {
      id: uuidv4(),
      patientId: newPatientIds[8],
      firstName: 'Thomas',
      lastName: 'Kato',
      relationship: 'Father',
      phone: '+256738901234',
      email: 'thomas.kato@example.com',
    },
    {
      id: uuidv4(),
      patientId: newPatientIds[9],
      firstName: 'Beatrice',
      lastName: 'Namuganza',
      relationship: 'Mother',
      phone: '+256739012345',
      email: 'beatrice.namuganza@example.com',
    },
  ];

  console.log('Seeding next of kin...');
  for (const nok of nextOfKins) {
    try {
      // Check if Next of Kin already exists for this patient (unique constraint)
      const existingNok = await prisma.nextOfKin.findUnique({
        where: { patientId: nok.patientId }
      });
      
      if (!existingNok) {
        await prisma.nextOfKin.create({
          data: nok,
        });
        console.log(`Created next of kin for patient: ${nok.firstName} ${nok.lastName}`);
      } else {
        console.log(`Next of kin already exists for patient: ${nok.patientId}`);
      }
    } catch (error) {
      console.error(`Error creating next of kin for patient ${nok.patientId}:`, error.message);
    }
  }

  // Seed Insurance Info with Ugandan insurance providers
  const insuranceInfos = [
    {
      id: uuidv4(),
      patientId: newPatientIds[0],
      provider: 'UAP Old Mutual',
      policyNumber: 'UAP654321',
      expiryDate: new Date('2027-10-31'),
    },
    {
      id: uuidv4(),
      patientId: newPatientIds[1],
      provider: 'Jubilee Insurance',
      policyNumber: 'JUB210987',
      expiryDate: new Date('2028-03-15'),
    },
    {
      id: uuidv4(),
      patientId: newPatientIds[2],
      provider: 'AIG Uganda',
      policyNumber: 'AIG987654',
      expiryDate: new Date('2027-07-20'),
    },
    {
      id: uuidv4(),
      patientId: newPatientIds[3],
      provider: 'Stanbic General Insurance',
      policyNumber: 'STA456123',
      expiryDate: new Date('2028-01-10'),
    },
    {
      id: uuidv4(),
      patientId: newPatientIds[4],
      provider: 'National Insurance Corporation',
      policyNumber: 'NIC789456',
      expiryDate: new Date('2027-09-25'),
    },
    {
      id: uuidv4(),
      patientId: newPatientIds[5],
      provider: 'Goldstar Insurance',
      policyNumber: 'GSI123789',
      expiryDate: new Date('2028-02-05'),
    },
    {
      id: uuidv4(),
      patientId: newPatientIds[6],
      provider: 'ICEA LION',
      policyNumber: 'ICE456321',
      expiryDate: new Date('2027-11-15'),
    },
    {
      id: uuidv4(),
      patientId: newPatientIds[7],
      provider: 'Orient Insurance',
      policyNumber: 'ORI789654',
      expiryDate: new Date('2028-04-30'),
    },
    {
      id: uuidv4(),
      patientId: newPatientIds[8],
      provider: 'Prudential Uganda',
      policyNumber: 'PRU321987',
      expiryDate: new Date('2027-08-12'),
    },
    {
      id: uuidv4(),
      patientId: newPatientIds[9],
      provider: 'Chartis Uganda',
      policyNumber: 'CHA654987',
      expiryDate: new Date('2028-06-28'),
    },
  ];

  console.log('Seeding insurance information...');
  for (const insurance of insuranceInfos) {
    try {
      // Check if insurance already exists for this patient (unique constraint)
      const existingInsurance = await prisma.insuranceInfo.findUnique({
        where: { patientId: insurance.patientId }
      });
      
      if (!existingInsurance) {
        // Also check for policy number uniqueness
        const existingPolicy = await prisma.insuranceInfo.findUnique({
          where: { policyNumber: insurance.policyNumber }
        });
        
        if (!existingPolicy) {
          await prisma.insuranceInfo.create({
            data: insurance,
          });
          console.log(`Created insurance info for patient with provider: ${insurance.provider}`);
        } else {
          console.log(`Policy number ${insurance.policyNumber} already exists`);
        }
      } else {
        console.log(`Insurance already exists for patient: ${insurance.patientId}`);
      }
    } catch (error) {
      console.error(`Error creating insurance info for patient ${insurance.patientId}:`, error.message);
    }
  }

  // Seed Medical Records and related clinical data
  const medicalRecords = newPatientIds.map((patientId, index) => ({
    id: uuidv4(),
    patientId,
    recordDate: new Date(`2025-07-${10 + index}`),
  }));

  console.log('Seeding medical records...');
  for (const record of medicalRecords) {
    try {
      // Check if medical record with this ID already exists
      const existingRecord = await prisma.medicalRecord.findUnique({
        where: { id: record.id }
      });
      
      if (!existingRecord) {
        await prisma.medicalRecord.create({
          data: record,
        });
        console.log(`Created medical record for patient: ${record.patientId}`);
      } else {
        console.log(`Medical record already exists: ${record.id}`);
      }
    } catch (error) {
      console.error(`Error creating medical record for patient ${record.patientId}:`, error.message);
    }
  }

  // Seed Allergies (example: 1-2 allergies per patient)
  const allergies = medicalRecords.flatMap((record, index) => [
    {
      id: uuidv4(),
      medicalRecordId: record.id,
      name: index % 2 === 0 ? 'Penicillin' : 'Peanuts',
      severity: index % 2 === 0 ? 'Moderate' : 'Severe',
    },
  ]);

  console.log('Seeding allergies...');
  for (const allergy of allergies) {
    try {
      const existingAllergy = await prisma.allergy.findUnique({
        where: { id: allergy.id }
      });
      
      if (!existingAllergy) {
        await prisma.allergy.create({
          data: allergy,
        });
        console.log(`Created allergy: ${allergy.name}`);
      } else {
        console.log(`Allergy already exists: ${allergy.id}`);
      }
    } catch (error) {
      console.error(`Error creating allergy for medical record ${allergy.medicalRecordId}:`, error.message);
    }
  }

  // Seed Diagnoses (example: 1 diagnosis per patient)
  const diagnoses = medicalRecords.map((record, index) => ({
    id: uuidv4(),
    medicalRecordId: record.id,
    code: `ICD10-${100 + index}`,
    description: index % 2 === 0 ? 'Hypertension' : 'Type 2 Diabetes',
    diagnosedAt: new Date(`2025-07-${10 + index}`),
  }));

  console.log('Seeding diagnoses...');
  for (const diagnosis of diagnoses) {
    try {
      const existingDiagnosis = await prisma.diagnosis.findUnique({
        where: { id: diagnosis.id }
      });
      
      if (!existingDiagnosis) {
        await prisma.diagnosis.create({
          data: diagnosis,
        });
        console.log(`Created diagnosis: ${diagnosis.description}`);
      } else {
        console.log(`Diagnosis already exists: ${diagnosis.id}`);
      }
    } catch (error) {
      console.error(`Error creating diagnosis for medical record ${diagnosis.medicalRecordId}:`, error.message);
    }
  }

  // Seed Vital Signs (example: 1 vital sign record per patient)
  const vitalSigns = medicalRecords.map((record, index) => ({
    id: uuidv4(),
    medicalRecordId: record.id,
    bloodPressure: index % 2 === 0 ? '120/80' : '140/90',
    heartRate: 70 + (index % 5) * 5,
    temperature: 36.5 + (index % 3) * 0.5,
    respiratoryRate: 16 + (index % 4),
    oxygenSaturation: 95 + (index % 5),
    recordedAt: new Date(`2025-07-${10 + index}`),
  }));

  console.log('Seeding vital signs...');
  for (const vitalSign of vitalSigns) {
    try {
      const existingVitalSign = await prisma.vitalSign.findUnique({
        where: { id: vitalSign.id }
      });
      
      if (!existingVitalSign) {
        await prisma.vitalSign.create({
          data: vitalSign,
        });
        console.log(`Created vital sign for medical record: ${vitalSign.medicalRecordId}`);
      } else {
        console.log(`Vital sign already exists: ${vitalSign.id}`);
      }
    } catch (error) {
      console.error(`Error creating vital sign for medical record ${vitalSign.medicalRecordId}:`, error.message);
    }
  }

  // Seed Chief Complaint (1 per medical record)
  const chiefComplaints = medicalRecords.map((record, index) => ({
    id: uuidv4(),
    medicalRecordId: record.id,
    description: index % 2 === 0 ? 'Persistent headache' : 'Chest pain',
    duration: '2 weeks',
    onset: 'Gradual',
  }));

  console.log('Seeding chief complaints...');
  for (const complaint of chiefComplaints) {
    try {
      // Check if chief complaint already exists for this medical record (unique constraint)
      const existingComplaint = await prisma.chiefComplaint.findUnique({
        where: { medicalRecordId: complaint.medicalRecordId }
      });
      
      if (!existingComplaint) {
        await prisma.chiefComplaint.create({
          data: complaint,
        });
        console.log(`Created chief complaint for medical record: ${complaint.medicalRecordId}`);
      } else {
        console.log(`Chief complaint already exists for medical record: ${complaint.medicalRecordId}`);
      }
    } catch (error) {
      console.error(`Error creating chief complaint for medical record ${complaint.medicalRecordId}:`, error.message);
    }
  }

  // Seed Present Illness (1 per medical record)
  const presentIllnesses = medicalRecords.map((record, index) => ({
    id: uuidv4(),
    medicalRecordId: record.id,
    narrative: index % 2 === 0 ? 'Patient reports persistent headaches with occasional dizziness.' : 'Patient experiences chest pain radiating to the left arm.',
    severity: 'Moderate',
    progress: 'Stable',
    associatedSymptoms: index % 2 === 0 ? 'Nausea' : 'Shortness of breath',
  }));

  console.log('Seeding present illnesses...');
  for (const illness of presentIllnesses) {
    try {
      // Check if present illness already exists for this medical record (unique constraint)
      const existingIllness = await prisma.presentIllness.findUnique({
        where: { medicalRecordId: illness.medicalRecordId }
      });
      
      if (!existingIllness) {
        await prisma.presentIllness.create({
          data: illness,
        });
        console.log(`Created present illness for medical record: ${illness.medicalRecordId}`);
      } else {
        console.log(`Present illness already exists for medical record: ${illness.medicalRecordId}`);
      }
    } catch (error) {
      console.error(`Error creating present illness for medical record ${illness.medicalRecordId}:`, error.message);
    }
  }

  // Seed Past Medical Conditions (1-2 per patient)
  const pastMedicalConditions = medicalRecords.flatMap((record, index) => [
    {
      id: uuidv4(),
      medicalRecordId: record.id,
      condition: index % 2 === 0 ? 'Asthma' : 'Malaria',
      diagnosisDate: new Date(`2020-05-${10 + index}`),
      notes: 'Managed with medication',
    },
  ]);

  console.log('Seeding past medical conditions...');
  for (const condition of pastMedicalConditions) {
    try {
      const existingCondition = await prisma.pastMedicalCondition.findUnique({
        where: { id: condition.id }
      });
      
      if (!existingCondition) {
        await prisma.pastMedicalCondition.create({
          data: condition,
        });
        console.log(`Created past medical condition: ${condition.condition}`);
      } else {
        console.log(`Past medical condition already exists: ${condition.id}`);
      }
    } catch (error) {
      console.error(`Error creating past medical condition for medical record ${condition.medicalRecordId}:`, error.message);
    }
  }

  // Seed Medication History (1-2 per patient)
  const medicationHistories = medicalRecords.flatMap((record, index) => [
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

  console.log('Seeding medication histories...');
  for (const medication of medicationHistories) {
    try {
      const existingMedication = await prisma.medicationHistory.findUnique({
        where: { id: medication.id }
      });
      
      if (!existingMedication) {
        await prisma.medicationHistory.create({
          data: medication,
        });
        console.log(`Created medication history: ${medication.medicationName}`);
      } else {
        console.log(`Medication history already exists: ${medication.id}`);
      }
    } catch (error) {
      console.error(`Error creating medication history for medical record ${medication.medicalRecordId}:`, error.message);
    }
  }

  // Seed Social History (1 per medical record)
  const socialHistories = medicalRecords.map((record, index) => ({
    id: uuidv4(),
    medicalRecordId: record.id,
    smokingStatus: index % 2 === 0 ? 'Non-smoker' : 'Former smoker',
    alcoholUse: 'Occasional',
    occupation: index % 2 === 0 ? 'Teacher' : 'Farmer',
    maritalStatus: 'Married',
    livingSituation: 'Lives with family',
  }));

  console.log('Seeding social histories...');
  for (const history of socialHistories) {
    try {
      // Check if social history already exists for this medical record (unique constraint)
      const existingHistory = await prisma.socialHistory.findUnique({
        where: { medicalRecordId: history.medicalRecordId }
      });
      
      if (!existingHistory) {
        await prisma.socialHistory.create({
          data: history,
        });
        console.log(`Created social history for medical record: ${history.medicalRecordId}`);
      } else {
        console.log(`Social history already exists for medical record: ${history.medicalRecordId}`);
      }
    } catch (error) {
      console.error(`Error creating social history for medical record ${history.medicalRecordId}:`, error.message);
    }
  }

  console.log('Database seeding completed successfully!');
  console.log(`Total new patients created: ${newPatients.length}`);
  console.log(`Total addresses created: ${addresses.length}`);
  console.log(`Total next of kin created: ${nextOfKins.length}`);
  console.log(`Total insurance records created: ${insuranceInfos.length}`);
  console.log(`Total medical records created: ${medicalRecords.length}`);
  console.log(`Total allergies created: ${allergies.length}`);
  console.log(`Total diagnoses created: ${diagnoses.length}`);
  console.log(`Total vital signs created: ${vitalSigns.length}`);
  console.log(`Total chief complaints created: ${chiefComplaints.length}`);
  console.log(`Total present illnesses created: ${presentIllnesses.length}`);
  console.log(`Total past medical conditions created: ${pastMedicalConditions.length}`);
  console.log(`Total medication histories created: ${medicationHistories.length}`);
  console.log(`Total social histories created: ${socialHistories.length}`);
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Database connection closed.');
  });