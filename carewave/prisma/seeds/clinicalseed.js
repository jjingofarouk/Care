// File: seed.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Reduced medical data for realistic notes
const clinicalNoteTemplates = [
  "Patient presents with hypertension. BP: 145/90. Prescribed lisinopril 10mg daily.",
  "Follow-up for diabetes. HbA1c: 7.2%. Metformin dose adjusted.",
  "Routine checkup. Vitals stable. Next appointment in 6 months.",
  "Chest pain reported. ECG normal. Referred for stress test.",
  "Asthma exacerbation. Prescribed albuterol inhaler.",
  "Annual exam. All systems normal. Vaccinations updated.",
  "Knee pain assessed. X-ray shows arthritis. Prescribed NSAIDs.",
  "Skin lesion examined. Benign. Dermatology follow-up.",
  "Headache evaluated. Tension-type. Lifestyle changes advised.",
  "URI diagnosed. Prescribed amoxicillin, rest advised."
];

const progressNoteTemplates = [
  "Good response to treatment. Pain reduced from 8/10 to 4/10.",
  "Wound healing well. Sutures to be removed next visit.",
  "BP medications effective. Target BP achieved.",
  "Physical therapy shows progress. Motion improved.",
  "Medication compliance excellent. No side effects.",
  "Symptoms resolved. Cleared for normal activities.",
  "Chronic condition stable. Continue management.",
  "Patient educated on diet and exercise.",
  "Lab results normal. All values within limits.",
  "Mental health improved with therapy."
];

const soapSubjectives = [
  "Persistent cough for 3 days, yellow sputum.",
  "Severe headache, throbbing, 2 hours duration.",
  "Fatigue and weakness for 1 week, low appetite.",
  "Sharp chest pain, worse with breathing.",
  "Numbness in hands, worse at night.",
  "Dizziness on standing, no falls.",
  "Nausea and vomiting post-meals, 2 days.",
  "Difficulty sleeping due to anxiety.",
  "Joint pain, stiffness in morning.",
  "Shortness of breath with exertion."
];

const soapObjectives = [
  "Temp: 38.5°C, HR: 92, BP: 130/85, RR: 20",
  "Alert, mild diaphoresis, pupils reactive",
  "Lungs clear, heart rate regular, no murmurs",
  "Abdomen soft, non-tender, normal bowel sounds",
  "No edema, pulses palpable, refill <2sec",
  "Neurological exam normal, reflexes 2+",
  "Skin warm, dry, no rashes observed",
  "Oral mucosa pink, throat erythematous",
  "Weight: 75kg, BMI: 24.8, well-nourished",
  "Gait steady, balance intact, no deficits"
];

const soapAssessments = [
  "Acute viral bronchitis",
  "Migraine headache, moderate",
  "Viral syndrome with fatigue",
  "Possible pleuritis, rule out pneumonia",
  "Carpal tunnel syndrome",
  "Orthostatic hypotension",
  "Acute gastroenteritis",
  "Anxiety disorder, acute",
  "Rheumatoid arthritis, active",
  "Exercise intolerance, cardiac evaluation"
];

const soapPlans = [
  "Supportive care, fluids, return if worse",
  "Sumatriptan 50mg PRN, follow-up 1 week",
  "Rest, nutrition, return if no improvement",
  "Chest X-ray, ibuprofen, follow-up 48 hours",
  "Wrist splints, neurology referral",
  "Increase salt intake, cardiology consult",
  "Clear liquids, ondansetron PRN",
  "Lorazepam 0.5mg PRN, therapy referral",
  "Methotrexate 15mg weekly, rheumatology",
  "Echocardiogram, reduce activity"
];

const taskDescriptions = [
  "Schedule follow-up in 2 weeks",
  "Order chest X-ray for evaluation",
  "Call patient with lab results",
  "Prepare discharge instructions",
  "Coordinate specialist referral",
  "Update medication list",
  "Complete insurance forms",
  "Schedule routine screening tests",
  "Follow up on lab results",
  "Prepare education materials"
];

const taskStatuses = ["pending", "in_progress", "completed", "cancelled"];
const assignedToTypes = ["doctor", "nurse", "admin", "technician"];

// Helper function to get random item from array
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to get random date within last 2 years
function getRandomDate() {
  const now = new Date();
  const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
  return new Date(twoYearsAgo.getTime() + Math.random() * (now.getTime() - twoYearsAgo.getTime()));
}

// Helper function to get existing patient IDs
async function getExistingPatientIds() {
  const patients = await prisma.patient.findMany({
    select: { id: true }
  });
  return patients.map(p => p.id);
}

// Helper function to get existing doctor IDs
async function getExistingDoctorIds() {
  const doctors = await prisma.doctor.findMany({
    select: { id: true }
  });
  return doctors.map(d => d.id);
}

async function seedClinicalNotes(patientIds, doctorIds) {
  console.log('Seeding Clinical Notes...');
  const notes = [];
  
  for (let i = 1; i <= 1500; i++) {
    const createdAt = getRandomDate();
    notes.push({
      patientId: getRandomItem(patientIds),
      doctorId: getRandomItem(doctorIds),
      note: getRandomItem(clinicalNoteTemplates),
      createdAt: createdAt,
      updatedAt: createdAt
    });
  }
  
  const batchSize = 500;
  for (let i = 0; i < notes.length; i += batchSize) {
    const batch = notes.slice(i, i + batchSize);
    await prisma.clinicalNote.createMany({ data: batch });
  }
  
  console.log(`Created ${notes.length} clinical notes`);
}

async function seedProgressNotes(patientIds, doctorIds) {
  console.log('Seeding Progress Notes...');
  const notes = [];
  
  for (let i = 1; i <= 1200; i++) {
    const createdAt = getRandomDate();
    notes.push({
      patientId: getRandomItem(patientIds),
      doctorId: getRandomItem(doctorIds),
      note: getRandomItem(progressNoteTemplates),
      createdAt: createdAt,
      updatedAt: createdAt
    });
  }
  
  const batchSize = 500;
  for (let i = 0; i < notes.length; i += batchSize) {
    const batch = notes.slice(i, i + batchSize);
    await prisma.progressNote.createMany({ data: batch });
  }
  
  console.log(`Created ${notes.length} progress notes`);
}

async function seedSOAPNotes(patientIds, doctorIds) {
  console.log('Seeding SOAP Notes...');
  const notes = [];
  
  for (let i = 1; i <= 800; i++) {
    const createdAt = getRandomDate();
    notes.push({
      patientId: getRandomItem(patientIds),
      doctorId: getRandomItem(doctorIds),
      subjective: getRandomItem(soapSubjectives),
      objective: getRandomItem(soapObjectives),
      assessment: getRandomItem(soapAssessments),
      plan: getRandomItem(soapPlans),
      createdAt: createdAt,
      updatedAt: createdAt
    });
  }
  
  const batchSize = 500;
  for (let i = 0; i < notes.length; i += batchSize) {
    const batch = notes.slice(i, i + batchSize);
    await prisma.sOAPNote.createMany({ data: batch });
  }
  
  console.log(`Created ${notes.length} SOAP notes`);
}

async function seedClinicalTasks(patientIds, doctorIds) {
  console.log('Seeding Clinical Tasks...');
  const tasks = [];
  
  // Create a combined pool of staff IDs (doctors + other staff)
  // For simplicity, we'll use doctor IDs as potential assignees
  // In a real scenario, you might want to create or fetch actual staff IDs
  const staffIds = [...doctorIds]; // You can expand this with actual staff IDs
  
  for (let i = 1; i <= 2000; i++) {
    const createdAt = getRandomDate();
    tasks.push({
      patientId: getRandomItem(patientIds),
      assignedToId: getRandomItem(staffIds),
      assignedToType: getRandomItem(assignedToTypes),
      description: getRandomItem(taskDescriptions),
      status: getRandomItem(taskStatuses),
      createdAt: createdAt,
      updatedAt: createdAt
    });
  }
  
  const batchSize = 500;
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    await prisma.clinicalTask.createMany({ data: batch });
  }
  
  console.log(`Created ${tasks.length} clinical tasks`);
}

async function main() {
  try {
    console.log('Starting medical notes seeding...');
    
    // First, get existing patient and doctor IDs
    const patientIds = await getExistingPatientIds();
    const doctorIds = await getExistingDoctorIds();
    
    // Validate that we have patients and doctors
    if (patientIds.length === 0) {
      throw new Error('No patients found in database. Please seed patients first.');
    }
    
    if (doctorIds.length === 0) {
      throw new Error('No doctors found in database. Please seed doctors first.');
    }
    
    console.log(`Found ${patientIds.length} patients and ${doctorIds.length} doctors`);
    
    // Clear existing data
    await prisma.clinicalTask.deleteMany();
    await prisma.sOAPNote.deleteMany();
    await prisma.progressNote.deleteMany();
    await prisma.clinicalNote.deleteMany();
    
    // Seed all tables
    await seedClinicalNotes(patientIds, doctorIds);    // 1,500 records
    await seedProgressNotes(patientIds, doctorIds);   // 1,200 records
    await seedSOAPNotes(patientIds, doctorIds);       // 800 records
    await seedClinicalTasks(patientIds, doctorIds);   // 2,000 records
    
    console.log('✅ Medical notes seeding completed successfully!');
    console.log('Total records created: 5,500');
    console.log('Estimated database size: ~550KB');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});