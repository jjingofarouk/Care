// seedLaboratoryData.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { v4: uuidv4 } = require('uuid');

// Sample types
const sampleTypes = [
  'Blood - Serum',
  'Blood - Plasma',
  'Blood - Whole Blood',
  'Urine - Random',
  'Urine - 24 Hour',
  'Urine - First Morning',
  'Stool',
  'Sputum',
  'Throat Swab',
  'Nasal Swab',
  'Wound Swab',
  'CSF (Cerebrospinal Fluid)',
  'Pleural Fluid',
  'Ascitic Fluid',
  'Synovial Fluid',
  'Tissue Biopsy',
  'Bone Marrow',
  'Saliva',
  'Hair',
  'Nail Clippings'
];

// Generate realistic lab results based on test type
const generateLabResult = async (labTestId) => {
  const labTest = await prisma.labTest.findUnique({ where: { id: labTestId } });
  const resultTemplates = {
    'Complete Blood Count (CBC)': [
      'WBC: 7.2 K/uL, RBC: 4.5 M/uL, Hgb: 14.2 g/dL, Hct: 42.1%, Platelets: 285 K/uL',
      'WBC: 6.8 K/uL, RBC: 4.2 M/uL, Hgb: 12.8 g/dL, Hct: 38.5%, Platelets: 320 K/uL',
      'WBC: 8.1 K/uL, RBC: 4.8 M/uL, Hgb: 15.1 g/dL, Hct: 45.2%, Platelets: 275 K/uL',
      'WBC: 5.9 K/uL, RBC: 4.1 M/uL, Hgb: 13.5 g/dL, Hct: 39.8%, Platelets: 295 K/uL'
    ],
    'Basic Metabolic Panel (BMP)': [
      'Glucose: 95 mg/dL, BUN: 18 mg/dL, Creatinine: 1.0 mg/dL, Na: 140 mEq/L, K: 4.2 mEq/L, Cl: 102 mEq/L, CO2: 24 mEq/L',
      'Glucose: 110 mg/dL, BUN: 22 mg/dL, Creatinine: 1.2 mg/dL, Na: 138 mEq/L, K: 4.5 mEq/L, Cl: 105 mEq/L, CO2: 22 mEq/L',
      'Glucose: 88 mg/dL, BUN: 15 mg/dL, Creatinine: 0.9 mg/dL, Na: 142 mEq/L, K: 3.8 mEq/L, Cl: 100 mEq/L, CO2: 25 mEq/L'
    ],
    'Lipid Panel': [
      'Total Cholesterol: 185 mg/dL, HDL: 52 mg/dL, LDL: 110 mg/dL, Triglycerides: 115 mg/dL',
      'Total Cholesterol: 220 mg/dL, HDL: 45 mg/dL, LDL: 145 mg/dL, Triglycerides: 150 mg/dL',
      'Total Cholesterol: 165 mg/dL, HDL: 58 mg/dL, LDL: 95 mg/dL, Triglycerides: 85 mg/dL'
    ],
    'Thyroid Function Tests': [
      'TSH: 2.1 mIU/L, Free T4: 1.2 ng/dL, Free T3: 3.1 pg/mL',
      'TSH: 1.8 mIU/L, Free T4: 1.4 ng/dL, Free T3: 3.4 pg/mL',
      'TSH: 3.2 mIU/L, Free T4: 1.0 ng/dL, Free T3: 2.8 pg/mL'
    ],
    'Liver Function Tests': [
      'ALT: 28 U/L, AST: 32 U/L, Total Bilirubin: 0.8 mg/dL, Albumin: 4.2 g/dL',
      'ALT: 35 U/L, AST: 28 U/L, Total Bilirubin: 1.1 mg/dL, Albumin: 3.8 g/dL',
      'ALT: 22 U/L, AST: 25 U/L, Total Bilirubin: 0.6 mg/dL, Albumin: 4.5 g/dL'
    ],
    'Hemoglobin A1C': [
      'HbA1c: 5.4%',
      'HbA1c: 6.2%',
      'HbA1c: 7.1%',
      'HbA1c: 5.8%'
    ],
    'Urinalysis': [
      'Color: Yellow, Clarity: Clear, Specific Gravity: 1.020, pH: 6.0, Protein: Negative, Glucose: Negative, Ketones: Negative, Blood: Negative',
      'Color: Amber, Clarity: Clear, Specific Gravity: 1.025, pH: 6.5, Protein: Trace, Glucose: Negative, Ketones: Negative, Blood: Negative',
      'Color: Pale Yellow, Clarity: Clear, Specific Gravity: 1.015, pH: 7.0, Protein: Negative, Glucose: Negative, Ketones: Negative, Blood: Negative'
    ],
    'Blood Culture': [
      'No growth after 72 hours',
      'Staphylococcus epidermidis - likely contaminant',
      'Escherichia coli - susceptible to ampicillin, ciprofloxacin',
      'Streptococcus pneumoniae - susceptible to penicillin'
    ],
    'Vitamin D': [
      '25-OH Vitamin D: 32 ng/mL (Sufficient)',
      '25-OH Vitamin D: 18 ng/mL (Insufficient)',
      '25-OH Vitamin D: 45 ng/mL (Sufficient)',
      '25-OH Vitamin D: 12 ng/mL (Deficient)'
    ]
  };

  const templates = resultTemplates[labTest.name];
  if (templates) {
    return templates[Math.floor(Math.random() * templates.length)];
  }
  
  const defaultResults = [
    'Normal',
    'Within normal limits',
    'Abnormal - see notes',
    'Negative',
    'Positive',
    'Elevated',
    'Decreased',
    'Results pending',
    'Inconclusive - repeat recommended'
  ];
  
  return defaultResults[Math.floor(Math.random() * defaultResults.length)];
};

// Utility function to generate random date within range
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Utility function to get random element from array
const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// Utility function to get random patient ID from existing patients
const getRandomPatientId = async () => {
  const patients = await prisma.patient.findMany({
    select: { id: true },
    take: 1009
  });
  return getRandomElement(patients).id;
};

// Utility function to get random lab test ID from existing lab tests
const getRandomLabTestId = async () => {
  const labTests = await prisma.labTest.findMany({
    select: { id: true }
  });
  return getRandomElement(labTests).id;
};

async function seedLaboratoryData() {
  try {
    // 1. Create Samples (1200 samples)
    console.log('🧪 Creating samples...');
    const samples = [];
    for (let i = 1; i <= 1200; i++) {
      const collectedAt = randomDate(new Date('2024-01-01'), new Date('2024-12-31'));
      const sample = {
        id: uuidv4(),
        patientId: await getRandomPatientId(),
        sampleType: getRandomElement(sampleTypes),
        collectedAt,
        createdAt: collectedAt,
        updatedAt: new Date()
      };
      samples.push(sample);
    }

    await prisma.sample.createMany({
      data: samples,
      skipDuplicates: true
    });
    console.log(`✅ Seeded ${samples.length} samples`);

    // 2. Create Lab Requests (1000 requests)
    console.log('🔬 Creating lab requests...');
    const labRequests = [];
    for (let i = 1; i <= 1000; i++) {
      const requestedAt = randomDate(new Date('2024-01-01'), new Date('2024-12-31'));
      const labRequest = {
        id: uuidv4(),
        patientId: await getRandomPatientId(),
        labTestId: await getRandomLabTestId(),
        sampleId: Math.random() > 0.1 ? samples[Math.floor(Math.random() * samples.length)].id : null,
        requestedAt,
        createdAt: requestedAt,
        updatedAt: new Date()
      };
      labRequests.push(labRequest);
    }

    await prisma.labRequest.createMany({
      data: labRequests,
      skipDuplicates: true
    });
    console.log(`✅ Seeded ${labRequests.length} lab requests`);

    // 3. Create Lab Results (1000 results)
    console.log('📊 Creating lab results...');
    const labResults = [];
    for (let i = 1; i <= 1000; i++) {
      const labRequest = labRequests[i - 1];
      const resultedAt = new Date(labRequest.requestedAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);
      
      const labResult = {
        id: uuidv4(),
        labRequestId: labRequest.id,
        result: await generateLabResult(labRequest.labTestId),
        resultedAt,
        createdAt: resultedAt,
        updatedAt: new Date()
      };
      labResults.push(labResult);
    }

    await prisma.labResult.createMany({
      data: labResults,
      skipDuplicates: true
    });
    console.log(`✅ Seeded ${labResults.length} lab results`);

  } catch (error) {
    console.error('❌ Error seeding laboratory data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedLaboratoryData()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });