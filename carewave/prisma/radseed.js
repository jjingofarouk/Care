const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

// Helper function to generate meaningful IDs
const generateId = (prefix, index) => {
  return `${prefix}-${String(index).padStart(4, '0')}-${uuidv4().slice(0, 8)}`;
};

// Helper function to get random date within range
const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to get random element from array
const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// Comprehensive radiology test data
const radiologyTests = [
  // X-Ray Tests
  { name: 'Chest X-Ray', description: 'Chest radiograph to evaluate lungs, heart, and surrounding structures' },
  { name: 'Abdominal X-Ray', description: 'Abdominal radiograph to evaluate GI tract and abdominal organs' },
  { name: 'Pelvic X-Ray', description: 'Pelvic radiograph to evaluate pelvic bones and structures' },
  { name: 'Skull X-Ray', description: 'Skull radiograph to evaluate cranial bones and sinuses' },
  { name: 'Spine X-Ray Cervical', description: 'Cervical spine radiograph to evaluate neck vertebrae' },
  { name: 'Spine X-Ray Lumbar', description: 'Lumbar spine radiograph to evaluate lower back vertebrae' },
  { name: 'Extremity X-Ray Upper', description: 'Upper extremity radiograph (arm, forearm, hand)' },
  { name: 'Extremity X-Ray Lower', description: 'Lower extremity radiograph (leg, ankle, foot)' },
  { name: 'Shoulder X-Ray', description: 'Shoulder radiograph to evaluate shoulder joint and surrounding bones' },
  { name: 'Hip X-Ray', description: 'Hip radiograph to evaluate hip joint and femur' },
  
  // CT Scans
  { name: 'CT Head', description: 'Computed tomography of the head to evaluate brain and skull' },
  { name: 'CT Chest', description: 'Computed tomography of the chest to evaluate lungs and thoracic structures' },
  { name: 'CT Abdomen', description: 'Computed tomography of the abdomen to evaluate abdominal organs' },
  { name: 'CT Pelvis', description: 'Computed tomography of the pelvis to evaluate pelvic organs' },
  { name: 'CT Abdomen/Pelvis', description: 'Combined CT of abdomen and pelvis' },
  { name: 'CT Spine', description: 'Computed tomography of the spine' },
  { name: 'CT Angiography', description: 'CT angiography to evaluate blood vessels' },
  { name: 'CT Pulmonary Embolism', description: 'CT pulmonary angiogram to evaluate for pulmonary embolism' },
  { name: 'CT Coronary Angiography', description: 'CT coronary angiography to evaluate coronary arteries' },
  { name: 'CT Enterography', description: 'CT enterography to evaluate small bowel' },
  
  // MRI Scans
  { name: 'MRI Brain', description: 'Magnetic resonance imaging of the brain' },
  { name: 'MRI Spine Cervical', description: 'MRI of cervical spine' },
  { name: 'MRI Spine Lumbar', description: 'MRI of lumbar spine' },
  { name: 'MRI Spine Thoracic', description: 'MRI of thoracic spine' },
  { name: 'MRI Knee', description: 'MRI of knee joint' },
  { name: 'MRI Shoulder', description: 'MRI of shoulder joint' },
  { name: 'MRI Abdomen', description: 'MRI of abdomen' },
  { name: 'MRI Pelvis', description: 'MRI of pelvis' },
  { name: 'MRI Cardiac', description: 'Cardiac MRI to evaluate heart structure and function' },
  { name: 'MRI Breast', description: 'Breast MRI for cancer screening and evaluation' },
  
  // Ultrasound
  { name: 'Ultrasound Abdomen', description: 'Abdominal ultrasound to evaluate organs' },
  { name: 'Ultrasound Pelvis', description: 'Pelvic ultrasound' },
  { name: 'Ultrasound Obstetric', description: 'Obstetric ultrasound for pregnancy evaluation' },
  { name: 'Ultrasound Cardiac', description: 'Echocardiogram to evaluate heart function' },
  { name: 'Ultrasound Thyroid', description: 'Thyroid ultrasound' },
  { name: 'Ultrasound Breast', description: 'Breast ultrasound' },
  { name: 'Ultrasound Carotid', description: 'Carotid duplex ultrasound' },
  { name: 'Ultrasound Renal', description: 'Renal ultrasound to evaluate kidneys' },
  { name: 'Ultrasound Scrotal', description: 'Scrotal ultrasound' },
  { name: 'Ultrasound Venous Doppler', description: 'Venous doppler ultrasound' },
  
  // Mammography
  { name: 'Mammography Screening', description: 'Screening mammography for breast cancer detection' },
  { name: 'Mammography Diagnostic', description: 'Diagnostic mammography for breast evaluation' },
  { name: 'Mammography Tomosynthesis', description: '3D mammography (tomosynthesis)' },
  
  // Nuclear Medicine
  { name: 'Bone Scan', description: 'Nuclear medicine bone scan to evaluate bone metabolism' },
  { name: 'Thyroid Scan', description: 'Nuclear medicine thyroid scan' },
  { name: 'Cardiac Stress Test', description: 'Nuclear medicine cardiac stress test' },
  { name: 'Gallium Scan', description: 'Gallium scan for infection/inflammation' },
  { name: 'PET Scan', description: 'Positron emission tomography scan' },
  { name: 'PET/CT Scan', description: 'Combined PET/CT scan' },
  
  // Fluoroscopy
  { name: 'Barium Swallow', description: 'Barium swallow study to evaluate esophagus' },
  { name: 'Upper GI Series', description: 'Upper GI series to evaluate stomach and small bowel' },
  { name: 'Barium Enema', description: 'Barium enema to evaluate colon' },
  { name: 'IVP', description: 'Intravenous pyelogram to evaluate kidneys and urinary tract' },
  { name: 'Hysterosalpingography', description: 'HSG to evaluate uterus and fallopian tubes' },
  { name: 'Arthography', description: 'Joint injection and imaging' },
  
  // Interventional
  { name: 'Angiography', description: 'Catheter angiography' },
  { name: 'Embolization', description: 'Therapeutic embolization procedure' },
  { name: 'Biopsy CT Guided', description: 'CT-guided biopsy' },
  { name: 'Biopsy US Guided', description: 'Ultrasound-guided biopsy' },
  { name: 'Drainage Procedure', description: 'Image-guided drainage procedure' }
];

// Sample result interpretations by test type
const resultTemplates = {
  'Chest X-Ray': [
    'Normal chest X-ray. Heart size and mediastinum are normal. Lungs are clear bilaterally. No pneumothorax or pleural effusion.',
    'Mild cardiomegaly noted. Lungs are clear. No acute cardiopulmonary process.',
    'Right lower lobe pneumonia. Ill-defined opacity in the right lower lobe consistent with pneumonia.',
    'Left pleural effusion. Moderate left pleural effusion. Recommend correlation with clinical findings.',
    'Emphysematous changes. Hyperinflation with flattened diaphragms consistent with COPD.',
    'Pneumothorax. Small left pneumothorax. Clinical correlation recommended.',
    'Pulmonary edema. Bilateral pulmonary edema with enlarged cardiac silhouette.',
    'Lung nodule. 1.2 cm nodule in right upper lobe. Recommend CT follow-up.',
    'Rib fracture. Healing fracture of the 7th rib on the right side.',
    'Atelectasis. Right middle lobe atelectasis. No other acute findings.'
  ],
  'CT Head': [
    'Normal head CT. No acute intracranial abnormality. Brain parenchyma appears normal.',
    'Acute infarct. Acute left MCA territory infarct with early signs of mass effect.',
    'Intracerebral hemorrhage. Right frontal intracerebral hemorrhage with surrounding edema.',
    'Subdural hematoma. Acute right subdural hematoma with 5mm midline shift.',
    'Subarachnoid hemorrhage. Diffuse subarachnoid hemorrhage in the basal cisterns.',
    'Cerebral edema. Diffuse cerebral edema with effacement of sulci and ventricles.',
    'Chronic infarct. Old left parietal infarct with encephalomalacia.',
    'Ventricular enlargement. Mild ventricular enlargement consistent with age-related changes.',
    'Sinusitis. Acute sinusitis involving maxillary and ethmoid sinuses.',
    'Skull fracture. Linear skull fracture in the right parietal bone.'
  ],
  'CT Chest': [
    'Normal chest CT. No pulmonary embolism or acute pulmonary abnormality.',
    'Pulmonary embolism. Bilateral pulmonary emboli in segmental branches.',
    'Lung cancer. 3.5 cm mass in right upper lobe with mediastinal lymphadenopathy.',
    'Pneumonia. Bilateral lower lobe pneumonia with ground-glass opacities.',
    'Interstitial lung disease. Honeycombing and traction bronchiectasis consistent with UIP.',
    'Pleural effusion. Large right pleural effusion with compressive atelectasis.',
    'Aortic dissection. Type A aortic dissection extending from root to arch.',
    'Mediastinal mass. Large anterior mediastinal mass, likely lymphoma.',
    'Emphysema. Severe centrilobular emphysema with bullous changes.',
    'Pneumothorax. Large left pneumothorax with mediastinal shift.'
  ],
  'MRI Brain': [
    'Normal brain MRI. No acute intracranial abnormality.',
    'Multiple sclerosis. Multiple T2 hyperintense lesions consistent with demyelinating disease.',
    'Brain tumor. Enhancing mass in left frontal lobe with surrounding edema.',
    'Stroke. Acute infarct in right MCA territory with restricted diffusion.',
    'Meningitis. Leptomeningeal enhancement consistent with infectious meningitis.',
    'Chronic microvascular changes. Small vessel disease with chronic white matter changes.',
    'Hydrocephalus. Communicating hydrocephalus with ventricular enlargement.',
    'Cerebral aneurysm. 7mm aneurysm of the anterior communicating artery.',
    'Alzheimer disease. Cortical atrophy and hippocampal volume loss.',
    'Cavernous malformation. Right temporal cavernous malformation with hemosiderin.'
  ],
  'Ultrasound Abdomen': [
    'Normal abdominal ultrasound. Liver, gallbladder, pancreas, and kidneys appear normal.',
    'Gallstones. Multiple gallstones without evidence of cholecystitis.',
    'Acute cholecystitis. Thickened gallbladder wall with pericholecystic fluid.',
    'Fatty liver. Increased hepatic echogenicity consistent with fatty infiltration.',
    'Kidney stones. Multiple stones in right kidney with mild hydronephrosis.',
    'Liver cyst. Simple hepatic cyst in right lobe, benign appearance.',
    'Splenomegaly. Enlarged spleen measuring 15 cm in length.',
    'Pancreatic mass. Hypoechoic mass in pancreatic head, recommend CT/MRI.',
    'Renal mass. Complex cystic lesion in left kidney, recommend further evaluation.',
    'Ascites. Moderate amount of ascites throughout peritoneal cavity.'
  ],
  'Mammography Screening': [
    'Normal mammogram. BI-RADS 1 - No evidence of malignancy.',
    'Benign findings. BI-RADS 2 - Benign calcifications and fat necrosis.',
    'Probably benign. BI-RADS 3 - Probably benign mass, recommend 6-month follow-up.',
    'Suspicious abnormality. BI-RADS 4 - Suspicious microcalcifications, recommend biopsy.',
    'Highly suggestive of malignancy. BI-RADS 5 - Irregular spiculated mass.',
    'Fibrocystic changes. Dense breast tissue with fibrocystic changes.',
    'Calcifications. Scattered benign calcifications throughout both breasts.',
    'Architectural distortion. Architectural distortion in upper outer quadrant.',
    'Lipoma. Well-circumscribed radiolucent mass consistent with lipoma.',
    'Lymph node. Enlarged axillary lymph node, recommend correlation.'
  ]
};

// Sample image URLs from open-source datasets
const sampleImageUrls = [
  'https://medpix.nlm.nih.gov/image/12345/chest-xray-normal.jpg',
  'https://medpix.nlm.nih.gov/image/12346/chest-xray-pneumonia.jpg',
  'https://medpix.nlm.nih.gov/image/12347/ct-head-normal.jpg',
  'https://medpix.nlm.nih.gov/image/12348/ct-head-stroke.jpg',
  'https://medpix.nlm.nih.gov/image/12349/mri-brain-normal.jpg',
  'https://medpix.nlm.nih.gov/image/12350/mri-brain-tumor.jpg',
  'https://medpix.nlm.nih.gov/image/12351/ultrasound-abdomen-normal.jpg',
  'https://medpix.nlm.nih.gov/image/12352/ultrasound-gallstones.jpg',
  'https://medpix.nlm.nih.gov/image/12353/mammography-normal.jpg',
  'https://medpix.nlm.nih.gov/image/12354/mammography-mass.jpg',
  'https://medpix.nlm.nih.gov/image/12355/ct-chest-pe.jpg',
  'https://medpix.nlm.nih.gov/image/12356/ct-abdomen-normal.jpg',
  'https://medpix.nlm.nih.gov/image/12357/xray-spine-normal.jpg',
  'https://medpix.nlm.nih.gov/image/12358/xray-fracture.jpg',
  'https://medpix.nlm.nih.gov/image/12359/mri-knee-normal.jpg',
  'https://medpix.nlm.nih.gov/image/12360/mri-knee-tear.jpg',
  'https://medpix.nlm.nih.gov/image/12361/ultrasound-cardiac.jpg',
  'https://medpix.nlm.nih.gov/image/12362/bone-scan-normal.jpg',
  'https://medpix.nlm.nih.gov/image/12363/pet-scan-normal.jpg',
  'https://medpix.nlm.nih.gov/image/12364/angiography-normal.jpg',
  // Additional generic URLs from various open datasets
  'https://dataset.radiology.org/sample/chest-001.jpg',
  'https://dataset.radiology.org/sample/chest-002.jpg',
  'https://dataset.radiology.org/sample/brain-001.jpg',
  'https://dataset.radiology.org/sample/brain-002.jpg',
  'https://dataset.radiology.org/sample/abdomen-001.jpg',
  'https://dataset.radiology.org/sample/abdomen-002.jpg',
  'https://dataset.radiology.org/sample/spine-001.jpg',
  'https://dataset.radiology.org/sample/spine-002.jpg',
  'https://dataset.radiology.org/sample/extremity-001.jpg',
  'https://dataset.radiology.org/sample/extremity-002.jpg'
];

async function seedRadiologyData() {
  console.log('Starting radiology data seeding...');
  
  try {
    // Get all existing patients
    const patients = await prisma.patient.findMany({
      select: { id: true }
    });
    
    if (patients.length === 0) {
      throw new Error('No patients found. Please seed patients first.');
    }
    
    console.log(`Found ${patients.length} patients`);
    
    // 1. Seed Radiology Tests
    console.log('Seeding radiology tests...');
    const createdTests = [];
    
    for (let i = 0; i < radiologyTests.length; i++) {
      const test = radiologyTests[i];
      const createdTest = await prisma.radiologyTest.create({
        data: {
          id: generateId('RAD-TEST', i + 1),
          name: test.name,
          description: test.description,
          createdAt: getRandomDate(new Date(2020, 0, 1), new Date(2024, 11, 31)),
          updatedAt: new Date()
        }
      });
      createdTests.push(createdTest);
    }
    
    console.log(`Created ${createdTests.length} radiology tests`);
    
    // 2. Seed Imaging Orders (2000)
    console.log('Seeding imaging orders...');
    const createdOrders = [];
    
    for (let i = 0; i < 2000; i++) {
      const randomPatient = getRandomElement(patients);
      const randomTest = getRandomElement(createdTests);
      const orderedDate = getRandomDate(new Date(2023, 0, 1), new Date(2025, 6, 18));
      
      const order = await prisma.imagingOrder.create({
        data: {
          id: generateId('IMG-ORDER', i + 1),
          patientId: randomPatient.id,
          radiologyTestId: randomTest.id,
          orderedAt: orderedDate,
          createdAt: orderedDate,
          updatedAt: orderedDate
        }
      });
      createdOrders.push(order);
    }
    
    console.log(`Created ${createdOrders.length} imaging orders`);
    
    // 3. Seed Radiology Results (1000)
    console.log('Seeding radiology results...');
    const createdResults = [];
    
    // Select 1000 random orders to have results
    const ordersWithResults = createdOrders
      .sort(() => 0.5 - Math.random())
      .slice(0, 1000);
    
    for (let i = 0; i < ordersWithResults.length; i++) {
      const order = ordersWithResults[i];
      
      // Get the test name to generate appropriate result
      const test = await prisma.radiologyTest.findUnique({
        where: { id: order.radiologyTestId }
      });
      
      // Find matching result template or use generic
      const testKey = Object.keys(resultTemplates).find(key => 
        test.name.includes(key) || key.includes(test.name)
      );
      
      const possibleResults = testKey ? resultTemplates[testKey] : [
        'Normal study. No acute abnormalities identified.',
        'Mild degenerative changes noted. Clinical correlation recommended.',
        'Findings consistent with clinical presentation.',
        'Stable appearance compared to prior study.',
        'Recommend follow-up imaging in 6 months.'
      ];
      
      const result = getRandomElement(possibleResults);
      const resultedDate = getRandomDate(order.orderedAt, new Date(2025, 6, 18));
      
      const radiologyResult = await prisma.radiologyResult.create({
        data: {
          id: generateId('RAD-RESULT', i + 1),
          imagingOrderId: order.id,
          result: result,
          resultedAt: resultedDate,
          createdAt: resultedDate,
          updatedAt: resultedDate
        }
      });
      createdResults.push(radiologyResult);
    }
    
    console.log(`Created ${createdResults.length} radiology results`);
    
    // 4. Seed Scan Images (multiple images per result)
    console.log('Seeding scan images...');
    let totalImages = 0;
    
    for (let i = 0; i < createdResults.length; i++) {
      const result = createdResults[i];
      
      // Each result gets 1-5 images
      const numImages = Math.floor(Math.random() * 5) + 1;
      
      for (let j = 0; j < numImages; j++) {
        const imageUrl = getRandomElement(sampleImageUrls);
        
        await prisma.scanImage.create({
          data: {
            id: generateId('SCAN-IMG', totalImages + 1),
            radiologyResultId: result.id,
            imageUrl: imageUrl,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt
          }
        });
        totalImages++;
      }
    }
    
    console.log(`Created ${totalImages} scan images`);
    
    // Print summary
    console.log('\n=== SEEDING SUMMARY ===');
    console.log(`✓ Radiology Tests: ${createdTests.length}`);
    console.log(`✓ Imaging Orders: ${createdOrders.length}`);
    console.log(`✓ Radiology Results: ${createdResults.length}`);
    console.log(`✓ Scan Images: ${totalImages}`);
    console.log('✓ Radiology data seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding radiology data:', error);
    throw error;
  }
}

// Additional utility functions for testing and verification
async function getRadiologyStats() {
  const testCount = await prisma.radiologyTest.count();
  const orderCount = await prisma.imagingOrder.count();
  const resultCount = await prisma.radiologyResult.count();
  const imageCount = await prisma.scanImage.count();
  
  console.log('\n=== RADIOLOGY DATABASE STATS ===');
  console.log(`Radiology Tests: ${testCount}`);
  console.log(`Imaging Orders: ${orderCount}`);
  console.log(`Radiology Results: ${resultCount}`);
  console.log(`Scan Images: ${imageCount}`);
  
  // Get some sample data
  const sampleResults = await prisma.radiologyResult.findMany({
    take: 5,
    include: {
      imagingOrder: {
        include: {
          patient: true,
          radiologyTest: true
        }
      },
      scanImages: true
    }
  });
  
  console.log('\n=== SAMPLE RESULTS ===');
  sampleResults.forEach((result, index) => {
    console.log(`${index + 1}. Patient: ${result.imagingOrder.patient.firstName} ${result.imagingOrder.patient.lastName}`);
    console.log(`   Test: ${result.imagingOrder.radiologyTest.name}`);
    console.log(`   Result: ${result.result.substring(0, 100)}...`);
    console.log(`   Images: ${result.scanImages.length}`);
    console.log('');
  });
}

async function cleanupRadiologyData() {
  console.log('Cleaning up radiology data...');
  
  await prisma.scanImage.deleteMany({});
  await prisma.radiologyResult.deleteMany({});
  await prisma.imagingOrder.deleteMany({});
  await prisma.radiologyTest.deleteMany({});
  
  console.log('Radiology data cleanup completed!');
}

// Main execution
async function main() {
  try {
    await seedRadiologyData();
    await getRadiologyStats();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Export functions for modular use
module.exports = {
  seedRadiologyData,
  getRadiologyStats,
  cleanupRadiologyData,
  main
};

// Run if called directly
if (require.main === module) {
  main();
}