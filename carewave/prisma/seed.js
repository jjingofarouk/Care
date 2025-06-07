const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Clear all existing data in reverse order of dependencies
  console.log('Clearing existing data...');
  await clearDatabase();

  // Seed data
  console.log('Seeding new data...');
  await seedDepartments();
  await seedUsers();
  await seedDoctors();
  await seedPatients();
  await seedWards();
  await seedFormularies();
  await seedSuppliers();
  await seedMedications();
  await seedDrugInteractions();
  await seedDoctorAvailability();
  await seedAppointments();
  await seedQueues();
  await seedAdmissions();
  await seedDischarges();
  await seedCSSDInstruments();
  await seedCSSDRecords();
  await seedCSSDRequisitions();
  await seedCSSDLogs();
  await seedPrescriptions();
  await seedPrescriptionItems();
  await seedDispensingRecords();
  await seedStockAdjustments();
  await seedInvoices();
  await seedRefunds();
  await seedCostCenters();
  await seedTransactions();
  await seedPayrolls();
  await seedPurchaseOrders();
  await seedPurchaseOrderItems();
  await seedFixedAssets();
  await seedMedicalRecords();

  console.log('Database seeding completed successfully!');
}

async function clearDatabase() {
  // Get list of all tables in SQLite database
  const tables = await prisma.$queryRaw`
    SELECT name FROM sqlite_schema 
    WHERE type = 'table' 
    AND name NOT LIKE 'sqlite_%'
    AND name NOT LIKE '_prisma_%'
  `;

  // Disable foreign key constraints temporarily
  await prisma.$executeRaw`PRAGMA foreign_keys = OFF`;

  // Delete all data from each table
  for (const { name } of tables) {
    try {
      await prisma.$executeRawUnsafe(`DELETE FROM "${name}";`);
      // For SQLite, you might also want to reset autoincrement counters
      await prisma.$executeRawUnsafe(`DELETE FROM sqlite_sequence WHERE name = '${name}';`);
    } catch (error) {
      console.log(`Error clearing table ${name}:`, error);
    }
  }

  // Re-enable foreign key constraints
  await prisma.$executeRaw`PRAGMA foreign_keys = ON`;
}


async function seedDepartments() {
  await prisma.department.createMany({
    data: [
      {
        name: 'Internal Medicine',
        description: 'General internal medicine department'
      },
      {
        name: 'Pediatrics',
        description: 'Child healthcare department'
      },
      {
        name: 'Surgery',
        description: 'General and specialized surgery'
      },
      {
        name: 'Obstetrics & Gynecology',
        description: 'Women health and childbirth'
      },
      {
        name: 'Emergency',
        description: 'Emergency medical services'
      }
    ]
  });
  console.log('Seeded 5 departments');
}

async function seedUsers() {
  await prisma.user.createMany({
    data: [
      {
        email: 'admin@mulago.go.ug',
        name: 'Admin User',
        password: '$2b$10$E3eGklbB3q5J2h1KQZ5rE.9vQeD0cZ1XbLd7sYf6gHj3kLmN4oPqS', // hashed 'password'
        role: 'ADMIN'
      },
      {
        email: 'doctor1@mulago.go.ug',
        name: 'Dr. James Kato',
        password: '$2b$10$E3eGklbB3q5J2h1KQZ5rE.9vQeD0cZ1XbLd7sYf6gHj3kLmN4oPqS',
        role: 'DOCTOR'
      },
      {
        email: 'doctor2@mulago.go.ug',
        name: 'Dr. Sarah Nalwoga',
        password: '$2b$10$E3eGklbB3q5J2h1KQZ5rE.9vQeD0cZ1XbLd7sYf6gHj3kLmN4oPqS',
        role: 'DOCTOR'
      },
      {
        email: 'nurse@mulago.go.ug',
        name: 'Nurse Prossy Namutebi',
        password: '$2b$10$E3eGklbB3q5J2h1KQZ5rE.9vQeD0cZ1XbLd7sYf6gHj3kLmN4oPqS',
        role: 'NURSE'
      },
      {
        email: 'pharmacist@mulago.go.ug',
        name: 'Pharmacist David Ssemwanga',
        password: '$2b$10$E3eGklbB3q5J2h1KQZ5rE.9vQeD0cZ1XbLd7sYf6gHj3kLmN4oPqS',
        role: 'PHARMACIST'
      }
    ]
  });
  console.log('Seeded 5 users');
}

async function seedDoctors() {
  const departments = await prisma.department.findMany();
  
  const doctorsData = [
    {
      doctorId: 'DOC001',
      name: 'Dr. James Kato',
      email: 'j.kato@mulago.go.ug',
      specialty: 'Cardiology',
      licenseNumber: 'UMDPC001',
      phone: '+256772123456',
      office: 'Block A, Room 101',
      departmentId: departments.find(d => d.name === 'Internal Medicine')?.id
    },
    {
      doctorId: 'DOC002',
      name: 'Dr. Sarah Nalwoga',
      email: 's.nalwoga@mulago.go.ug',
      specialty: 'Pediatrics',
      licenseNumber: 'UMDPC002',
      phone: '+256772654321',
      office: 'Block B, Room 205',
      departmentId: departments.find(d => d.name === 'Pediatrics')?.id
    },
    {
      doctorId: 'DOC003',
      name: 'Dr. Robert Kibuuka',
      email: 'r.kibuuka@mulago.go.ug',
      specialty: 'General Surgery',
      licenseNumber: 'UMDPC003',
      phone: '+256752987654',
      office: 'Block C, Room 310',
      departmentId: departments.find(d => d.name === 'Surgery')?.id
    },
    {
      doctorId: 'DOC004',
      name: 'Dr. Grace Nakimera',
      email: 'g.nakimera@mulago.go.ug',
      specialty: 'Obstetrics',
      licenseNumber: 'UMDPC004',
      phone: '+256712345678',
      office: 'Maternity Wing, Room 12',
      departmentId: departments.find(d => d.name === 'Obstetrics & Gynecology')?.id
    },
    {
      doctorId: 'DOC005',
      name: 'Dr. David Ssemwanga',
      email: 'd.ssemwanga@mulago.go.ug',
      specialty: 'Emergency Medicine',
      licenseNumber: 'UMDPC005',
      phone: '+256782876543',
      office: 'Emergency Block, Room 5',
      departmentId: departments.find(d => d.name === 'Emergency')?.id
    }
  ];

  // Upsert doctors to prevent duplicates
  await Promise.all(
    doctorsData.map(doctor =>
      prisma.doctor.upsert({
        where: { doctorId: doctor.doctorId },
        update: {},
        create: doctor
      })
    )
  );

  console.log('Successfully seeded 5 doctors');
}

async function seedPatients() {
  await prisma.patient.createMany({
    data: [
      {
        patientId: 'PAT001',
        name: 'John Mugisha',
        email: 'john.mugisha@example.com',
        dateOfBirth: new Date('1985-05-15'),
        gender: 'Male',
        phone: '+256752111222',
        address: 'Plot 12, Kampala Road, Kampala',
        emergencyContact: 'Mary Mugisha',
        emergencyContactPhone: '+256752111223',
        insuranceProvider: 'National Health Insurance',
        insurancePolicy: 'NHIS-001-2023',
        bloodType: 'O+',
        allergies: 'Penicillin',
        medicalHistory: 'Hypertension, Type 2 Diabetes',
        presentingComplaint: 'Chest pain and shortness of breath',
        familyHistory: 'Father had heart disease',
        socialHistory: 'Non-smoker, occasional alcohol',
        pastMedicalHistory: 'Appendectomy 2005',
        medications: 'Metformin, Lisinopril'
      },
      {
        patientId: 'PAT002',
        name: 'Sarah Nakato',
        email: 'sarah.nakato@example.com',
        dateOfBirth: new Date('1992-08-22'),
        gender: 'Female',
        phone: '+256782333444',
        address: 'Ntinda, Kampala',
        emergencyContact: 'David Nakato',
        emergencyContactPhone: '+256782333445',
        insuranceProvider: 'AAR Health Insurance',
        insurancePolicy: 'AAR-045-2023',
        bloodType: 'A-',
        allergies: 'None',
        medicalHistory: 'Asthma',
        presentingComplaint: 'Persistent cough and wheezing',
        familyHistory: 'Mother has asthma',
        socialHistory: 'Student, non-smoker',
        pastMedicalHistory: 'Tonsillectomy 2010',
        medications: 'Salbutamol inhaler'
      },
      {
        patientId: 'PAT003',
        name: 'Robert Kibuuka',
        email: 'robert.kibuuka@example.com',
        dateOfBirth: new Date('1978-11-30'),
        gender: 'Male',
        phone: '+256712555666',
        address: 'Entebbe Road, Kampala',
        emergencyContact: 'Grace Kibuuka',
        emergencyContactPhone: '+256712555667',
        insuranceProvider: 'Jubilee Health Insurance',
        insurancePolicy: 'JHI-789-2023',
        bloodType: 'B+',
        allergies: 'Sulfa drugs',
        medicalHistory: 'Peptic ulcer disease',
        presentingComplaint: 'Abdominal pain and vomiting',
        familyHistory: 'Father had gastric cancer',
        socialHistory: 'Businessman, social drinker',
        pastMedicalHistory: 'Gallbladder removal 2018',
        medications: 'Omeprazole'
      },
      {
        patientId: 'PAT004',
        name: 'Esther Namukasa',
        email: 'esther.namukasa@example.com',
        dateOfBirth: new Date('2005-03-10'),
        gender: 'Female',
        phone: '+256762777888',
        address: 'Mukono',
        emergencyContact: 'Peter Namukasa',
        emergencyContactPhone: '+256762777889',
        insuranceProvider: 'National Health Insurance',
        insurancePolicy: 'NHIS-002-2023',
        bloodType: 'AB+',
        allergies: 'Peanuts',
        medicalHistory: 'None',
        presentingComplaint: 'Fever and rash',
        familyHistory: 'No significant family history',
        socialHistory: 'Secondary school student',
        pastMedicalHistory: 'Chickenpox 2010',
        medications: 'None'
      },
      {
        patientId: 'PAT005',
        name: 'David Ssempijja',
        email: 'david.ssempijja@example.com',
        dateOfBirth: new Date('1960-07-25'),
        gender: 'Male',
        phone: '+256782999000',
        address: 'Masaka',
        emergencyContact: 'Rebecca Ssempijja',
        emergencyContactPhone: '+256782999001',
        insuranceProvider: 'None',
        insurancePolicy: 'None',
        bloodType: 'A+',
        allergies: 'None',
        medicalHistory: 'Hypertension, Arthritis',
        presentingComplaint: 'Joint pain and swelling',
        familyHistory: 'Mother had rheumatoid arthritis',
        socialHistory: 'Retired teacher',
        pastMedicalHistory: 'Hernia repair 2015',
        medications: 'Hydrochlorothiazide, Ibuprofen'
      }
    ]
  });
  console.log('Seeded 5 patients');
}

async function seedWards() {
  await prisma.ward.createMany({
    data: [
      {
        name: 'Medical Ward',
        wardNumber: 'WARD-001',
        totalBeds: 30,
        occupiedBeds: 15,
        department: 'Internal Medicine',
        location: 'Block A, 2nd Floor',
        nurseInCharge: 'Sr. Juliet Nalubega'
      },
      {
        name: 'Pediatric Ward',
        wardNumber: 'WARD-002',
        totalBeds: 25,
        occupiedBeds: 18,
        department: 'Pediatrics',
        location: 'Block B, 1st Floor',
        nurseInCharge: 'Sr. Prossy Namutebi'
      },
      {
        name: 'Surgical Ward',
        wardNumber: 'WARD-003',
        totalBeds: 20,
        occupiedBeds: 12,
        department: 'Surgery',
        location: 'Block C, 3rd Floor',
        nurseInCharge: 'Sr. Grace Nakimera'
      },
      {
        name: 'Maternity Ward',
        wardNumber: 'WARD-004',
        totalBeds: 35,
        occupiedBeds: 28,
        department: 'Obstetrics & Gynecology',
        location: 'Maternity Wing',
        nurseInCharge: 'Sr. Mary Nansubuga'
      },
      {
        name: 'Emergency Ward',
        wardNumber: 'WARD-005',
        totalBeds: 15,
        occupiedBeds: 10,
        department: 'Emergency',
        location: 'Emergency Block',
        nurseInCharge: 'Sr. Sarah Nalwadda'
      }
    ]
  });
  console.log('Seeded 5 wards');
}

async function seedFormularies() {
  await prisma.formulary.createMany({
    data: [
      {
        name: 'Essential Medicines List',
        description: 'WHO Essential Medicines List for Uganda'
      },
      {
        name: 'Antibiotics',
        description: 'Hospital antibiotic formulary'
      },
      {
        name: 'Cardiovascular',
        description: 'Cardiovascular medications'
      },
      {
        name: 'Pediatric',
        description: 'Medications for children'
      },
      {
        name: 'Emergency',
        description: 'Emergency medications'
      }
    ]
  });
  console.log('Seeded 5 formularies');
}

async function seedSuppliers() {
  await prisma.supplier.createMany({
    data: [
      {
        name: 'Quality Chemicals Ltd',
        contact: 'Mr. Robert Kato',
        email: 'sales@qualitychemicals.co.ug',
        address: 'Industrial Area, Kampala'
      },
      {
        name: 'Medipharm Uganda Ltd',
        contact: 'Ms. Sarah Nalubega',
        email: 'info@medipharm.co.ug',
        address: 'Ntinda, Kampala'
      },
      {
        name: 'Cipla Quality Chemicals',
        contact: 'Dr. David Ssemwanga',
        email: 'orders@cipla.co.ug',
        address: 'Luzira, Kampala'
      },
      {
        name: 'Joint Medical Stores',
        contact: 'Mr. Joseph Mugisha',
        email: 'jms@jms.co.ug',
        address: 'Namanve, Kampala'
      },
      {
        name: 'GlaxoSmithKline Uganda',
        contact: 'Ms. Grace Nakato',
        email: 'uganda@gsk.com',
        address: 'Kololo, Kampala'
      }
    ]
  });
  console.log('Seeded 5 suppliers');
}

async function seedMedications() {
  const formularies = await prisma.formulary.findMany();
  const suppliers = await prisma.supplier.findMany();

  await prisma.medication.createMany({
    data: [
      {
        name: 'Paracetamol 500mg',
        genericName: 'Acetaminophen',
        category: 'Analgesic',
        batchNumber: 'BATCH001',
        barcode: '123456789012',
        rfid: 'RFID001',
        stockQuantity: 1000,
        minStockThreshold: 200,
        price: 500,
        expiryDate: new Date('2025-12-31'),
        supplierId: suppliers[0].id,
        formularyId: formularies[0].id,
        narcotic: false
      },
      {
        name: 'Amoxicillin 500mg',
        genericName: 'Amoxicillin',
        category: 'Antibiotic',
        batchNumber: 'BATCH002',
        barcode: '234567890123',
        rfid: 'RFID002',
        stockQuantity: 500,
        minStockThreshold: 100,
        price: 3000,
        expiryDate: new Date('2024-10-31'),
        supplierId: suppliers[1].id,
        formularyId: formularies[1].id,
        narcotic: false
      },
      {
        name: 'Lisinopril 10mg',
        genericName: 'Lisinopril',
        category: 'Antihypertensive',
        batchNumber: 'BATCH003',
        barcode: '345678901234',
        rfid: 'RFID003',
        stockQuantity: 300,
        minStockThreshold: 50,
        price: 2000,
        expiryDate: new Date('2025-06-30'),
        supplierId: suppliers[2].id,
        formularyId: formularies[2].id,
        narcotic: false
      },
      {
        name: 'Salbutamol Inhaler',
        genericName: 'Salbutamol',
        category: 'Bronchodilator',
        batchNumber: 'BATCH004',
        barcode: '456789012345',
        rfid: 'RFID004',
        stockQuantity: 200,
        minStockThreshold: 30,
        price: 15000,
        expiryDate: new Date('2024-12-31'),
        supplierId: suppliers[3].id,
        formularyId: formularies[3].id,
        narcotic: false
      },
      {
        name: 'Morphine 10mg',
        genericName: 'Morphine',
        category: 'Opioid Analgesic',
        batchNumber: 'BATCH005',
        barcode: '567890123456',
        rfid: 'RFID005',
        stockQuantity: 50,
        minStockThreshold: 10,
        price: 5000,
        expiryDate: new Date('2024-08-31'),
        supplierId: suppliers[4].id,
        formularyId: formularies[4].id,
        narcotic: true
      }
    ]
  });
  console.log('Seeded 5 medications');
}

async function seedDrugInteractions() {
  const medications = await prisma.medication.findMany();

  await prisma.drugInteraction.createMany({
    data: [
      {
        medicationId1: medications[1].id, // Amoxicillin
        medicationId2: medications[0].id, // Paracetamol
        interaction: 'Increased risk of liver toxicity',
        severity: 'MODERATE'
      },
      {
        medicationId1: medications[2].id, // Lisinopril
        medicationId2: medications[4].id, // Morphine
        interaction: 'Increased risk of hypotension',
        severity: 'HIGH'
      },
      {
        medicationId1: medications[3].id, // Salbutamol
        medicationId2: medications[2].id, // Lisinopril
        interaction: 'Decreased antihypertensive effect',
        severity: 'MODERATE'
      },
      {
        medicationId1: medications[4].id, // Morphine
        medicationId2: medications[0].id, // Paracetamol
        interaction: 'Enhanced analgesic effect',
        severity: 'LOW'
      },
      {
        medicationId1: medications[1].id, // Amoxicillin
        medicationId2: medications[3].id, // Salbutamol
        interaction: 'No significant interaction',
        severity: 'LOW'
      }
    ]
  });
  console.log('Seeded 5 drug interactions');
}

async function seedDoctorAvailability() {
  const doctors = await prisma.doctor.findMany();

  await prisma.doctorAvailability.createMany({
    data: [
      {
        doctorId: doctors[0].id,
        startTime: new Date('2023-06-01T08:00:00'),
        endTime: new Date('2023-06-01T16:00:00'),
        status: 'AVAILABLE'
      },
      {
        doctorId: doctors[1].id,
        startTime: new Date('2023-06-01T09:00:00'),
        endTime: new Date('2023-06-01T17:00:00'),
        status: 'AVAILABLE'
      },
      {
        doctorId: doctors[2].id,
        startTime: new Date('2023-06-02T08:00:00'),
        endTime: new Date('2023-06-02T14:00:00'),
        status: 'AVAILABLE'
      },
      {
        doctorId: doctors[3].id,
        startTime: new Date('2023-06-02T10:00:00'),
        endTime: new Date('2023-06-02T18:00:00'),
        status: 'AVAILABLE'
      },
      {
        doctorId: doctors[4].id,
        startTime: new Date('2023-06-03T07:00:00'),
        endTime: new Date('2023-06-03T19:00:00'),
        status: 'UNAVAILABLE'
      }
    ]
  });
  console.log('Seeded 5 doctor availabilities');
}

async function seedAppointments() {
  const patients = await prisma.patient.findMany();
  const doctors = await prisma.doctor.findMany();
  const departments = await prisma.department.findMany();
  const users = await prisma.user.findMany();

  await prisma.appointment.createMany({
    data: [
      {
        patientId: patients[0].id,
        doctorId: doctors[0].id,
        departmentId: departments[0].id,
        bookedById: users[0].id,
        date: new Date('2023-06-05T09:00:00'),
        status: 'SCHEDULED',
        type: 'REGULAR',
        reason: 'Follow-up for hypertension',
        notes: 'Patient needs BP check'
      },
      {
        patientId: patients[1].id,
        doctorId: doctors[1].id,
        departmentId: departments[1].id,
        bookedById: users[1].id,
        date: new Date('2023-06-05T10:30:00'),
        status: 'CHECKED_IN',
        type: 'WALK_IN',
        reason: 'Persistent cough',
        notes: 'Possible asthma exacerbation',
        checkInTime: new Date('2023-06-05T10:15:00')
      },
      {
        patientId: patients[2].id,
        doctorId: doctors[2].id,
        departmentId: departments[2].id,
        bookedById: users[2].id,
        date: new Date('2023-06-06T11:00:00'),
        status: 'COMPLETED',
        type: 'REGULAR',
        reason: 'Abdominal pain',
        notes: 'Ulcer follow-up',
        checkInTime: new Date('2023-06-06T10:45:00'),
        checkOutTime: new Date('2023-06-06T11:30:00')
      },
      {
        patientId: patients[3].id,
        doctorId: doctors[3].id,
        departmentId: departments[3].id,
        bookedById: users[3].id,
        date: new Date('2023-06-07T14:00:00'),
        status: 'CANCELLED',
        type: 'REGULAR',
        reason: 'Annual checkup',
        notes: 'Patient called to cancel'
      },
      {
        patientId: patients[4].id,
        doctorId: doctors[4].id,
        departmentId: departments[4].id,
        bookedById: users[4].id,
        date: new Date('2023-06-08T08:00:00'),
        status: 'NO_SHOW',
        type: 'EMERGENCY',
        reason: 'Severe joint pain',
        notes: 'Patient did not arrive'
      }
    ]
  });
  console.log('Seeded 5 appointments');
}

async function seedQueues() {
  const appointments = await prisma.appointment.findMany();

  await prisma.queue.createMany({
    data: [
      {
        appointmentId: appointments[0].id,
        queueNumber: 1,
        status: 'WAITING'
      },
      {
        appointmentId: appointments[1].id,
        queueNumber: 2,
        status: 'IN_PROGRESS'
      },
      {
        appointmentId: appointments[2].id,
        queueNumber: 3,
        status: 'COMPLETED'
      },
      {
        appointmentId: appointments[3].id,
        queueNumber: 4,
        status: 'WAITING'
      },
      {
        appointmentId: appointments[4].id,
        queueNumber: 5,
        status: 'WAITING'
      }
    ]
  });
  console.log('Seeded 5 queue entries');
}

async function seedAdmissions() {
  const patients = await prisma.patient.findMany();
  const doctors = await prisma.doctor.findMany();
  const wards = await prisma.ward.findMany();

  await prisma.admission.createMany({
    data: [
      {
        patientId: patients[0].id,
        doctorId: doctors[0].id,
        wardId: wards[0].id,
        admissionDate: new Date('2023-05-28T14:30:00'),
        preAdmissionNotes: 'Hypertensive crisis',
        presentingComplaints: 'Severe headache, blurred vision',
        relayedInfo: 'BP 210/120 at clinic',
        triagePriority: 'HIGH',
        triageNotes: 'Immediate admission needed',
        status: 'ADMITTED'
      },
      {
        patientId: patients[1].id,
        doctorId: doctors[1].id,
        wardId: wards[1].id,
        admissionDate: new Date('2023-05-29T10:15:00'),
        preAdmissionNotes: 'Asthma exacerbation',
        presentingComplaints: 'Difficulty breathing, wheezing',
        relayedInfo: 'O2 sat 88% at triage',
        triagePriority: 'HIGH',
        triageNotes: 'Nebulizers started',
        status: 'ADMITTED'
      },
      {
        patientId: patients[2].id,
        doctorId: doctors[2].id,
        wardId: wards[2].id,
        admissionDate: new Date('2023-05-30T16:45:00'),
        preAdmissionNotes: 'Possible GI bleed',
        presentingComplaints: 'Black stools, dizziness',
        relayedInfo: 'Hb 7.2 at ER',
        triagePriority: 'URGENT',
        triageNotes: 'IV fluids started',
        status: 'ADMITTED'
      },
      {
        patientId: patients[3].id,
        wardId: wards[3].id,
        admissionDate: new Date('2023-06-01T08:30:00'),
        preAdmissionNotes: 'Scheduled admission',
        presentingComplaints: 'None',
        relayedInfo: 'For observation',
        triagePriority: 'LOW',
        triageNotes: 'Stable vitals',
        status: 'PENDING'
      },
      {
        patientId: patients[4].id,
        doctorId: doctors[4].id,
        wardId: wards[4].id,
        admissionDate: new Date('2023-05-27T22:15:00'),
        preAdmissionNotes: 'Severe joint pain',
        presentingComplaints: 'Unable to walk',
        relayedInfo: 'History of arthritis',
        triagePriority: 'MEDIUM',
        triageNotes: 'Pain management needed',
        status: 'DISCHARGED',
        dischargeDate: new Date('2023-05-30T11:00:00'),
        dischargeNotes: 'Improved with treatment'
      }
    ]
  });
  console.log('Seeded 5 admissions');
}

async function seedDischarges() {
  const patients = await prisma.patient.findMany();
  const doctors = await prisma.doctor.findMany();
  const admissions = await prisma.admission.findMany({
    where: { status: 'DISCHARGED' }
  });

  await prisma.discharge.createMany({
    data: [
      {
        patientId: patients[4].id,
        doctorId: doctors[4].id,
        dischargeDate: admissions[0].dischargeDate,
        dischargeNotes: 'Patient responded well to treatment',
        followUpInstructions: 'Follow up in 2 weeks',
        medications: 'Ibuprofen 400mg TID, Paracetamol PRN'
      }
    ]
  });
  console.log('Seeded 1 discharge (only 1 admission was discharged)');
}

async function seedCSSDInstruments() {
  await prisma.cSSDInstrument.createMany({
    data: [
      {
        name: 'Surgical Scissors',
        serialNumber: 'SCISS-001',
        type: 'Surgical Instrument',
        status: 'AVAILABLE',
        lastSterilized: new Date('2023-05-28T10:00:00'),
        location: 'CSSD Room 1',
        stockQuantity: 10,
        minStockThreshold: 2
      },
      {
        name: 'Hemostat Forceps',
        serialNumber: 'HEMO-001',
        type: 'Surgical Instrument',
        status: 'IN_USE',
        lastSterilized: new Date('2023-05-27T14:30:00'),
        location: 'Operating Theater',
        stockQuantity: 15,
        minStockThreshold: 3
      },
      {
        name: 'Retractor',
        serialNumber: 'RET-001',
        type: 'Surgical Instrument',
        status: 'STERILIZING',
        lastSterilized: new Date('2023-05-26T09:15:00'),
        location: 'CSSD Room 2',
        stockQuantity: 8,
        minStockThreshold: 2
      },
      {
        name: 'Surgical Scalpel',
        serialNumber: 'SCALP-001',
        type: 'Surgical Instrument',
        status: 'AVAILABLE',
        lastSterilized: new Date('2023-05-29T16:45:00'),
        location: 'CSSD Room 1',
        stockQuantity: 20,
        minStockThreshold: 5
      },
      {
        name: 'Needle Holder',
        serialNumber: 'NEED-001',
        type: 'Surgical Instrument',
        status: 'MAINTENANCE',
        lastSterilized: new Date('2023-05-25T11:30:00'),
        location: 'Maintenance',
        stockQuantity: 12,
        minStockThreshold: 3
      }
    ]
  });
  console.log('Seeded 5 CSSD instruments');
}

async function seedCSSDRecords() {
  const instruments = await prisma.cSSDInstrument.findMany();

  await prisma.cSSDRecord.createMany({
    data: [
      {
        instrumentId: instruments[0].id,
        sterilizationDate: new Date('2023-05-28T10:00:00'),
        sterilizationMethod: 'Autoclave',
        cycleNumber: 'ACL-20230528-1',
        status: 'COMPLETED',
        qualityCheck: 'PASSED',
        notes: 'Routine sterilization'
      },
      {
        instrumentId: instruments[1].id,
        sterilizationDate: new Date('2023-05-27T14:30:00'),
        sterilizationMethod: 'Autoclave',
        cycleNumber: 'ACL-20230527-2',
        status: 'COMPLETED',
        qualityCheck: 'PASSED',
        notes: 'Post-surgery sterilization'
      },
      {
        instrumentId: instruments[2].id,
        sterilizationDate: new Date('2023-05-26T09:15:00'),
        sterilizationMethod: 'Chemical',
        cycleNumber: 'CHEM-20230526-1',
        status: 'PENDING',
        qualityCheck: 'PENDING',
        notes: 'Delicate instrument'
      },
      {
        instrumentId: instruments[3].id,
        sterilizationDate: new Date('2023-05-29T16:45:00'),
        sterilizationMethod: 'Autoclave',
        cycleNumber: 'ACL-20230529-3',
        status: 'COMPLETED',
        qualityCheck: 'PASSED',
        notes: 'Batch sterilization'
      },
      {
        instrumentId: instruments[4].id,
        sterilizationDate: new Date('2023-05-25T11:30:00'),
        sterilizationMethod: 'Autoclave',
        cycleNumber: 'ACL-20230525-1',
        status: 'FAILED',
        qualityCheck: 'FAILED',
        notes: 'Sent for maintenance'
      }
    ]
  });
  console.log('Seeded 5 CSSD records');
}

async function seedCSSDRequisitions() {
  const instruments = await prisma.cSSDInstrument.findMany();
  const users = await prisma.user.findMany();

  await prisma.cSSDRequisition.createMany({
    data: [
      {
        instrumentId: instruments[0].id,
        department: 'Surgery',
        requestedBy: users[0].id,
        quantity: 2,
        requestDate: new Date('2023-05-28T08:30:00'),
        status: 'COMPLETED',
        notes: 'For scheduled surgery'
      },
      {
        instrumentId: instruments[1].id,
        department: 'Emergency',
        requestedBy: users[1].id,
        quantity: 3,
        requestDate: new Date('2023-05-29T14:15:00'),
        dispatchDate: new Date('2023-05-29T14:30:00'),
        status: 'COMPLETED',
        notes: 'Emergency case'
      },
      {
        instrumentId: instruments[2].id,
        department: 'Obstetrics',
        requestedBy: users[2].id,
        quantity: 1,
        requestDate: new Date('2023-05-30T10:00:00'),
        status: 'PENDING',
        notes: 'For C-section'
      },
      {
        instrumentId: instruments[3].id,
        department: 'Internal Medicine',
        requestedBy: users[3].id,
        quantity: 5,
        requestDate: new Date('2023-05-31T09:45:00'),
        status: 'PROCESSING',
        notes: 'For ward procedures'
      },
      {
        instrumentId: instruments[4].id,
        department: 'Pediatrics',
        requestedBy: users[4].id,
        quantity: 2,
        requestDate: new Date('2023-06-01T11:30:00'),
        status: 'CANCELLED',
        notes: 'Cancelled by department'
      }
    ]
  });
  console.log('Seeded 5 CSSD requisitions');
}

async function seedCSSDLogs() {
  const instruments = await prisma.cSSDInstrument.findMany();
  const records = await prisma.cSSDRecord.findMany();
  const requisitions = await prisma.cSSDRequisition.findMany();
  const users = await prisma.user.findMany();

  await prisma.cSSDLog.createMany({
    data: [
      {
        instrumentId: instruments[0].id,
        userId: users[0].id,
        action: 'STERILIZED',
        details: 'Routine sterilization completed'
      },
      {
        recordId: records[1].id,
        userId: users[1].id,
        action: 'QUALITY_CHECK',
        details: 'Quality check passed'
      },
      {
        requisitionId: requisitions[2].id,
        userId: users[2].id,
        action: 'REQUESTED',
        details: 'New requisition created'
      },
      {
        instrumentId: instruments[3].id,
        recordId: records[3].id,
        userId: users[3].id,
        action: 'UPDATED',
        details: 'Record updated after sterilization'
      },
      {
        requisitionId: requisitions[4].id,
        userId: users[4].id,
        action: 'CANCELLED',
        details: 'Requisition cancelled by department'
      }
    ]
  });
  console.log('Seeded 5 CSSD logs');
}

async function seedPrescriptions() {
  const patients = await prisma.patient.findMany();
  const doctors = await prisma.doctor.findMany();

  await prisma.prescription.createMany({
    data: [
      {
        patientId: patients[0].id,
        doctorId: doctors[0].id,
        status: 'DISPENSED',
        prescriptionDate: new Date('2023-05-28T11:30:00'),
        notes: 'For hypertension management'
      },
      {
        patientId: patients[1].id,
        doctorId: doctors[1].id,
        status: 'DISPENSED',
        prescriptionDate: new Date('2023-05-29T09:45:00'),
        notes: 'Asthma medication'
      },
      {
        patientId: patients[2].id,
        doctorId: doctors[2].id,
        status: 'PENDING',
        prescriptionDate: new Date('2023-05-30T14:15:00'),
        notes: 'For gastric pain'
      },
      {
        patientId: patients[3].id,
        doctorId: doctors[3].id,
        status: 'CANCELLED',
        prescriptionDate: new Date('2023-05-31T10:30:00'),
        notes: 'Cancelled - patient allergic'
      },
      {
        patientId: patients[4].id,
        doctorId: doctors[4].id,
        status: 'DISPENSED',
        prescriptionDate: new Date('2023-06-01T16:00:00'),
        notes: 'Pain management'
      }
    ]
  });
  console.log('Seeded 5 prescriptions');
}

async function seedPrescriptionItems() {
  const prescriptions = await prisma.prescription.findMany();
  const medications = await prisma.medication.findMany();

  await prisma.prescriptionItem.createMany({
    data: [
      {
        prescriptionId: prescriptions[0].id,
        medicationId: medications[2].id, // Lisinopril
        dosage: '10mg',
        quantity: 30,
        frequency: 'Once daily',
        duration: '30 days'
      },
      {
        prescriptionId: prescriptions[1].id,
        medicationId: medications[3].id, // Salbutamol
        dosage: '100mcg',
        quantity: 1,
        frequency: 'As needed',
        duration: '90 days'
      },
      {
        prescriptionId: prescriptions[2].id,
        medicationId: medications[0].id, // Paracetamol
        dosage: '500mg',
        quantity: 20,
        frequency: 'Every 6 hours',
        duration: '5 days'
      },
      {
        prescriptionId: prescriptions[3].id,
        medicationId: medications[1].id, // Amoxicillin
        dosage: '500mg',
        quantity: 21,
        frequency: 'Three times daily',
        duration: '7 days'
      },
      {
        prescriptionId: prescriptions[4].id,
        medicationId: medications[4].id, // Morphine
        dosage: '10mg',
        quantity: 10,
        frequency: 'Every 4 hours',
        duration: '3 days'
      }
    ]
  });
  console.log('Seeded 5 prescription items');
}

async function seedDispensingRecords() {
  const prescriptions = await prisma.prescription.findMany({
    where: { status: 'DISPENSED' }
  });
  const medications = await prisma.medication.findMany();
  const users = await prisma.user.findMany();

  await prisma.dispensingRecord.createMany({
    data: [
      {
        prescriptionId: prescriptions[0].id,
        medicationId: medications[2].id, // Lisinopril
        patientType: 'OUTPATIENT',
        quantity: 30,
        dispensedDate: new Date('2023-05-28T12:15:00'),
        dispensedById: users[0].id
      },
      {
        prescriptionId: prescriptions[1].id,
        medicationId: medications[3].id, // Salbutamol
        patientType: 'OUTPATIENT',
        quantity: 1,
        dispensedDate: new Date('2023-05-29T10:30:00'),
        dispensedById: users[1].id
      },
      {
        prescriptionId: prescriptions[2].id,
        medicationId: medications[4].id, // Morphine
        patientType: 'INPATIENT',
        quantity: 10,
        dispensedDate: new Date('2023-06-01T16:45:00'),
        dispensedById: users[2].id
      }
    ]
  });
  console.log('Seeded 3 dispensing records (only 3 prescriptions were dispensed)');
}

async function seedStockAdjustments() {
  const medications = await prisma.medication.findMany();
  const users = await prisma.user.findMany();

  await prisma.stockAdjustment.createMany({
    data: [
      {
        medicationId: medications[0].id, // Paracetamol
        quantity: -5,
        reason: 'Expired stock',
        adjustedById: users[0].id,
        adjustmentDate: new Date('2023-05-28T09:00:00')
      },
      {
        medicationId: medications[1].id, // Amoxicillin
        quantity: 100,
        reason: 'New shipment received',
        adjustedById: users[1].id,
        adjustmentDate: new Date('2023-05-29T11:30:00')
      },
      {
        medicationId: medications[2].id, // Lisinopril
        quantity: -2,
        reason: 'Damaged packaging',
        adjustedById: users[2].id,
        adjustmentDate: new Date('2023-05-30T14:15:00')
      },
      {
        medicationId: medications[3].id, // Salbutamol
        quantity: 50,
        reason: 'Inventory correction',
        adjustedById: users[3].id,
        adjustmentDate: new Date('2023-05-31T10:45:00')
      },
      {
        medicationId: medications[4].id, // Morphine
        quantity: -1,
        reason: 'Theft reported',
        adjustedById: users[4].id,
        adjustmentDate: new Date('2023-06-01T15:30:00')
      }
    ]
  });
  console.log('Seeded 5 stock adjustments');
}

async function seedInvoices() {
  // Get only prescriptions with enough related data
  const prescriptions = await prisma.prescription.findMany({
    where: { 
      status: 'DISPENSED',
      dispensingRecords: { some: {} } // Ensure it has dispensing records
    },
    include: { dispensingRecords: true }
  });

  const transactions = await prisma.transaction.findMany();

  // Only proceed if we have the required data
  if (prescriptions.length < 3 || transactions.length < 2) {
    console.log('Not enough prescriptions or transactions to seed invoices');
    return;
  }

  await prisma.invoice.createMany({
    data: [
      {
        prescriptionId: prescriptions[0].id,
        totalAmount: 60000,
        status: 'PAID',
        paymentMethod: 'CASH',
        transactionId: transactions[0]?.id
      },
      {
        prescriptionId: prescriptions[1].id,
        totalAmount: 15000,
        status: 'PAID',
        paymentMethod: 'INSURANCE',
        transactionId: transactions[1]?.id
      },
      {
        prescriptionId: prescriptions[2].id,
        totalAmount: 50000,
        status: 'PENDING'
        // paymentMethod and transactionId intentionally omitted for PENDING
      }
    ],
    skipDuplicates: true
  });

  console.log(`Seeded ${Math.min(prescriptions.length, 3)} invoices`);
}

async function seedRefunds() {
  // Get paid invoices that don't already have refunds
  const invoices = await prisma.invoice.findMany({
    where: { 
      status: 'PAID',
      refunds: { none: {} } // Only invoices without existing refunds
    },
    orderBy: { createdAt: 'asc' } // Get oldest first
  });

  // Get users who can process refunds (e.g., admins or accountants)
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { role: 'ADMIN' },
        { role: 'ACCOUNTANT' }
      ]
    },
    take: 2 // We only need 2 users
  });

  // Validate we have enough data
  if (invoices.length < 2 || users.length < 2) {
    console.log(`Skipping refund seeding - need 2 paid invoices and 2 eligible users. Found ${invoices.length} invoices and ${users.length} users.`);
    return;
  }

  try {
    await prisma.refund.createMany({
      data: [
        {
          invoiceId: invoices[0].id,
          reason: 'Overcharged',
          amount: 10000,
          refundDate: new Date('2023-05-29T10:00:00'),
          processedById: users[0].id
        },
        {
          invoiceId: invoices[1].id,
          reason: 'Wrong medication dispensed',
          amount: 15000,
          refundDate: new Date('2023-05-30T14:30:00'),
          processedById: users[1].id
        }
      ],
      skipDuplicates: true
    });
    console.log('Successfully seeded 2 refunds');
  } catch (error) {
    console.error('Error seeding refunds:', error);
  }
}

async function seedCostCenters() {
  await prisma.costCenter.createMany({
    data: [
      {
        name: 'Pharmacy',
        department: 'Pharmacy'
      },
      {
        name: 'Laboratory',
        department: 'Laboratory'
      },
      {
        name: 'Radiology',
        department: 'Radiology'
      },
      {
        name: 'Ward Services',
        department: 'Nursing'
      },
      {
        name: 'Administration',
        department: 'Administration'
      }
    ]
  });
  console.log('Seeded 5 cost centers');
}

async function seedTransactions() {
  const costCenters = await prisma.costCenter.findMany();
  const patients = await prisma.patient.findMany();

  await prisma.transaction.createMany({
    data: [
      {
        description: 'Pharmacy sale - Lisinopril',
        amount: 60000,
        category: 'PHARMACY',
        status: 'COMPLETED',
        date: new Date('2023-05-28T12:30:00'),
        type: 'CREDIT',
        costCenterId: costCenters[0].id,
        patientId: patients[0].id
      },
      {
        description: 'Pharmacy sale - Salbutamol',
        amount: 15000,
        category: 'PHARMACY',
        status: 'COMPLETED',
        date: new Date('2023-05-29T10:45:00'),
        type: 'CREDIT',
        costCenterId: costCenters[0].id,
        patientId: patients[1].id
      },
      {
        description: 'Lab test - CBC',
        amount: 25000,
        category: 'LABORATORY',
        status: 'PENDING',
        date: new Date('2023-05-30T09:15:00'),
        type: 'CREDIT',
        costCenterId: costCenters[1].id,
        patientId: patients[2].id
      },
      {
        description: 'X-ray - Chest',
        amount: 50000,
        category: 'RADIOLOGY',
        status: 'COMPLETED',
        date: new Date('2023-05-31T11:30:00'),
        type: 'CREDIT',
        costCenterId: costCenters[2].id,
        patientId: patients[3].id
      },
      {
        description: 'Supplier payment - Quality Chemicals',
        amount: 1500000,
        category: 'SUPPLIER',
        status: 'COMPLETED',
        date: new Date('2023-06-01T14:00:00'),
        type: 'DEBIT',
        costCenterId: costCenters[4].id
      }
    ]
  });
  console.log('Seeded 5 transactions');
}

async function seedPayrolls() {
  const users = await prisma.user.findMany();

  await prisma.payroll.createMany({
    data: [
      {
        userId: users[0].id,
        salary: 5000000,
        taxes: 1000000,
        benefits: 500000,
        period: 'MAY-2023',
        status: 'PAID'
      },
      {
        userId: users[1].id,
        salary: 4500000,
        taxes: 900000,
        benefits: 450000,
        period: 'MAY-2023',
        status: 'PAID'
      },
      {
        userId: users[2].id,
        salary: 4000000,
        taxes: 800000,
        benefits: 400000,
        period: 'MAY-2023',
        status: 'PAID'
      },
      {
        userId: users[3].id,
        salary: 3500000,
        taxes: 700000,
        benefits: 350000,
        period: 'MAY-2023',
        status: 'PENDING'
      },
      {
        userId: users[4].id,
        salary: 3000000,
        taxes: 600000,
        benefits: 300000,
        period: 'MAY-2023',
        status: 'PENDING'
      }
    ]
  });
  console.log('Seeded 5 payroll records');
}

async function seedPurchaseOrders() {
  const suppliers = await prisma.supplier.findMany();

  await prisma.purchaseOrder.createMany({
    data: [
      {
        supplierId: suppliers[0].id,
        orderDate: new Date('2023-05-01T10:00:00'),
        status: 'DELIVERED',
        totalAmount: 5000000
      },
      {
        supplierId: suppliers[1].id,
        orderDate: new Date('2023-05-10T14:30:00'),
        status: 'DELIVERED',
        totalAmount: 3000000
      },
      {
        supplierId: suppliers[2].id,
        orderDate: new Date('2023-05-15T09:15:00'),
        status: 'PROCESSING',
        totalAmount: 2500000
      },
      {
        supplierId: suppliers[3].id,
        orderDate: new Date('2023-05-20T11:45:00'),
        status: 'PENDING',
        totalAmount: 4000000
      },
      {
        supplierId: suppliers[4].id,
        orderDate: new Date('2023-05-25T16:00:00'),
        status: 'CANCELLED',
        totalAmount: 2000000
      }
    ]
  });
  console.log('Seeded 5 purchase orders');
}

async function seedPurchaseOrderItems() {
  const purchaseOrders = await prisma.purchaseOrder.findMany();
  const medications = await prisma.medication.findMany();

  await prisma.purchaseOrderItem.createMany({
    data: [
      {
        purchaseOrderId: purchaseOrders[0].id,
        medicationId: medications[0].id, // Paracetamol
        quantity: 1000,
        unitPrice: 500
      },
      {
        purchaseOrderId: purchaseOrders[1].id,
        medicationId: medications[1].id, // Amoxicillin
        quantity: 500,
        unitPrice: 3000
      },
      {
        purchaseOrderId: purchaseOrders[2].id,
        medicationId: medications[2].id, // Lisinopril
        quantity: 300,
        unitPrice: 2000
      },
      {
        purchaseOrderId: purchaseOrders[3].id,
        medicationId: medications[3].id, // Salbutamol
        quantity: 200,
        unitPrice: 15000
      },
      {
        purchaseOrderId: purchaseOrders[4].id,
        medicationId: medications[4].id, // Morphine
        quantity: 50,
        unitPrice: 5000
      }
    ]
  });
  console.log('Seeded 5 purchase order items');
}

async function seedFixedAssets() {
  await prisma.fixedAsset.createMany({
    data: [
      {
        name: 'X-ray Machine',
        purchaseDate: new Date('2020-01-15'),
        purchaseCost: 150000000,
        depreciation: 30000000,
        currentValue: 120000000,
        status: 'OPERATIONAL'
      },
      {
        name: 'Ultrasound Machine',
        purchaseDate: new Date('2021-03-20'),
        purchaseCost: 80000000,
        depreciation: 16000000,
        currentValue: 64000000,
        status: 'OPERATIONAL'
      },
      {
        name: 'ECG Machine',
        purchaseDate: new Date('2022-05-10'),
        purchaseCost: 25000000,
        depreciation: 2500000,
        currentValue: 22500000,
        status: 'OPERATIONAL'
      },
      {
        name: 'Autoclave',
        purchaseDate: new Date('2019-11-05'),
        purchaseCost: 15000000,
        depreciation: 9000000,
        currentValue: 6000000,
        status: 'MAINTENANCE'
      },
      {
        name: 'Patient Monitor',
        purchaseDate: new Date('2023-02-28'),
        purchaseCost: 12000000,
        depreciation: 600000,
        currentValue: 11400000,
        status: 'OPERATIONAL'
      }
    ]
  });
  console.log('Seeded 5 fixed assets');
}

async function seedMedicalRecords() {
  const patients = await prisma.patient.findMany();

  await prisma.medicalRecord.createMany({
    data: [
      {
        patientId: patients[0].id,
        recordId: 'MR-001-2023',
        diagnosis: 'Hypertension, Type 2 Diabetes',
        presentingComplaint: 'Chest pain and shortness of breath',
        familyHistory: 'Father had heart disease',
        socialHistory: 'Non-smoker, occasional alcohol',
        pastMedicalHistory: 'Appendectomy 2005',
        allergies: 'Penicillin',
        medications: 'Metformin, Lisinopril',
        date: new Date('2023-05-28'),
        doctorName: 'Dr. James Kato'
      },
      {
        patientId: patients[1].id,
        recordId: 'MR-002-2023',
        diagnosis: 'Asthma exacerbation',
        presentingComplaint: 'Persistent cough and wheezing',
        familyHistory: 'Mother has asthma',
        socialHistory: 'Student, non-smoker',
        pastMedicalHistory: 'Tonsillectomy 2010',
        allergies: 'None',
        medications: 'Salbutamol inhaler',
        date: new Date('2023-05-29'),
        doctorName: 'Dr. Sarah Nalwoga'
      },
      {
        patientId: patients[2].id,
        recordId: 'MR-003-2023',
        diagnosis: 'Peptic ulcer disease',
        presentingComplaint: 'Abdominal pain and vomiting',
        familyHistory: 'Father had gastric cancer',
        socialHistory: 'Businessman, social drinker',
        pastMedicalHistory: 'Gallbladder removal 2018',
        allergies: 'Sulfa drugs',
        medications: 'Omeprazole',
        date: new Date('2023-05-30'),
        doctorName: 'Dr. Robert Kibuuka'
      },
      {
        patientId: patients[3].id,
        recordId: 'MR-004-2023',
        diagnosis: 'Viral infection',
        presentingComplaint: 'Fever and rash',
        familyHistory: 'No significant family history',
        socialHistory: 'Secondary school student',
        pastMedicalHistory: 'Chickenpox 2010',
        allergies: 'Peanuts',
        medications: 'None',
        date: new Date('2023-05-31'),
        doctorName: 'Dr. Esther Namukasa'
      },
      {
        patientId: patients[4].id,
        recordId: 'MR-005-2023',
        diagnosis: 'Osteoarthritis',
        presentingComplaint: 'Joint pain and swelling',
        familyHistory: 'Mother had rheumatoid arthritis',
        socialHistory: 'Retired teacher',
        pastMedicalHistory: 'Hernia repair 2015',
        allergies: 'None',
        medications: 'Hydrochlorothiazide, Ibuprofen',
        date: new Date('2023-06-01'),
        doctorName: 'Dr. David Ssempijja'
      }
    ]
  });
  console.log('Seeded 5 medical records');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });