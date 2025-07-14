const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { v4: uuidv4 } = require('uuid');

// Sample drug data (expanded to 100 drugs)
const drugs = [
  { name: 'Paracetamol', description: 'Pain reliever and fever reducer' },
  { name: 'Ibuprofen', description: 'Nonsteroidal anti-inflammatory drug' },
  { name: 'Amoxicillin', description: 'Antibiotic for bacterial infections' },
  { name: 'Lisinopril', description: 'ACE inhibitor for hypertension' },
  { name: 'Metformin', description: 'Oral diabetes medicine' },
  { name: 'Atorvastatin', description: 'Statin for cholesterol management' },
  { name: 'Omeprazole', description: 'Proton pump inhibitor for acid reflux' },
  { name: 'Losartan', description: 'Angiotensin receptor blocker for hypertension' },
  { name: 'Amlodipine', description: 'Calcium channel blocker for blood pressure' },
  { name: 'Levothyroxine', description: 'Thyroid hormone replacement' },
  { name: 'Sertraline', description: 'SSRI for depression and anxiety' },
  { name: 'Citalopram', description: 'SSRI for depression' },
  { name: 'Metoprolol', description: 'Beta blocker for heart conditions' },
  { name: 'Hydrochlorothiazide', description: 'Diuretic for hypertension' },
  { name: 'Gabapentin', description: 'Anticonvulsant for nerve pain' },
  { name: 'Fluoxetine', description: 'SSRI for depression and OCD' },
  { name: 'Tramadol', description: 'Opioid analgesic for moderate pain' },
  { name: 'Prednisone', description: 'Corticosteroid for inflammation' },
  { name: 'Azithromycin', description: 'Antibiotic for bacterial infections' },
  { name: 'Albuterol', description: 'Bronchodilator for asthma' },
  { name: 'Simvastatin', description: 'Statin for cholesterol' },
  { name: 'Rosuvastatin', description: 'Statin for cholesterol management' },
  { name: 'Clonazepam', description: 'Benzodiazepine for seizures and anxiety' },
  { name: 'Lorazepam', description: 'Benzodiazepine for anxiety' },
  { name: 'Diazepam', description: 'Benzodiazepine for anxiety and spasms' },
  { name: 'Zolpidem', description: 'Sedative for insomnia' },
  { name: 'Escitalopram', description: 'SSRI for depression and anxiety' },
  { name: 'Cephalexin', description: 'Antibiotic for bacterial infections' },
  { name: 'Furosemide', description: 'Diuretic for edema and hypertension' },
  { name: 'Warfarin', description: 'Anticoagulant for blood clot prevention' },
  { name: 'Pantoprazole', description: 'Proton pump inhibitor for GERD' },
  { name: 'Bupropion', description: 'Antidepressant and smoking cessation aid' },
  { name: 'Trazodone', description: 'Antidepressant for insomnia' },
  { name: 'Venlafaxine', description: 'SNRI for depression and anxiety' },
  { name: 'Duloxetine', description: 'SNRI for depression and pain' },
  { name: 'Clopidogrel', description: 'Antiplatelet for heart attack prevention' },
  { name: 'Montelukast', description: 'Leukotriene inhibitor for asthma' },
  { name: 'Ranitidine', description: 'H2 blocker for acid reflux' },
  { name: 'Meloxicam', description: 'NSAID for arthritis' },
  { name: 'Naproxen', description: 'NSAID for pain and inflammation' },
  { name: 'Allopurinol', description: 'Xanthine oxidase inhibitor for gout' },
  { name: 'Carvedilol', description: 'Beta blocker for heart failure' },
  { name: 'Aspirin', description: 'Antiplatelet for pain and heart health' },
  { name: 'Tamsulosin', description: 'Alpha blocker for prostate issues' },
  { name: 'Hydroxyzine', description: 'Antihistamine for allergies and anxiety' },
  { name: 'Cetirizine', description: 'Antihistamine for allergies' },
  { name: 'Loratadine', description: 'Antihistamine for allergies' },
  { name: 'Fluticasone', description: 'Corticosteroid for allergies and asthma' },
  { name: 'Budesonide', description: 'Corticosteroid for asthma and COPD' },
  { name: 'Mirtazapine', description: 'Antidepressant for depression' },
  { name: 'Cyclobenzaprine', description: 'Muscle relaxant for spasms' },
  { name: 'Methotrexate', description: 'Immunosuppressant for arthritis and cancer' },
  { name: 'Sildenafil', description: 'PDE5 inhibitor for erectile dysfunction' },
  { name: 'Tadalafil', description: 'PDE5 inhibitor for erectile dysfunction' },
  { name: 'Finasteride', description: '5-alpha reductase inhibitor for prostate' },
  { name: 'Propranolol', description: 'Beta blocker for anxiety and hypertension' },
  { name: 'Atenolol', description: 'Beta blocker for hypertension' },
  { name: 'Bisoprolol', description: 'Beta blocker for heart conditions' },
  { name: 'Spironolactone', description: 'Diuretic for heart failure and edema' },
  { name: 'Digoxin', description: 'Cardiac glycoside for heart failure' },
  { name: 'Enalapril', description: 'ACE inhibitor for hypertension' },
  { name: 'Ramipril', description: 'ACE inhibitor for hypertension' },
  { name: ' Valsartan', description: 'Angiotensin receptor blocker for hypertension' },
  { name: 'Glimepiride', description: 'Sulfonylurea for diabetes' },
  { name: 'Sitagliptin', description: 'DPP-4 inhibitor for diabetes' },
  { name: 'Insulin Glargine', description: 'Long-acting insulin for diabetes' },
  { name: 'Insulin Aspart', description: 'Rapid-acting insulin for diabetes' },
  { name: 'Levofloxacin', description: 'Antibiotic for bacterial infections' },
  { name: 'Ciprofloxacin', description: 'Antibiotic for bacterial infections' },
  { name: 'Doxycycline', description: 'Antibiotic for bacterial infections' },
  { name: 'Clarithromycin', description: 'Antibiotic for bacterial infections' },
  { name: 'Metronidazole', description: 'Antibiotic for anaerobic infections' },
  { name: 'Acyclovir', description: 'Antiviral for herpes infections' },
  { name: 'Valacyclovir', description: 'Antiviral for herpes infections' },
  { name: 'Fluconazole', description: 'Antifungal for yeast infections' },
  { name: 'Ketoconazole', description: 'Antifungal for fungal infections' },
  { name: 'Ondansetron', description: 'Anti-emetic for nausea' },
  { name: 'Promethazine', description: 'Antihistamine for nausea and allergies' },
  { name: 'Meclizine', description: 'Antihistamine for motion sickness' },
  { name: 'Alprazolam', description: 'Benzodiazepine for anxiety' },
  { name: 'Buspirone', description: 'Anxiolytic for anxiety' },
  { name: 'Pregabalin', description: 'Anticonvulsant for nerve pain' },
  { name: 'Topiramate', description: 'Anticonvulsant for seizures and migraines' },
  { name: 'Lamotrigine', description: 'Anticonvulsant for seizures' },
  { name: 'Levetiracetam', description: 'Anticonvulsant for seizures' },
  { name: 'Oxcarbazepine', description: 'Anticonvulsant for seizures' },
  { name: 'Sumatriptan', description: 'Triptan for migraines' },
  { name: 'Rizatriptan', description: 'Triptan for migraines' },
  { name: 'Ezetimibe', description: 'Cholesterol absorption inhibitor' },
  { name: 'Fenofibrate', description: 'Fibrate for cholesterol' },
  { name: 'Pravastatin', description: 'Statin for cholesterol' },
  { name: 'Gemfibrozil', description: 'Fibrate for triglycerides' },
  { name: 'Nifedipine', description: 'Calcium channel blocker for hypertension' },
  { name: 'Diltiazem', description: 'Calcium channel blocker for hypertension' },
  { name: 'Verapamil', description: 'Calcium channel blocker for heart conditions' },
  { name: 'Glyburide', description: 'Sulfonylurea for diabetes' },
  { name: 'Pioglitazone', description: 'Thiazolidinedione for diabetes' },
  { name: 'Liraglutide', description: 'GLP-1 agonist for diabetes' },
  { name: 'Empagliflozin', description: 'SGLT2 inhibitor for diabetes' },
];

// Function to generate random date within a range
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Function to generate batch number
function generateBatchNumber() {
  return `BATCH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

// Main seeding function
async function seed() {
  try {
    // Fetch existing doctor and patient IDs
    const doctors = await prisma.doctor.findMany({ select: { id: true } });
    const patients = await prisma.patient.findMany({ select: { id: true } });
    const doctorIds = doctors.map(d => d.id);
    const patientIds = patients.map(p => p.id);

    if (doctorIds.length === 0 || patientIds.length === 0) {
      throw new Error('No doctors or patients found in the database.');
    }

    // Step 1: Seed Drugs
    const createdDrugs = await prisma.drug.createMany({
      data: drugs.map(drug => ({
        id: uuidv4(),
        name: drug.name,
        description: drug.description,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      skipDuplicates: true,
    });
    console.log(`Seeded ${createdDrugs.count} drugs`);

    // Fetch created drugs to get their IDs
    const drugRecords = await prisma.drug.findMany({ select: { id: true } });
    const drugIds = drugRecords.map(d => d.id);

    // Step 2: Seed Pharmacy Items
    const pharmacyItems = [];
    for (let i = 0; i < 200; i++) {
      pharmacyItems.push({
        id: uuidv4(),
        drugId: drugIds[Math.floor(Math.random() * drugIds.length)],
        batchNumber: generateBatchNumber(),
        expiryDate: randomDate(new Date(2025, 0, 1), new Date(2027, 11, 31)),
        quantity: Math.floor(Math.random() * 500) + 50, // Random quantity between 50 and 549
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    const createdPharmacyItems = await prisma.pharmacyItem.createMany({
      data: pharmacyItems,
    });
    console.log(`Seeded ${createdPharmacyItems.count} pharmacy items`);

    // Fetch created pharmacy items to get their IDs
    const pharmacyItemRecords = await prisma.pharmacyItem.findMany({ select: { id: true } });
    const pharmacyItemIds = pharmacyItemRecords.map(pi => pi.id);

    // Step 3: Seed Prescriptions
    const prescriptions = [];
    const dosages = [
      '500mg twice daily', 
      '200mg once daily', 
      '1 tablet daily', 
      '250mg every 6 hours',
      '10mg at bedtime',
      '20mg daily',
      '100mg every 12 hours',
      '1-2 tablets every 4-6 hours as needed',
    ];
    for (let i = 0; i < 1000; i++) {
      prescriptions.push({
        id: uuidv4(),
        patientId: patientIds[Math.floor(Math.random() * patientIds.length)],
        doctorId: doctorIds[Math.floor(Math.random() * doctorIds.length)],
        drugId: drugIds[Math.floor(Math.random() * drugIds.length)],
        dosage: dosages[Math.floor(Math.random() * dosages.length)],
        prescribedAt: randomDate(new Date(2024, 0, 1), new Date(2025, 6, 15)),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    const createdPrescriptions = await prisma.prescription.createMany({
      data: prescriptions,
    });
    console.log(`Seeded ${createdPrescriptions.count} prescriptions`);

    // Step 4: Seed Dispense Records
    const dispenseRecords = [];
    for (let i = 0; i < 1000; i++) {
      dispenseRecords.push({
        id: uuidv4(),
        pharmacyItemId: pharmacyItemIds[Math.floor(Math.random() * pharmacyItemIds.length)],
        patientId: patientIds[Math.floor(Math.random() * patientIds.length)],
        dispensedAt: randomDate(new Date(2024, 0, 1), new Date(2025, 6, 15)),
        quantity: Math.floor(Math.random() * 50) + 1, // Random quantity between 1 and 50
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    const createdDispenseRecords = await prisma.dispenseRecord.createMany({
      data: dispenseRecords,
    });
    console.log(`Seeded ${createdDispenseRecords.count} dispense records`);

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seed();