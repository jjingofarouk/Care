// seed.js
const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Generate UUIDs for patients first
  const patientIds = Array.from({ length: 10 }, () => uuidv4());

  // Seed Patients with Ugandan names
  const patients = [
    {
      id: patientIds[0],
      firstName: 'Elizabeth',
      lastName: 'Aber',
      dateOfBirth: new Date('1985-03-15'),
      gender: 'Female',
      phone: '+256701234567',
      email: 'elizabeth.aber@example.com',
    },
    {
      id: patientIds[1],
      firstName: 'Michael',
      lastName: 'Abaasa',
      dateOfBirth: new Date('1990-07-22'),
      gender: 'Male',
      phone: '+256702345678',
      email: 'michael.abaasa@example.com',
    },
    {
      id: patientIds[2],
      firstName: 'Robinah',
      lastName: 'Abamukama',
      dateOfBirth: new Date('1978-11-08'),
      gender: 'Female',
      phone: '+256703456789',
      email: 'robinah.abamukama@example.com',
    },
    {
      id: patientIds[3],
      firstName: 'Gideon',
      lastName: 'Ahimbisibwe',
      dateOfBirth: new Date('1995-09-12'),
      gender: 'Male',
      phone: '+256704567890',
      email: 'gideon.ahimbisibwe@example.com',
    },
    {
      id: patientIds[4],
      firstName: 'Rachael',
      lastName: 'Ainembabazi',
      dateOfBirth: new Date('1988-05-30'),
      gender: 'Female',
      phone: '+256705678901',
      email: 'rachael.ainembabazi@example.com',
    },
    {
      id: patientIds[5],
      firstName: 'Ambrose',
      lastName: 'Agona',
      dateOfBirth: new Date('1982-12-03'),
      gender: 'Male',
      phone: '+256706789012',
      email: 'ambrose.agona@example.com',
    },
    {
      id: patientIds[6],
      firstName: 'Barbra',
      lastName: 'Ainomugisha',
      dateOfBirth: new Date('1993-04-18'),
      gender: 'Female',
      phone: '+256707890123',
      email: 'barbra.ainomugisha@example.com',
    },
    {
      id: patientIds[7],
      firstName: 'Edward',
      lastName: 'Arinaitwe',
      dateOfBirth: new Date('1987-08-25'),
      gender: 'Male',
      phone: '+256708901234',
      email: 'edward.arinaitwe@example.com',
    },
    {
      id: patientIds[8],
      firstName: 'Joanita',
      lastName: 'Akampa',
      dateOfBirth: new Date('1991-01-14'),
      gender: 'Female',
      phone: '+256709012345',
      email: 'joanita.akampa@example.com',
    },
    {
      id: patientIds[9],
      firstName: 'Allan',
      lastName: 'Ayiekoh',
      dateOfBirth: new Date('1986-10-07'),
      gender: 'Male',
      phone: '+256700123456',
      email: 'allan.ayiekoh@example.com',
    },
  ];

  console.log('Seeding patients...');
  for (const patient of patients) {
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
      patientId: patientIds[0],
      street: 'Plot 15, Bukoto Street',
      city: 'Kampala',
      country: 'Uganda',
      postalCode: '00256',
    },
    {
      id: uuidv4(),
      patientId: patientIds[1],
      street: 'Masaka Road, Kibuye',
      city: 'Entebbe',
      country: 'Uganda',
      postalCode: '00256',
    },
    {
      id: uuidv4(),
      patientId: patientIds[2],
      street: 'Bombo Road, Kawempe',
      city: 'Kampala',
      country: 'Uganda',
      postalCode: '00256',
    },
    {
      id: uuidv4(),
      patientId: patientIds[3],
      street: 'Jinja Road, Nakawa',
      city: 'Kampala',
      country: 'Uganda',
      postalCode: '00256',
    },
    {
      id: uuidv4(),
      patientId: patientIds[4],
      street: 'Main Street, Mukono',
      city: 'Mukono',
      country: 'Uganda',
      postalCode: '00256',
    },
    {
      id: uuidv4(),
      patientId: patientIds[5],
      street: 'Gulu Road, Lira',
      city: 'Lira',
      country: 'Uganda',
      postalCode: '00256',
    },
    {
      id: uuidv4(),
      patientId: patientIds[6],
      street: 'Mbale Road, Soroti',
      city: 'Soroti',
      country: 'Uganda',
      postalCode: '00256',
    },
    {
      id: uuidv4(),
      patientId: patientIds[7],
      street: 'Mbarara Road, Masaka',
      city: 'Masaka',
      country: 'Uganda',
      postalCode: '00256',
    },
    {
      id: uuidv4(),
      patientId: patientIds[8],
      street: 'Fort Portal Road, Kasese',
      city: 'Kasese',
      country: 'Uganda',
      postalCode: '00256',
    },
    {
      id: uuidv4(),
      patientId: patientIds[9],
      street: 'Kabale Road, Mbarara',
      city: 'Mbarara',
      country: 'Uganda',
      postalCode: '00256',
    },
  ];

  console.log('Seeding patient addresses...');
  for (const address of addresses) {
    try {
      await prisma.patientAddress.upsert({
        where: { id: address.id },
        update: {},
        create: address,
      });
      console.log(`Created address for patient in: ${address.city}`);
    } catch (error) {
      console.error(`Error creating address for patient ${address.patientId}:`, error.message);
    }
  }

  // Seed Next of Kin with Ugandan names
  const nextOfKins = [
    {
      id: uuidv4(),
      patientId: patientIds[0],
      firstName: 'Charles',
      lastName: 'Bukomeko',
      relationship: 'Father',
      phone: '+256711234567',
      email: 'charles.bukomeko@example.com',
    },
    {
      id: uuidv4(),
      patientId: patientIds[1],
      firstName: 'Sheba',
      lastName: 'Babirye',
      relationship: 'Wife',
      phone: '+256712345678',
      email: 'sheba.babirye@example.com',
    },
    {
      id: uuidv4(),
      patientId: patientIds[2],
      firstName: 'Daniel',
      lastName: 'Mugabe',
      relationship: 'Husband',
      phone: '+256713456789',
      email: 'daniel.mugabe@example.com',
    },
    {
      id: uuidv4(),
      patientId: patientIds[3],
      firstName: 'Cynthia',
      lastName: 'Letaru',
      relationship: 'Sister',
      phone: '+256714567890',
      email: 'cynthia.letaru@example.com',
    },
    {
      id: uuidv4(),
      patientId: patientIds[4],
      firstName: 'Fred',
      lastName: 'Dratia',
      relationship: 'Brother',
      phone: '+256715678901',
      email: 'fred.dratia@example.com',
    },
    {
      id: uuidv4(),
      patientId: patientIds[5],
      firstName: 'Esther',
      lastName: 'Nalwoga',
      relationship: 'Daughter',
      phone: '+256716789012',
      email: 'esther.nalwoga@example.com',
    },
    {
      id: uuidv4(),
      patientId: patientIds[6],
      firstName: 'Mark',
      lastName: 'Ishimwe',
      relationship: 'Father',
      phone: '+256717890123',
      email: 'mark.ishimwe@example.com',
    },
    {
      id: uuidv4(),
      patientId: patientIds[7],
      firstName: 'Farouk',
      lastName: 'Jjingo',
      relationship: 'Brother',
      phone: '+256718901234',
      email: 'farouk.jjingo@example.com',
    },
    {
      id: uuidv4(),
      patientId: patientIds[8],
      firstName: 'Ismail',
      lastName: 'Jjuuko',
      relationship: 'Husband',
      phone: '+256719012345',
      email: 'ismail.jjuuko@example.com',
    },
    {
      id: uuidv4(),
      patientId: patientIds[9],
      firstName: 'Joshua',
wamy: 'Opio',
      lastName: 'Ekwamu',
      relationship: 'Father',
      phone: '+256710123456',
      email: 'joshua.opio@example.com',
    },
  ];

  console.log('Seeding next of kin...');
  for (const nok of nextOfKins) {
    try {
      await prisma.nextOfKin.upsert({
        where: { patientId: nok.patientId },
        update: {},
        create: nok,
      });
      console.log(`Created next of kin for patient: ${nok.firstName} ${nok.lastName}`);
    } catch (error) {
      console.error(`Error creating next of kin for patient ${nok.patientId}:`, error.message);
    }
  }

  // Seed Insurance Info with Ugandan insurance providers
  const insuranceInfos = [
    {
      id: uuidv4(),
      patientId: patientIds[0],
      provider: 'UAP Old Mutual',
      policyNumber: 'UAP123456',
      expiryDate: new Date('2026-12-31'),
    },
    {
      id: uuidv4(),
      patientId: patientIds[1],
      provider: 'Jubilee Insurance',
      policyNumber: 'JUB789012',
      expiryDate: new Date('2027-06-30'),
    },
    {
      id: uuidv4(),
      patientId: patientIds[2],
      provider: 'AIG Uganda',
      policyNumber: 'AIG456789',
      expiryDate: new Date('2026-08-15'),
    },
    {
      id: uuidv4(),
      patientId: patientIds[3],
      provider: 'Stanbic General Insurance',
      policyNumber: 'STA987654',
      expiryDate: new Date('2027-03-20'),
    },
    {
      id: uuidv4(),
      patientId: patientIds[4],
      provider: 'National Insurance Corporation',
      policyNumber: 'NIC234567',
      expiryDate: new Date('2026-11-10'),
    },
    {
      id: uuidv4(),
      patientId: patientIds[5],
      provider: 'Goldstar Insurance',
      policyNumber: 'GSI345678',
      expiryDate: new Date('2027-01-25'),
    },
    {
      id: uuidv4(),
      patientId: patientIds[6],
      provider: 'ICEA LION',
      policyNumber: 'ICE567890',
      expiryDate: new Date('2026-09-05'),
    },
    {
      id: uuidv4(),
      patientId: patientIds[7],
      provider: 'Orient Insurance',
      policyNumber: 'ORI678901',
      expiryDate: new Date('2027-04-12'),
    },
    {
      id: uuidv4(),
      patientId: patientIds[8],
      provider: 'Prudential Uganda',
      policyNumber: 'PRU789012',
      expiryDate: new Date('2026-07-18'),
    },
    {
      id: uuidv4(),
      patientId: patientIds[9],
      provider: 'Chartis Uganda',
      policyNumber: 'CHA890123',
      expiryDate: new Date('2027-02-28'),
    },
  ];

  console.log('Seeding insurance information...');
  for (const insurance of insuranceInfos) {
    try {
      await prisma.insuranceInfo.upsert({
        where: { patientId: insurance.patientId },
        update: {},
        create: insurance,
      });
      console.log(`Created insurance info for patient with provider: ${insurance.provider}`);
    } catch (error) {
      console.error(`Error creating insurance info for patient ${insurance.patientId}:`, error.message);
    }
  }

  console.log('Database seeding completed successfully!');
  console.log(`Total patients created: ${patients.length}`);
  console.log(`Total addresses created: ${addresses.length}`);
  console.log(`Total next of kin created: ${nextOfKins.length}`);
  console.log(`Total insurance records created: ${insuranceInfos.length}`);
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