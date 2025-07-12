const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function main() {
  // Seed Patients
  const patients = [
    {
      id: uuidv4(),
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1985-06-15'),
      gender: 'Male',
      phone: '+254700123456',
      email: 'john.doe@example.com',
    },
    {
      id: uuidv4(),
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: new Date('1990-03-22'),
      gender: 'Female',
      phone: '+254700654321',
      email: 'jane.smith@example.com',
    },
  ];

  for (const patient of patients) {
    await prisma.patient.upsert({
      where: { email: patient.email },
      update: {},
      create: patient,
    });
  }

  // Seed Patient Addresses
  const addresses = [
    {
      id: uuidv4(),
      patientId: patients[0].id,
      street: '123 Main St',
      city: 'Nairobi',
      country: 'Kenya',
      postalCode: '00100',
    },
    {
      id: uuidv4(),
      patientId: patients[1].id,
      street: '456 Park Ave',
      city: 'Mombasa',
      country: 'Kenya',
      postalCode: '80100',
    },
  ];

  for (const address of addresses) {
    await prisma.patientAddress.upsert({
      where: { id: address.id },
      update: {},
      create: address,
    });
  }

  // Seed Next of Kin
  const nextOfKins = [
    {
      id: uuidv4(),
      patientId: patients[0].id,
      firstName: 'Mary',
      lastName: 'Doe',
      relationship: 'Spouse',
      phone: '+254700789123',
      email: 'mary.doe@example.com',
    },
    {
      id: uuidv4(),
      patientId: patients[1].id,
      firstName: 'James',
      lastName: 'Smith',
      relationship: 'Brother',
      phone: '+254700321987',
      email: 'james.smith@example.com',
    },
  ];

  for (const nok of nextOfKins) {
    await prisma.nextOfKin.upsert({
      where: { patientId: nok.patientId },
      update: {},
      create: nok,
    });
  }

  // Seed Insurance Info
  const insuranceInfos = [
    {
      id: uuidv4(),
      patientId: patients[0].id,
      provider: 'NHIF',
      policyNumber: 'NHIF123456',
      expiryDate: new Date('2026-12-31'),
    },
    {
      id: uuidv4(),
      patientId: patients[1].id,
      provider: 'AAR',
      policyNumber: 'AAR789012',
      expiryDate: new Date('2027-06-30'),
    },
  ];

  for (const insurance of insuranceInfos) {
    await prisma.insuranceInfo.upsert({
      where: { patientId: insurance.patientId },
      update: {},
      create: insurance,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });