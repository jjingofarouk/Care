// seed.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seed() {
  const vaccines = [
    { id: 'Cholera', name: 'Cholera', description: 'Cholera vaccine' },
    { id: 'COVID-19', name: 'COVID-19', description: 'Coronavirus disease vaccine' },
    { id: 'Dengue', name: 'Dengue', description: 'Dengue fever vaccine' },
    { id: 'Diphtheria', name: 'Diphtheria', description: 'Diphtheria vaccine' },
    { id: 'Hepatitis', name: 'Hepatitis', description: 'Hepatitis vaccine (A, B, E)' },
    { id: 'Hib', name: 'Hib', description: 'Haemophilus influenzae type b vaccine' },
    { id: 'HPV', name: 'HPV', description: 'Human Papillomavirus vaccine' },
    { id: 'Influenza', name: 'Influenza', description: 'Seasonal influenza vaccine' },
    { id: 'JapEnceph', name: 'Japanese Encephalitis', description: 'Japanese encephalitis vaccine' },
    { id: 'Malaria', name: 'Malaria', description: 'Malaria vaccine (e.g., RTS,S/AS01)' },
    { id: 'Measles', name: 'Measles', description: 'Measles vaccine' },
    { id: 'MenMeningitis', name: 'Meningococcal Meningitis', description: 'Meningococcal meningitis vaccine' },
    { id: 'Mumps', name: 'Mumps', description: 'Mumps vaccine' },
    { id: 'Pertussis', name: 'Pertussis', description: 'Pertussis vaccine' },
    { id: 'Pneumococcal', name: 'Pneumococcal Disease', description: 'Pneumococcal disease vaccine' },
    { id: 'Polio', name: 'Poliomyelitis', description: 'Poliomyelitis vaccine (OPV/IPV)' },
    { id: 'Rabies', name: 'Rabies', description: 'Rabies vaccine' },
    { id: 'Rotavirus', name: 'Rotavirus', description: 'Rotavirus vaccine' },
    { id: 'Rubella', name: 'Rubella', description: 'Rubella vaccine' },
    { id: 'SmallpoxMpox', name: 'Smallpox and Mpox', description: 'Smallpox and mpox vaccine' },
    { id: 'Tetanus', name: 'Tetanus', description: 'Tetanus vaccine' },
    { id: 'TBE', name: 'Tick-borne Encephalitis', description: 'Tick-borne encephalitis vaccine' },
    { id: 'Tuberculosis', name: 'Tuberculosis', description: 'Tuberculosis vaccine (BCG)' },
    { id: 'Typhoid', name: 'Typhoid', description: 'Typhoid fever vaccine' },
    { id: 'Varicella', name: 'Varicella', description: 'Chickenpox vaccine' },
    { id: 'YellowFever', name: 'Yellow Fever', description: 'Yellow fever vaccine' },
    { id: 'Chikungunya', name: 'Chikungunya', description: 'Chikungunya vaccine (pipeline)' },
    { id: 'ETEC', name: 'Enterotoxigenic Escherichia coli', description: 'Enterotoxigenic Escherichia coli vaccine (pipeline)' },
    { id: 'GAS', name: 'Group A Streptococcus', description: 'Group A Streptococcus vaccine (pipeline)' },
    { id: 'GBS', name: 'Group B Streptococcus', description: 'Group B Streptococcus vaccine (pipeline)' },
    { id: 'HSV', name: 'Herpes Simplex Virus', description: 'Herpes Simplex Virus vaccine (pipeline)' },
    { id: 'HIV-1', name: 'HIV-1', description: 'HIV-1 vaccine (pipeline)' },
    { id: 'ImprovedInfluenza', name: 'Improved Influenza', description: 'Improved influenza vaccines (pipeline)' },
    { id: 'NeisseriaGonorrhoeae', name: 'Neisseria gonorrhoeae', description: 'Neisseria gonorrhoeae vaccine (pipeline)' },
    { id: 'NontyphoidalSalmonella', name: 'Nontyphoidal Salmonella', description: 'Nontyphoidal Salmonella disease vaccine (pipeline)' },
    { id: 'Norovirus', name: 'Norovirus', description: 'Norovirus vaccine (pipeline)' },
    { id: 'Paratyphoid', name: 'Paratyphoid Fever', description: 'Paratyphoid fever vaccine (pipeline)' },
    { id: 'RSV', name: 'Respiratory Syncytial Virus', description: 'Respiratory Syncytial Virus vaccine (pipeline)' },
    { id: 'Schistosomiasis', name: 'Schistosomiasis', description: 'Schistosomiasis disease vaccine (pipeline)' },
    { id: 'Shigella', name: 'Shigella', description: 'Shigella vaccine (pipeline)' },
  ];

  const schedules = [
    { id: '10001', name: 'Childhood Schedule', description: 'Standard childhood immunization schedule' },
    { id: '10002', name: 'Adult Schedule', description: 'Standard adult immunization schedule' },
    { id: '10003', name: 'Travel Schedule', description: 'Immunization schedule for travelers' },
  ];

  function generateRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  function generateFiveDigitId() {
    return Math.floor(10000 + Math.random() * 90000).toString();
  }

  try {
    // Seed vaccines
    await prisma.vaccine.createMany({
      data: vaccines,
      skipDuplicates: true,
    });

    // Seed immunization schedules
    await prisma.immunizationSchedule.createMany({
      data: schedules,
      skipDuplicates: true,
    });

    // Fetch all patients
    const patients = await prisma.patient.findMany();
    if (patients.length < 2000) {
      throw new Error('Not enough patients in the database');
    }

    // Randomly select 2000 patients
    const selectedPatients = patients.sort(() => 0.5 - Math.random()).slice(0, 2000);

    // Generate vaccination records
    const vaccinationRecords = [];
    for (const patient of selectedPatients) {
      const numRecords = Math.floor(Math.random() * 3) + 1; // 1-3 records per patient
      for (let i = 0; i < numRecords; i++) {
        const vaccine = vaccines[Math.floor(Math.random() * vaccines.length)];
        const schedule = schedules[Math.floor(Math.random() * schedules.length)];
        vaccinationRecords.push({
          id: generateFiveDigitId(),
          patientId: patient.id,
          vaccineId: vaccine.id,
          immunizationScheduleId: schedule.id,
          administeredDate: generateRandomDate(new Date('2020-01-01'), new Date('2025-07-16')),
        });
      }
    }

    // Seed vaccination records
    await prisma.vaccinationRecord.createMany({
      data: vaccinationRecords,
      skipDuplicates: true,
    });

    console.log('Vaccines, schedules, and vaccination records seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();