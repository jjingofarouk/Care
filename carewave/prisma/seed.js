const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    // Disable FK constraints temporarily (PostgreSQL/Supabase specific)
    await prisma.$executeRaw`SET session_replication_role = 'replica';`;
    
    // Get all tables except migrations
    const tables = await prisma.$queryRaw`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public'
      AND tablename != '_prisma_migrations'
    `;

    // Clear all tables with CASCADE
    for (const { tablename } of tables) {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`);
      console.log(`✓ Cleared ${tablename}`);
    }

    // Re-enable FK constraints
    await prisma.$executeRaw`SET session_replication_role = 'origin';`;
    
    console.log('✔ Database cleared successfully');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
}

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create departments
    const clinicalDept = await prisma.department.create({
      data: {
        name: 'Clinical Services',
        departmentType: 'CLINICAL',
      },
    });

    const adminDept = await prisma.department.create({
      data: {
        name: 'Administration',
        departmentType: 'ADMINISTRATIVE',
      },
    });

    

    // ========================
    // ADD REMAINING SEED DATA BELOW
    // ========================

    

  const supportDept = await prisma.department.create({
    data: {
      name: 'Support Services',
      departmentType: 'SUPPORT',
    },
  });

  // Create units within departments
  const pediatricUnit = await prisma.unit.create({
    data: {
      name: 'Pediatrics',
      department: { connect: { id: clinicalDept.id } },
    },
  });

  const surgeryUnit = await prisma.unit.create({
    data: {
      name: 'Surgery',
      department: { connect: { id: clinicalDept.id } },
    },
  });

  // Create wards
  const pediatricWard = await prisma.ward.create({
    data: {
      name: 'Pediatric Ward A',
      department: { connect: { id: clinicalDept.id } },
    },
  });

  const surgeryWard = await prisma.ward.create({
    data: {
      name: 'Surgical Ward B',
      department: { connect: { id: clinicalDept.id } },
    },
  });

  // Create beds
  await prisma.bed.createMany({
    data: [
      { wardId: pediatricWard.id, bedNumber: 'PED-101', isOccupied: false },
      { wardId: pediatricWard.id, bedNumber: 'PED-102', isOccupied: false },
      { wardId: surgeryWard.id, bedNumber: 'SUR-201', isOccupied: false },
      { wardId: surgeryWard.id, bedNumber: 'SUR-202', isOccupied: false },
    ],
  });

  // Create rooms
  await prisma.room.createMany({
    data: [
      { wardId: pediatricWard.id, roomNumber: 'PED-RM1' },
      { wardId: pediatricWard.id, roomNumber: 'PED-RM2' },
      { wardId: surgeryWard.id, roomNumber: 'SUR-RM1' },
      { wardId: surgeryWard.id, roomNumber: 'SUR-RM2' },
    ],
  });

  // Create specializations
  const pediatricSpecialization = await prisma.specialization.create({
    data: {
      name: 'Pediatrics',
      description: 'Specialization in child healthcare',
    },
  });

  const surgerySpecialization = await prisma.specialization.create({
    data: {
      name: 'General Surgery',
      description: 'Specialization in surgical procedures',
    },
  });

  // Create doctors
  const pediatricDoctor = await prisma.doctor.create({
    data: {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@hospital.com',
      phone: '+254712345678',
      department: { connect: { id: clinicalDept.id } },
    },
  });

  const surgeryDoctor = await prisma.doctor.create({
    data: {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@hospital.com',
      phone: '+254712345679',
      department: { connect: { id: clinicalDept.id } },
    },
  });

  // Connect doctors to specializations
  await prisma.doctorSpecialization.createMany({
    data: [
      {
        doctorId: pediatricDoctor.id,
        specializationId: pediatricSpecialization.id,
      },
      {
        doctorId: surgeryDoctor.id,
        specializationId: surgerySpecialization.id,
      },
    ],
  });

  // Create doctor schedules
  await prisma.doctorSchedule.createMany({
    data: [
      {
        doctorId: pediatricDoctor.id,
        startTime: new Date('2025-01-01T08:00:00Z'),
        endTime: new Date('2025-01-01T16:00:00Z'),
        dayOfWeek: 'Monday',
      },
      {
        doctorId: pediatricDoctor.id,
        startTime: new Date('2025-01-01T08:00:00Z'),
        endTime: new Date('2025-01-01T16:00:00Z'),
        dayOfWeek: 'Wednesday',
      },
      {
        doctorId: surgeryDoctor.id,
        startTime: new Date('2025-01-01T09:00:00Z'),
        endTime: new Date('2025-01-01T17:00:00Z'),
        dayOfWeek: 'Tuesday',
      },
      {
        doctorId: surgeryDoctor.id,
        startTime: new Date('2025-01-01T09:00:00Z'),
        endTime: new Date('2025-01-01T17:00:00Z'),
        dayOfWeek: 'Thursday',
      },
    ],
  });

  // Create nurses
  const pediatricNurse = await prisma.nurse.create({
    data: {
      firstName: 'Mary',
      lastName: 'Johnson',
      email: 'mary.johnson@hospital.com',
      phone: '+254712345680',
      department: { connect: { id: clinicalDept.id } },
    },
  });

  const surgeryNurse = await prisma.nurse.create({
    data: {
      firstName: 'Robert',
      lastName: 'Williams',
      email: 'robert.williams@hospital.com',
      phone: '+254712345681',
      department: { connect: { id: clinicalDept.id } },
    },
  });

  // Create nurse schedules
  await prisma.nurseSchedule.createMany({
    data: [
      {
        nurseId: pediatricNurse.id,
        startTime: new Date('2025-01-01T08:00:00Z'),
        endTime: new Date('2025-01-01T20:00:00Z'),
        dayOfWeek: 'Monday',
      },
      {
        nurseId: surgeryNurse.id,
        startTime: new Date('2025-01-01T08:00:00Z'),
        endTime: new Date('2025-01-01T20:00:00Z'),
        dayOfWeek: 'Tuesday',
      },
    ],
  });

  // Create shifts
  await prisma.shift.createMany({
    data: [
      {
        nurseId: pediatricNurse.id,
        wardId: pediatricWard.id,
        startTime: new Date('2025-01-01T08:00:00Z'),
        endTime: new Date('2025-01-01T20:00:00Z'),
      },
      {
        nurseId: surgeryNurse.id,
        wardId: surgeryWard.id,
        startTime: new Date('2025-01-01T08:00:00Z'),
        endTime: new Date('2025-01-01T20:00:00Z'),
      },
    ],
  });

  // Create system admin roles and permissions
  const adminPermission = await prisma.permission.create({
    data: {
      name: 'ADMIN',
      description: 'Full system access',
    },
  });

  const userPermission = await prisma.permission.create({
    data: {
      name: 'USER',
      description: 'Basic user access',
    },
  });

  const adminRole = await prisma.role.create({
    data: {
      name: 'ADMIN',
      description: 'System administrator role',
      permissions: { connect: [{ id: adminPermission.id }, { id: userPermission.id }] },
    },
  });

  const userRole = await prisma.role.create({
    data: {
      name: 'USER',
      description: 'Regular user role',
      permissions: { connect: { id: userPermission.id } },
    },
  });

  // Create system admin
  const systemAdmin = await prisma.systemAdmin.create({
    data: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@hospital.com',
      role: { connect: { id: adminRole.id } },
    },
  });

  // Create admin log
  await prisma.adminLog.create({
    data: {
      adminId: systemAdmin.id,
      action: 'SYSTEM_INITIALIZED',
      details: 'Initial system setup completed',
    },
  });

  // Create social workers
  const socialWorker = await prisma.socialWorker.create({
    data: {
      firstName: 'Sarah',
      lastName: 'Miller',
      email: 'sarah.miller@hospital.com',
      phone: '+254712345682',
    },
  });

  // Create patients
  const patient1 = await prisma.patient.create({
    data: {
      firstName: 'David',
      lastName: 'Brown',
      dateOfBirth: new Date('1990-05-15'),
      gender: 'Male',
      phone: '+254712345683',
      email: 'david.brown@example.com',
    },
  });

  const patient2 = await prisma.patient.create({
    data: {
      firstName: 'Emily',
      lastName: 'Wilson',
      dateOfBirth: new Date('1985-08-22'),
      gender: 'Female',
      phone: '+254712345684',
      email: 'emily.wilson@example.com',
    },
  });

  // Create patient addresses
  await prisma.patientAddress.createMany({
    data: [
      {
        patientId: patient1.id,
        street: '123 Main St',
        city: 'Nairobi',
        country: 'Kenya',
        postalCode: '00100',
      },
      {
        patientId: patient2.id,
        street: '456 Park Ave',
        city: 'Nairobi',
        country: 'Kenya',
        postalCode: '00100',
      },
    ],
  });

  // Create next of kin
  await prisma.nextOfKin.createMany({
    data: [
      {
        patientId: patient1.id,
        firstName: 'Jennifer',
        lastName: 'Brown',
        relationship: 'Spouse',
        phone: '+254712345685',
      },
      {
        patientId: patient2.id,
        firstName: 'Michael',
        lastName: 'Wilson',
        relationship: 'Husband',
        phone: '+254712345686',
      },
    ],
  });

  // Create insurance info
  await prisma.insuranceInfo.createMany({
    data: [
      {
        patientId: patient1.id,
        provider: 'NHIF',
        policyNumber: 'NHIF-123456',
      },
      {
        patientId: patient2.id,
        provider: 'AAR Healthcare',
        policyNumber: 'AAR-789012',
        expiryDate: new Date('2026-12-31'),
      },
    ],
  });

  // Create medical records
  const medicalRecord1 = await prisma.medicalRecord.create({
    data: {
      patientId: patient1.id,
      recordDate: new Date(),
    },
  });

  const medicalRecord2 = await prisma.medicalRecord.create({
    data: {
      patientId: patient2.id,
      recordDate: new Date(),
    },
  });

  // Create allergies
  await prisma.allergy.createMany({
    data: [
      {
        medicalRecordId: medicalRecord1.id,
        name: 'Penicillin',
        severity: 'Moderate',
      },
      {
        medicalRecordId: medicalRecord2.id,
        name: 'Peanuts',
        severity: 'Severe',
      },
    ],
  });

  // Create diagnoses
  await prisma.diagnosis.createMany({
    data: [
      {
        medicalRecordId: medicalRecord1.id,
        code: 'J18.9',
        description: 'Pneumonia, unspecified',
        diagnosedAt: new Date(),
      },
      {
        medicalRecordId: medicalRecord2.id,
        code: 'E11.65',
        description: 'Type 2 diabetes mellitus with hyperglycemia',
        diagnosedAt: new Date(),
      },
    ],
  });

  // Create vital signs
  await prisma.vitalSign.createMany({
    data: [
      {
        medicalRecordId: medicalRecord1.id,
        bloodPressure: '120/80',
        heartRate: 72,
        temperature: 36.8,
        recordedAt: new Date(),
      },
      {
        medicalRecordId: medicalRecord2.id,
        bloodPressure: '130/85',
        heartRate: 68,
        temperature: 37.2,
        recordedAt: new Date(),
      },
    ],
  });

  // Create admissions
  const admission1 = await prisma.admission.create({
    data: {
      patientId: patient1.id,
      wardId: pediatricWard.id,
      admissionDate: new Date(),
    },
  });

  const admission2 = await prisma.admission.create({
    data: {
      patientId: patient2.id,
      wardId: surgeryWard.id,
      admissionDate: new Date(),
    },
  });

  // Assign beds to admissions
  await prisma.admission.update({
    where: { id: admission1.id },
    data: {
      bed: { connect: { bedNumber: 'PED-101' } },
    },
  });

  await prisma.admission.update({
    where: { id: admission2.id },
    data: {
      bed: { connect: { bedNumber: 'SUR-201' } },
    },
  });

  // Create discharges
  await prisma.discharge.createMany({
    data: [
      {
        admissionId: admission1.id,
        dischargeDate: new Date(Date.now() + 86400000), // Tomorrow
      },
      {
        admissionId: admission2.id,
        dischargeDate: new Date(Date.now() + 86400000), // Tomorrow
      },
    ],
  });

  // Create transfers
  await prisma.transfer.create({
    data: {
      admissionId: admission1.id,
      fromWardId: pediatricWard.id,
      toWardId: surgeryWard.id,
      transferDate: new Date(),
    },
  });

  // Create queue statuses
  const pendingStatus = await prisma.queueStatus.create({
    data: {
      name: 'PENDING',
    },
  });

  const inProgressStatus = await prisma.queueStatus.create({
    data: {
      name: 'IN_PROGRESS',
    },
  });

  const completedStatus = await prisma.queueStatus.create({
    data: {
      name: 'COMPLETED',
    },
  });

  // Create service counters
  const registrationCounter = await prisma.serviceCounter.create({
    data: {
      name: 'Registration',
      department: { connect: { id: adminDept.id } },
    },
  });

  const billingCounter = await prisma.serviceCounter.create({
    data: {
      name: 'Billing',
      department: { connect: { id: adminDept.id } },
    },
  });

  // Create queue entries
  await prisma.queueEntry.createMany({
    data: [
      {
        patientId: patient1.id,
        serviceCounterId: registrationCounter.id,
        queueStatusId: pendingStatus.id,
        queueNumber: 1,
      },
      {
        patientId: patient2.id,
        serviceCounterId: billingCounter.id,
        queueStatusId: inProgressStatus.id,
        queueNumber: 2,
      },
    ],
  });

  // Create clinical notes
  await prisma.clinicalNote.createMany({
    data: [
      {
        patientId: patient1.id,
        doctorId: pediatricDoctor.id,
        note: 'Patient presented with fever and cough. Diagnosed with pneumonia.',
      },
      {
        patientId: patient2.id,
        doctorId: surgeryDoctor.id,
        note: 'Patient with elevated blood sugar levels. Adjusted insulin dosage.',
      },
    ],
  });

  // Create SOAP notes
  await prisma.sOAPNote.createMany({
    data: [
      {
        patientId: patient1.id,
        doctorId: pediatricDoctor.id,
        subjective: 'Patient reports fever and productive cough for 3 days',
        objective: 'Temp 38.5°C, crackles heard in left lower lobe',
        assessment: 'Community-acquired pneumonia',
        plan: 'Prescribed antibiotics and rest',
      },
      {
        patientId: patient2.id,
        doctorId: surgeryDoctor.id,
        subjective: 'Patient reports increased thirst and fatigue',
        objective: 'Blood glucose 250 mg/dL',
        assessment: 'Poorly controlled diabetes',
        plan: 'Adjust insulin regimen and schedule follow-up',
      },
    ],
  });

  // Create visit types
  const consultationVisit = await prisma.visitType.create({
    data: {
      name: 'Consultation',
      description: 'Regular doctor consultation',
    },
  });

  const followUpVisit = await prisma.visitType.create({
    data: {
      name: 'Follow-up',
      description: 'Follow-up appointment',
    },
  });

  // Create appointments
  await prisma.appointment.createMany({
    data: [
      {
        patientId: patient1.id,
        doctorId: pediatricDoctor.id,
        visitTypeId: consultationVisit.id,
        appointmentStatus: 'CONFIRMED',
        appointmentDate: new Date(Date.now() + 86400000), // Tomorrow
      },
      {
        patientId: patient2.id,
        doctorId: surgeryDoctor.id,
        visitTypeId: followUpVisit.id,
        appointmentStatus: 'PENDING',
        appointmentDate: new Date(Date.now() + 2 * 86400000), // Day after tomorrow
      },
    ],
  });

  // Create emergency cases
  const triage1 = await prisma.triage.create({
    data: {
      patientId: patient1.id,
      triageLevel: 'URGENT',
      symptoms: 'Difficulty breathing, high fever',
      assessedAt: new Date(),
    },
  });

  const emergencyCase1 = await prisma.emergencyCase.create({
    data: {
      patientId: patient1.id,
      triageId: triage1.id,
      admissionId: admission1.id,
    },
  });

  // Create emergency logs
  await prisma.emergencyLog.create({
    data: {
      emergencyCaseId: emergencyCase1.id,
      description: 'Patient admitted to pediatric ward',
      loggedAt: new Date(),
    },
  });

  // Create ambulance
  await prisma.ambulance.create({
    data: {
      vehicleNumber: 'AMB-001',
      status: 'AVAILABLE',
    },
  });

  // Create maternity cases
  const maternityCase1 = await prisma.maternityCase.create({
    data: {
      patientId: patient2.id,
    },
  });

  // Create ANC visits
  await prisma.aNCVisit.create({
    data: {
      maternityCaseId: maternityCase1.id,
      visitDate: new Date(),
      notes: 'First trimester checkup - all normal',
    },
  });

  // Create vaccines
  const fluVaccine = await prisma.vaccine.create({
    data: {
      name: 'Influenza Vaccine',
      description: 'Seasonal flu vaccine',
    },
  });

  const covidVaccine = await prisma.vaccine.create({
    data: {
      name: 'COVID-19 Vaccine',
      description: 'SARS-CoV-2 vaccine',
    },
  });

  // Create immunization schedules
  const childImmunization = await prisma.immunizationSchedule.create({
    data: {
      name: 'Childhood Immunization',
      description: 'Standard childhood vaccination schedule',
    },
  });

  // Create vaccination records
  await prisma.vaccinationRecord.create({
    data: {
      patientId: patient1.id,
      vaccineId: fluVaccine.id,
      immunizationScheduleId: childImmunization.id,
      administeredDate: new Date(),
    },
  });

  // Create theatres
  const mainTheatre = await prisma.theatre.create({
    data: {
      name: 'Main Operating Theatre',
      department: { connect: { id: clinicalDept.id } },
    },
  });

  // Create surgical teams
  const surgicalTeam1 = await prisma.surgicalTeam.create({
    data: {
      name: 'General Surgery Team A',
    },
  });

  // Create pre-op assessments
  const preOpAssessment1 = await prisma.preOpAssessment.create({
    data: {
      patientId: patient2.id,
      assessment: 'Patient cleared for surgery',
      assessedAt: new Date(),
    },
  });

  // Create surgeries
  await prisma.surgery.create({
    data: {
      patientId: patient2.id,
      theatreId: mainTheatre.id,
      surgicalTeamId: surgicalTeam1.id,
      preOpAssessmentId: preOpAssessment1.id,
      surgeryDate: new Date(Date.now() + 3 * 86400000), // 3 days from now
    },
  });

  // Create lab tests
  const bloodTest = await prisma.labTest.create({
    data: {
      name: 'Complete Blood Count',
      description: 'Standard blood test',
    },
  });

  const urineTest = await prisma.labTest.create({
    data: {
      name: 'Urinalysis',
      description: 'Urine test',
    },
  });

  // Create samples
  const bloodSample = await prisma.sample.create({
    data: {
      patientId: patient1.id,
      sampleType: 'Blood',
      collectedAt: new Date(),
    },
  });

  // Create lab requests
  const labRequest1 = await prisma.labRequest.create({
    data: {
      patientId: patient1.id,
      labTestId: bloodTest.id,
      sampleId: bloodSample.id,
      requestedAt: new Date(),
    },
  });

  // Create lab results
  await prisma.labResult.create({
    data: {
      labRequestId: labRequest1.id,
      result: 'WBC: 8.5, RBC: 4.7, HGB: 14.2',
      resultedAt: new Date(),
    },
  });

  // Create radiology tests
  const xrayTest = await prisma.radiologyTest.create({
    data: {
      name: 'Chest X-ray',
      description: 'Standard chest radiograph',
    },
  });

  // Create imaging orders
  const imagingOrder1 = await prisma.imagingOrder.create({
    data: {
      patientId: patient1.id,
      radiologyTestId: xrayTest.id,
      orderedAt: new Date(),
    },
  });

  // Create radiology results
  const radiologyResult1 = await prisma.radiologyResult.create({
    data: {
      imagingOrderId: imagingOrder1.id,
      result: 'Clear lungs, no infiltrates',
      resultedAt: new Date(),
    },
  });

  // Create scan images
  await prisma.scanImage.create({
    data: {
      radiologyResultId: radiologyResult1.id,
      imageUrl: 'https://example.com/images/xray-123.jpg',
    },
  });

  // Create drugs
  const amoxicillin = await prisma.drug.create({
    data: {
      name: 'Amoxicillin',
      description: 'Antibiotic',
    },
  });

  const insulin = await prisma.drug.create({
    data: {
      name: 'Insulin',
      description: 'Diabetes medication',
    },
  });

  // Create pharmacy items
  const amoxicillinItem = await prisma.pharmacyItem.create({
    data: {
      drugId: amoxicillin.id,
      batchNumber: 'AMX-2023-001',
      expiryDate: new Date('2024-12-31'),
      quantity: 100,
    },
  });

  // Create prescriptions
  await prisma.prescription.createMany({
    data: [
      {
        patientId: patient1.id,
        doctorId: pediatricDoctor.id,
        drugId: amoxicillin.id,
        dosage: '500mg every 8 hours for 7 days',
        prescribedAt: new Date(),
      },
      {
        patientId: patient2.id,
        doctorId: surgeryDoctor.id,
        drugId: insulin.id,
        dosage: '10 units before breakfast',
        prescribedAt: new Date(),
      },
    ],
  });

  // Create dispense records
  await prisma.dispenseRecord.create({
    data: {
      pharmacyItemId: amoxicillinItem.id,
      patientId: patient1.id,
      dispensedAt: new Date(),
      quantity: 21, // 7 days * 3 times per day
    },
  });

  // Create dispensaries
  const mainDispensary = await prisma.dispensary.create({
    data: {
      name: 'Main Pharmacy',
      location: 'Ground Floor, Building A',
    },
  });

  // Create pharmacists
  await prisma.pharmacist.create({
    data: {
      firstName: 'Thomas',
      lastName: 'Anderson',
      email: 'thomas.anderson@hospital.com',
      phone: '+254712345687',
    },
  });

  // Create dispensary stocks
  await prisma.dispensaryStock.create({
    data: {
      dispensaryId: mainDispensary.id,
      drugId: amoxicillin.id,
      quantity: 500,
    },
  });

  // Create CSSD items
  const surgicalKit = await prisma.cSSDItem.create({
    data: {
      name: 'Basic Surgical Kit',
      description: 'Standard surgical instruments set',
    },
  });

  // Create sterilization cycles
  await prisma.sterilizationCycle.create({
    data: {
      cssdItemId: surgicalKit.id,
      cycleDate: new Date(),
      status: 'COMPLETED',
    },
  });

  // Create instrument requests
  await prisma.instrumentRequest.create({
    data: {
      cssdItemId: surgicalKit.id,
      departmentId: clinicalDept.id,
      requestedAt: new Date(),
    },
  });

  // Create help desk tickets
  const supportAgent = await prisma.supportAgent.create({
    data: {
      firstName: 'Linda',
      lastName: 'Taylor',
      email: 'linda.taylor@hospital.com',
      phone: '+254712345688',
    },
  });

  await prisma.helpTicket.createMany({
    data: [
      {
        userId: patient1.id,
        userType: 'PATIENT',
        category: 'CLINICAL',
        description: 'Question about my prescription',
        status: 'OPEN',
        supportAgentId: supportAgent.id,
      },
      {
        userId: patient2.id,
        userType: 'PATIENT',
        category: 'BILLING',
        description: 'Invoice clarification needed',
        status: 'PENDING',
      },
    ],
  });

  // Create utility logs
  await prisma.electricityLog.create({
    data: {
      recordedAt: new Date(),
      usageKwh: 1250.5,
    },
  });

  await prisma.waterLog.create({
    data: {
      recordedAt: new Date(),
      usageLiters: 5000,
    },
  });

  // Create backup generator status
  await prisma.backupGeneratorStatus.create({
    data: {
      generatorId: 'GEN-001',
      status: 'OPERATIONAL',
      lastCheckedAt: new Date(),
    },
  });

  // Create system settings
  await prisma.systemSetting.createMany({
    data: [
      { key: 'MAINTENANCE_MODE', value: 'false' },
      { key: 'VISITING_HOURS', value: '10:00-18:00' },
    ],
  });

  // Create feature toggles
  await prisma.featureToggle.createMany({
    data: [
      { name: 'ONLINE_APPOINTMENTS', isEnabled: true },
      { name: 'TELEMEDICINE', isEnabled: false },
    ],
  });

  // Create theme settings
  await prisma.themeSetting.create({
    data: {
      name: 'Default',
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
    },
  });

  // Create verification tokens
  const verificationToken1 = await prisma.verificationToken.create({
    data: {
      userId: patient1.id,
      userType: 'PATIENT',
      token: 'abc123',
      expiresAt: new Date(Date.now() + 86400000), // Tomorrow
    },
  });

  // Create user verification status
  await prisma.userVerificationStatus.create({
    data: {
      verificationTokenId: verificationToken1.id,
      status: 'PENDING',
    },
  });

  // Create audit logs
  await prisma.auditLog.create({
    data: {
      userId: systemAdmin.id,
      userType: 'SYSTEM_ADMIN',
      action: 'DATABASE_SEEDED',
      details: 'Initial database seeding completed',
    },
  });

  // Create billing categories
  await prisma.invoice.createMany({
    data: [
      {
        patientId: patient1.id,
        invoiceDate: new Date(),
        totalAmount: 15000,
      },
      {
        patientId: patient2.id,
        invoiceDate: new Date(),
        totalAmount: 25000,
      },
    ],
  });

  // Create payments
  const invoice1 = await prisma.invoice.findFirst({
    where: { patientId: patient1.id },
  });

  if (invoice1) {
    await prisma.payment.create({
      data: {
        invoiceId: invoice1.id,
        amount: 10000,
        paymentDate: new Date(),
        method: 'MPESA',
      },
    });
  }

  // Create billing items
  if (invoice1) {
    await prisma.billingItem.createMany({
      data: [
        {
          invoiceId: invoice1.id,
          billingCategory: 'CONSULTATION',
          description: 'Doctor consultation',
          amount: 5000,
        },
        {
          invoiceId: invoice1.id,
          billingCategory: 'MEDICATION',
          description: 'Amoxicillin 500mg',
          amount: 10000,
        },
      ],
    });
  }

  // Create accounting accounts
  const revenueAccount = await prisma.account.create({
    data: {
      name: 'Service Revenue',
      accountType: 'REVENUE',
    },
  });

  const assetAccount = await prisma.account.create({
    data: {
      name: 'Accounts Receivable',
      accountType: 'ASSET',
    },
  });

  // Create ledger
  const generalLedger = await prisma.ledger.create({
    data: {
      name: 'General Ledger',
    },
  });

  // Create journal entries
  await prisma.journalEntry.createMany({
    data: [
      {
        accountId: revenueAccount.id,
        ledgerId: generalLedger.id,
        amount: 15000,
        entryDate: new Date(),
        description: 'Patient invoice',
      },
      {
        accountId: assetAccount.id,
        ledgerId: generalLedger.id,
        amount: 15000,
        entryDate: new Date(),
        description: 'Accounts receivable',
      },
    ],
  });

  // Create trial balance
  await prisma.trialBalance.create({
    data: {
      ledgerId: generalLedger.id,
      period: '2023-01',
      balance: 30000,
    },
  });

  // Create claim batches
  const claimBatch1 = await prisma.claimBatch.create({
    data: {
      batchNumber: 'CLM-2023-001',
    },
  });

  // Create claims
  const claim1 = await prisma.claim.create({
    data: {
      patientId: patient1.id,
      claimBatchId: claimBatch1.id,
      amount: 15000,
      submittedAt: new Date(),
    },
  });

  // Create claim status
  await prisma.claimStatus.create({
    data: {
      claimId: claim1.id,
      status: 'SUBMITTED',
      changedAt: new Date(),
    },
  });

  // Create claim submissions
  await prisma.claimSubmission.create({
    data: {
      claimId: claim1.id,
      submittedAt: new Date(),
      details: 'Submitted to NHIF',
    },
  });

  // Create NHIF benefits
  const inpatientBenefit = await prisma.nHIFBenefit.create({
    data: {
      name: 'Inpatient Services',
      description: 'Coverage for inpatient hospital services',
    },
  });

  // Create NHIF claims
  const nhifClaim1 = await prisma.nHIFClaim.create({
    data: {
      patientId: patient1.id,
      nhifBenefitId: inpatientBenefit.id,
      amount: 10000,
      submittedAt: new Date(),
    },
  });

  // Create NHIF submissions
  await prisma.nHIFSubmission.create({
    data: {
      nhifClaimId: nhifClaim1.id,
      submittedAt: new Date(),
      details: 'Submitted with supporting documents',
    },
  });

  // Create inventory items
  const syringeItem = await prisma.item.create({
    data: {
      name: 'Syringe 10ml',
      description: 'Disposable syringe 10ml',
    },
  });

  // Create inventory
  await prisma.inventory.create({
    data: {
      itemId: syringeItem.id,
      quantity: 500,
      location: 'Store Room A',
    },
  });

  // Create stock movements
  await prisma.stockMovement.create({
    data: {
      itemId: syringeItem.id,
      quantity: 100,
      movementType: 'RESTOCK',
      movedAt: new Date(),
    },
  });

  // Create expiry alerts
  await prisma.expiryAlert.create({
    data: {
      itemId: syringeItem.id,
      expiryDate: new Date('2024-06-30'),
      alertedAt: new Date(),
    },
  });

  // Create suppliers
  const medicalSupplier = await prisma.supplier.create({
    data: {
      name: 'MedEquip Kenya Ltd',
      contactInfo: 'sales@medequip.co.ke, +254722111222',
    },
  });

  // Create purchase orders
  const purchaseOrder1 = await prisma.purchaseOrder.create({
    data: {
      supplierId: medicalSupplier.id,
      orderDate: new Date(),
      totalAmount: 50000,
    },
  });

  // Create goods received notes
  await prisma.goodsReceivedNote.create({
    data: {
      purchaseOrderId: purchaseOrder1.id,
      receivedAt: new Date(),
      details: 'Received 500 syringes',
    },
  });

  // Create substores
  const mainSubstore = await prisma.substore.create({
    data: {
      name: 'Main Store',
      location: 'Basement',
    },
  });

  const pediatricSubstore = await prisma.substore.create({
    data: {
      name: 'Pediatric Store',
      location: 'Pediatric Ward',
    },
  });

  // Create substore transfers
  await prisma.substoreTransfer.create({
    data: {
      fromSubstoreId: mainSubstore.id,
      toSubstoreId: pediatricSubstore.id,
      itemId: syringeItem.id,
      quantity: 50,
      transferredAt: new Date(),
    },
  });

  // Create requisitions
  await prisma.requisition.create({
    data: {
      substoreId: pediatricSubstore.id,
      itemId: syringeItem.id,
      quantity: 20,
      requestedAt: new Date(),
    },
  });

  // Create fixed assets
  const xrayMachine = await prisma.fixedAsset.create({
    data: {
      name: 'X-ray Machine',
      purchaseDate: new Date('2020-01-15'),
      cost: 5000000,
    },
  });

  // Create depreciation schedules
  await prisma.depreciationSchedule.create({
    data: {
      fixedAssetId: xrayMachine.id,
      depreciationDate: new Date('2021-01-15'),
      amount: 500000, // 10% depreciation
    },
  });

  // Create asset audits
  await prisma.assetAudit.create({
    data: {
      fixedAssetId: xrayMachine.id,
      auditDate: new Date(),
      findings: 'Machine in good condition, calibration needed in 6 months',
    },
  });

  // Create report templates
  const financialReportTemplate = await prisma.reportTemplate.create({
    data: {
      name: 'Monthly Financial Report',
      description: 'Summary of monthly financial performance',
    },
  });

  // Create reports
  await prisma.report.create({
    data: {
      reportTemplateId: financialReportTemplate.id,
      generatedAt: new Date(),
    },
  });

  // Create report schedules
  await prisma.reportSchedule.create({
    data: {
      reportTemplateId: financialReportTemplate.id,
      scheduleDate: new Date(Date.now() + 30 * 86400000), // 30 days from now
    },
  });

  // Create custom reports
  const patientReport = await prisma.customReport.create({
    data: {
      name: 'Patient Demographics',
      description: 'Report on patient demographics',
    },
  });

  // Create report fields
  await prisma.reportField.createMany({
    data: [
      {
        customReportId: patientReport.id,
        fieldName: 'Patient Name',
        fieldType: 'STRING',
      },
      {
        customReportId: patientReport.id,
        fieldName: 'Age',
        fieldType: 'NUMBER',
      },
    ],
  });

  // Create report filters
  await prisma.reportFilter.create({
    data: {
      customReportId: patientReport.id,
      filterName: 'Gender',
      filterValue: 'Male',
    },
  });

  // Create referral sources
  const selfReferral = await prisma.referralSource.create({
    data: {
      name: 'Self',
      description: 'Patient self-referral',
    },
  });

  const clinicReferral = await prisma.referralSource.create({
    data: {
      name: 'Local Clinic',
      description: 'Referral from local health clinic',
    },
  });

  // Create referring doctors
  const referringDoctor1 = await prisma.referringDoctor.create({
    data: {
      firstName: 'James',
      lastName: 'Wilson',
      email: 'james.wilson@clinic.com',
      phone: '+254722333444',
    },
  });

  // Create referrals
  await prisma.referral.createMany({
    data: [
      {
        patientId: patient1.id,
        referralSourceId: selfReferral.id,
        referralDate: new Date(),
      },
      {
        patientId: patient2.id,
        referringDoctorId: referringDoctor1.id,
        referralSourceId: clinicReferral.id,
        referralDate: new Date(),
      },
    ],
  });

  // Create dashboard stats
  await prisma.dashboardStats.createMany({
    data: [
      {
        name: 'Patient Admissions',
        value: 42,
        period: 'WEEKLY',
      },
      {
        name: 'Average Wait Time',
        value: 15.5,
        period: 'DAILY',
      },
    ],
  });

  // Create KPIs
  await prisma.kPI.createMany({
    data: [
      {
        name: 'Patient Satisfaction',
        target: 90,
        currentValue: 85,
        period: 'MONTHLY',
      },
      {
        name: 'Bed Occupancy Rate',
        target: 80,
        currentValue: 75,
        period: 'WEEKLY',
      },
    ],
  });

  // Create notifications
  await prisma.notification.createMany({
    data: [
      {
        message: 'System maintenance scheduled for tonight',
        type: 'SYSTEM',
        priority: 'MEDIUM',
      },
      {
        message: 'New lab results available for Patient #123',
        type: 'PATIENT',
        priority: 'HIGH',
      },
    ],
  });

  // Create widgets
  const stats = await prisma.dashboardStats.findFirst();
  if (stats) {
    await prisma.widget.create({
      data: {
        title: 'Patient Admissions',
        type: 'STATS',
        statsId: stats.id,
      },
    });
  }

  // Create homepage config
  const homepageConfig = await prisma.homepageConfig.create({
    data: {
      title: 'Welcome to Our Hospital',
      subtitle: 'Quality Care for All',
      theme: 'BLUE',
    },
  });

  // Create hero sections
  await prisma.heroSection.create({
    data: {
      homepageConfigId: homepageConfig.id,
      imageUrl: 'https://example.com/images/hospital.jpg',
      headline: 'Advanced Medical Care',
      subheadline: 'State-of-the-art facilities and expert staff',
    },
  });

  // Create news
  await prisma.news.createMany({
    data: [
      {
        title: 'New Pediatric Wing Opened',
        content: 'The hospital has opened a new pediatric wing with 50 additional beds.',
        publishedAt: new Date(),
      },
      {
        title: 'COVID-19 Vaccination Drive',
        content: 'Free vaccination for all staff and patients starting next week.',
        publishedAt: new Date(),
      },
    ],
  });

  // Create highlights
  await prisma.highlight.createMany({
    data: [
      {
        title: '24/7 Emergency Services',
        description: 'Our emergency department is open round the clock',
        imageUrl: 'https://example.com/images/emergency.jpg',
      },
      {
        title: 'Cardiac Care Unit',
        description: 'Advanced cardiac care with latest technology',
      },
    ],
  });

  // Create user logins
  const hashedPassword = await hash('password123', 12);
  
  await prisma.userLogin.createMany({
    data: [
      {
        email: 'patient1@example.com',
        passwordHash: hashedPassword,
      },
      {
        email: 'patient2@example.com',
        passwordHash: hashedPassword,
      },
    ],
  });

  // Create login attempts
  const userLogin = await prisma.userLogin.findFirst();
  if (userLogin) {
    await prisma.loginAttempt.create({
      data: {
        userLoginId: userLogin.id,
        ipAddress: '192.168.1.1',
        success: true,
      },
    });
  }

  // Create sessions
  if (userLogin) {
    await prisma.session.create({
      data: {
        userLoginId: userLogin.id,
        token: 'abc123xyz',
        expiresAt: new Date(Date.now() + 7 * 86400000), // 7 days from now
      },
    });
  }

  // Create user registrations
  await prisma.userRegistration.createMany({
    data: [
      {
        email: 'new.patient@example.com',
        firstName: 'New',
        lastName: 'Patient',
        passwordHash: hashedPassword,
      },
    ],
  });

  // Create email verification tokens
  const userRegistration = await prisma.userRegistration.findFirst();
  if (userRegistration) {
    await prisma.emailVerificationToken.create({
      data: {
        userRegistrationId: userRegistration.id,
        token: 'verify123',
        expiresAt: new Date(Date.now() + 86400000), // Tomorrow
      },
    });
  }

  // Create patient support cases
  await prisma.patientSupportCase.create({
    data: {
      patientId: patient1.id,
      socialWorkerId: socialWorker.id,
      caseDetails: 'Patient needs assistance with transportation to follow-up appointments',
      status: 'OPEN',
    },
  });

  // Create incentive programs
  const performanceProgram = await prisma.incentiveProgram.create({
    data: {
      name: 'Performance Excellence',
      description: 'Rewards for outstanding performance',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-12-31'),
    },
  });

  // Create incentive records
  await prisma.incentiveRecord.create({
    data: {
      programId: performanceProgram.id,
      staffId: pediatricDoctor.id,
      staffType: 'DOCTOR',
      amount: 5000,
      awardedAt: new Date(),
    },
  });

console.log('✔ Database seeded successfully');
    return { clinicalDept, adminDept };
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

async function main() {
  try {
    await clearDatabase();
    await seedDatabase();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();