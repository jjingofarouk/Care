const fs = require('fs').promises;
const path = require('path');

async function buildSchema() {
  const modulesDir = path.join(__dirname, 'modules');
  const outputFile = path.join(__dirname, 'schema.prisma');

  const moduleFiles = [
    'dashboard.prisma',
    'home.prisma',
    'login.prisma',
    'register.prisma',
    'doctor.prisma',
    'nursing.prisma',
    'system-admin.prisma',
    'social-service.prisma',
    'incentive.prisma',
    'patients.prisma',
    'medical-records.prisma',
    'adt.prisma',
    'queue-mgmt.prisma',
    'clinical.prisma',
    'appointments.prisma',
    'emergency.prisma',
    'maternity.prisma',
    'vaccination.prisma',
    'operation-theatre.prisma',
    'laboratory.prisma',
    'radiology.prisma',
    'pharmacy.prisma',
    'dispensary.prisma',
    'cssd.prisma',
    'helpdesk.prisma',
    'utilities.prisma',
    'settings.prisma',
    'verification.prisma',
    'billing.prisma',
    'accounting.prisma',
    'claim-mgmt.prisma',
    'nhif.prisma',
    'inventory.prisma',
    'procurement.prisma',
    'substore.prisma',
    'fixed-assets.prisma',
    'departments.prisma',
    'reports.prisma',
    'dynamic-report.prisma',
    'mkt-referral.prisma'
  ];

  const header = `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
`;

  let schemaContent = header;

  for (const file of moduleFiles) {
    const filePath = path.join(modulesDir, file);
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      schemaContent += `\n// ${file}\n${content}\n`;
    } catch (error) {
      console.error(`Error reading ${file}:`, error);
    }
  }

  await fs.writeFile(outputFile, schemaContent);
  console.log('Schema built successfully:', outputFile);
}

buildSchema().catch(console.error);