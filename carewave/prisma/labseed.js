const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { v4: uuidv4 } = require('uuid');

// Generate meaningful IDs
const generateLabTestId = (index) => `LAB-TEST-${String(index).padStart(4, '0')}`;
const generateSampleId = (index) => `SAMPLE-${String(index).padStart(6, '0')}`;
const generateLabRequestId = (index) => `LAB-REQ-${String(index).padStart(6, '0')}`;
const generateLabResultId = (index) => `LAB-RES-${String(index).padStart(6, '0')}`;

// Common lab tests with realistic data
const labTestsData = [
  { name: 'Complete Blood Count (CBC)', description: 'Measures different blood cells and their characteristics' },
  { name: 'Basic Metabolic Panel (BMP)', description: 'Tests glucose, electrolytes, and kidney function' },
  { name: 'Comprehensive Metabolic Panel (CMP)', description: 'Extended metabolic panel including liver function' },
  { name: 'Lipid Panel', description: 'Cholesterol and triglyceride levels' },
  { name: 'Thyroid Function Tests', description: 'TSH, T3, T4 levels' },
  { name: 'Liver Function Tests', description: 'ALT, AST, bilirubin, albumin' },
  { name: 'Hemoglobin A1C', description: 'Average blood sugar over 2-3 months' },
  { name: 'Urinalysis', description: 'Urine chemistry, microscopy, and culture' },
  { name: 'Prothrombin Time (PT)', description: 'Blood clotting time measurement' },
  { name: 'Partial Thromboplastin Time (PTT)', description: 'Blood clotting pathway assessment' },
  { name: 'D-Dimer', description: 'Blood clot formation and breakdown marker' },
  { name: 'Troponin', description: 'Heart muscle damage marker' },
  { name: 'CRP (C-Reactive Protein)', description: 'Inflammation marker' },
  { name: 'ESR (Erythrocyte Sedimentation Rate)', description: 'Inflammation and infection marker' },
  { name: 'Blood Culture', description: 'Bacterial infection detection in blood' },
  { name: 'Urine Culture', description: 'Bacterial infection detection in urine' },
  { name: 'Stool Culture', description: 'Bacterial infection detection in stool' },
  { name: 'Vitamin D', description: '25-hydroxyvitamin D levels' },
  { name: 'Vitamin B12', description: 'Cobalamin levels' },
  { name: 'Folate', description: 'Folic acid levels' },
  { name: 'Iron Studies', description: 'Iron, ferritin, TIBC, transferrin saturation' },
  { name: 'Magnesium', description: 'Serum magnesium levels' },
  { name: 'Phosphorus', description: 'Serum phosphorus levels' },
  { name: 'Amylase', description: 'Pancreatic enzyme levels' },
  { name: 'Lipase', description: 'Pancreatic enzyme for fat digestion' },
  { name: 'Creatine Kinase (CK)', description: 'Muscle damage marker' },
  { name: 'Lactate Dehydrogenase (LDH)', description: 'Tissue damage marker' },
  { name: 'Alkaline Phosphatase', description: 'Liver and bone enzyme' },
  { name: 'Gamma-GT', description: 'Liver enzyme marker' },
  { name: 'Uric Acid', description: 'Gout and kidney function marker' },
  { name: 'PSA (Prostate Specific Antigen)', description: 'Prostate cancer screening' },
  { name: 'CEA (Carcinoembryonic Antigen)', description: 'Cancer marker' },
  { name: 'CA 125', description: 'Ovarian cancer marker' },
  { name: 'CA 19-9', description: 'Pancreatic cancer marker' },
  { name: 'AFP (Alpha-fetoprotein)', description: 'Liver cancer marker' },
  { name: 'Hepatitis B Surface Antigen', description: 'Hepatitis B infection marker' },
  { name: 'Hepatitis C Antibody', description: 'Hepatitis C infection marker' },
  { name: 'HIV Test', description: 'HIV antibody and antigen detection' },
  { name: 'Syphilis Test (RPR)', description: 'Syphilis screening test' },
  { name: 'Rheumatoid Factor', description: 'Autoimmune arthritis marker' },
  { name: 'ANA (Antinuclear Antibody)', description: 'Autoimmune disease screening' },
  { name: 'Anti-CCP', description: 'Rheumatoid arthritis specific marker' },
  { name: 'Complement C3', description: 'Immune system protein' },
  { name: 'Complement C4', description: 'Immune system protein' },
  { name: 'Immunoglobulin G (IgG)', description: 'Antibody levels' },
  { name: 'Immunoglobulin A (IgA)', description: 'Antibody levels' },
  { name: 'Immunoglobulin M (IgM)', description: 'Antibody levels' },
  { name: 'Glucose Tolerance Test', description: 'Diabetes screening test' },
  { name: 'Cortisol', description: 'Stress hormone levels' },
  { name: 'Testosterone', description: 'Male hormone levels' },
  { name: 'Estrogen', description: 'Female hormone levels' },
];

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
const generateLabResult = (labTestName) => {
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

  const templates = resultTemplates[labTestName];
  if (templates) {
    return templates[Math.floor(Math.random() * templates.length)];
  }
  
  // Default results for tests not specifically defined
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

// Utility function to get random patient ID (assuming patient IDs are PAT-000001 to PAT-005000)
const getRandomPatientId = () => {
  const patientNumber = Math.floor(Math.random() * 5000) + 1;
  return `PAT-${String(patientNumber).padStart(6, '0')}`;
};

async function seedLaboratoryData() {
  console.log('🧪 Starting laboratory data seeding...');

  try {
    // 1. Create Lab Tests (50 tests)
    console.log('📝 Creating lab tests...');
    const labTests = [];
    for (let i = 0; i < labTestsData.length; i++) {
      const labTest = {
        id: generateLabTestId(i + 1),
        name: labTestsData[i].name,
        description: labTestsData[i].description,
        createdAt: randomDate(new Date('2023-01-01'), new Date('2024-12-31')),
        updatedAt: new Date()
      };
      labTests.push(labTest);
    }

    await prisma.labTest.createMany({
      data: labTests,
      skipDuplicates: true
    });

    console.log(`✅ Created ${labTests.length} lab tests`);

    // 2. Create Samples (1200 samples to cover all lab requests)
    console.log('🧪 Creating samples...');
    const samples = [];
    for (let i = 1; i <= 1200; i++) {
      const collectedAt = randomDate(new Date('2024-01-01'), new Date('2024-12-31'));
      const sample = {
        id: generateSampleId(i),
        patientId: getRandomPatientId(),
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

    console.log(`✅ Created ${samples.length} samples`);

    // 3. Create Lab Requests (1000 requests)
    console.log('🔬 Creating lab requests...');
    const labRequests = [];
    for (let i = 1; i <= 1000; i++) {
      const requestedAt = randomDate(new Date('2024-01-01'), new Date('2024-12-31'));
      const labRequest = {
        id: generateLabRequestId(i),
        patientId: getRandomPatientId(),
        labTestId: getRandomElement(labTests).id,
        sampleId: Math.random() > 0.1 ? generateSampleId(Math.floor(Math.random() * 1200) + 1) : null, // 90% have samples
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

    console.log(`✅ Created ${labRequests.length} lab requests`);

    // 4. Create Lab Results (1000 results)
    console.log('📊 Creating lab results...');
    const labResults = [];
    for (let i = 1; i <= 1000; i++) {
      const labRequest = labRequests[i - 1];
      const labTest = labTests.find(test => test.id === labRequest.labTestId);
      const resultedAt = new Date(labRequest.requestedAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000); // 0-7 days after request
      
      const labResult = {
        id: generateLabResultId(i),
        labRequestId: labRequest.id,
        result: generateLabResult(labTest.name),
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

    console.log(`✅ Created ${labResults.length} lab results`);

    // Summary
    console.log('\n🎉 Laboratory data seeding completed!');
    console.log('📈 Summary:');
    console.log(`   • Lab Tests: ${labTests.length}`);
    console.log(`   • Samples: ${samples.length}`);
    console.log(`   • Lab Requests: ${labRequests.length}`);
    console.log(`   • Lab Results: ${labResults.length}`);
    console.log('\n💡 ID Formats:');
    console.log('   • Lab Tests: LAB-TEST-0001 to LAB-TEST-0050');
    console.log('   • Samples: SAMPLE-000001 to SAMPLE-001200');
    console.log('   • Lab Requests: LAB-REQ-000001 to LAB-REQ-001000');
    console.log('   • Lab Results: LAB-RES-000001 to LAB-RES-001000');

  } catch (error) {
    console.error('❌ Error seeding laboratory data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeder
seedLaboratoryData()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });