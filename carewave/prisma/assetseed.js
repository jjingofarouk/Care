const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Helper function to generate meaningful IDs
function generateMeaningfulId(name, index) {
  const cleanName = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 10);
  return `${cleanName}_${String(index).padStart(3, '0')}`;
}

// Helper function to generate audit findings
function generateAuditFindings(assetName, auditNumber) {
  const findings = [
    `Routine inspection completed - ${assetName} in good condition`,
    `Minor maintenance required for ${assetName}`,
    `Calibration check passed for ${assetName}`,
    `Preventive maintenance performed on ${assetName}`,
    `Annual safety inspection completed for ${assetName}`,
    `Software update applied to ${assetName}`,
    `Cleaning and disinfection verified for ${assetName}`,
    `Performance test successful for ${assetName}`,
    `Documentation updated for ${assetName}`,
    `Compliance check passed for ${assetName}`
  ];
  
  return findings[auditNumber % findings.length];
}

async function main() {
  console.log('Starting hospital asset seeding...');

  const assets = [
    // Radiology Department
    { name: 'MRI Scanner', category: 'RADIOLOGY', baseId: 'mri' },
    { name: 'CT Scanner', category: 'RADIOLOGY', baseId: 'ct' },
    { name: 'X-Ray Machine', category: 'RADIOLOGY', baseId: 'xray' },
    { name: 'Ultrasound Machine', category: 'RADIOLOGY', baseId: 'ultrasound' },
    { name: 'Portable X-Ray', category: 'RADIOLOGY', baseId: 'portxray' },
    { name: 'C-Arm', category: 'RADIOLOGY', baseId: 'carm' },
    { name: 'Mammography Unit', category: 'RADIOLOGY', baseId: 'mammo' },
    { name: 'Fluoroscopy Machine', category: 'RADIOLOGY', baseId: 'fluoro' },
    { name: 'Bone Densitometer', category: 'RADIOLOGY', baseId: 'bonedx' },
    { name: 'PET Scanner', category: 'RADIOLOGY', baseId: 'pet' },
    { name: 'SPECT Scanner', category: 'RADIOLOGY', baseId: 'spect' },
    { name: 'Angiography System', category: 'RADIOLOGY', baseId: 'angio' },

    // Operating Theatre
    { name: 'Operating Table', category: 'SURGERY', baseId: 'optable' },
    { name: 'Surgical Light', category: 'SURGERY', baseId: 'surglight' },
    { name: 'Anesthesia Machine', category: 'SURGERY', baseId: 'anesth' },
    { name: 'Surgical Microscope', category: 'SURGERY', baseId: 'surgmicro' },
    { name: 'Laparoscopy Tower', category: 'SURGERY', baseId: 'laparo' },
    { name: 'Endoscopy System', category: 'SURGERY', baseId: 'endoscopy' },
    { name: 'Electrocautery Unit', category: 'SURGERY', baseId: 'electro' },
    { name: 'Surgical Navigation System', category: 'SURGERY', baseId: 'surgnav' },
    { name: 'Orthopedic Drill', category: 'SURGERY', baseId: 'orthodrill' },
    { name: 'Sterile Processing Unit', category: 'SURGERY', baseId: 'sterile' },
    { name: 'Operating Room Ventilator', category: 'SURGERY', baseId: 'orvent' },

    // Intensive Care Unit
    { name: 'Ventilator', category: 'ICU', baseId: 'vent' },
    { name: 'Patient Monitor', category: 'ICU', baseId: 'monitor' },
    { name: 'Infusion Pump', category: 'ICU', baseId: 'infusion' },
    { name: 'Defibrillator', category: 'ICU', baseId: 'defib' },
    { name: 'Hemodynamic Monitor', category: 'ICU', baseId: 'hemomon' },
    { name: 'Intra-Aortic Balloon Pump', category: 'ICU', baseId: 'iabp' },
    { name: 'ECMO Machine', category: 'ICU', baseId: 'ecmo' },
    { name: 'CRRT Machine', category: 'ICU', baseId: 'crrt' },
    { name: 'Syringe Pump', category: 'ICU', baseId: 'syrpump' },
    { name: 'Vital Signs Monitor', category: 'ICU', baseId: 'vitals' },

    // Emergency Department
    { name: 'ECG Machine', category: 'EMERGENCY', baseId: 'ecg' },
    { name: 'Portable Defibrillator', category: 'EMERGENCY', baseId: 'portdefib' },
    { name: 'Trauma Stretcher', category: 'EMERGENCY', baseId: 'trauma' },
    { name: 'Emergency Ultrasound', category: 'EMERGENCY', baseId: 'emgultra' },
    { name: 'Resuscitation Cart', category: 'EMERGENCY', baseId: 'rescart' },
    { name: 'Portable Ventilator', category: 'EMERGENCY', baseId: 'portvent' },
    { name: 'Suction Machine', category: 'EMERGENCY', baseId: 'suction' },
    { name: 'Pulse Oximeter', category: 'EMERGENCY', baseId: 'pulseox' },
    { name: 'Laryngoscope', category: 'EMERGENCY', baseId: 'laryngo' },

    // Laboratory
    { name: 'Hematology Analyzer', category: 'LABORATORY', baseId: 'hemato' },
    { name: 'Chemistry Analyzer', category: 'LABORATORY', baseId: 'chem' },
    { name: 'Blood Gas Analyzer', category: 'LABORATORY', baseId: 'bloodgas' },
    { name: 'Coagulation Analyzer', category: 'LABORATORY', baseId: 'coag' },
    { name: 'Microscope', category: 'LABORATORY', baseId: 'micro' },
    { name: 'Centrifuge', category: 'LABORATORY', baseId: 'centri' },
    { name: 'PCR Machine', category: 'LABORATORY', baseId: 'pcr' },
    { name: 'Flow Cytometer', category: 'LABORATORY', baseId: 'flowcyto' },
    { name: 'Electrolyte Analyzer', category: 'LABORATORY', baseId: 'electro' },
    { name: 'Immunoassay Analyzer', category: 'LABORATORY', baseId: 'immuno' },

    // Additional departments with meaningful categories
    { name: 'Incubator', category: 'NICU', baseId: 'incubator' },
    { name: 'Infant Warmer', category: 'NICU', baseId: 'warmer' },
    { name: 'Phototherapy Unit', category: 'NICU', baseId: 'photo' },
    { name: 'Dialysis Machine', category: 'DIALYSIS', baseId: 'dialysis' },
    { name: 'Autoclave', category: 'STERILIZATION', baseId: 'autoclave' },
    { name: 'Hospital Bed', category: 'GENERAL', baseId: 'bed' },
    { name: 'Wheelchair', category: 'GENERAL', baseId: 'wheelchair' }
  ];

  let totalAssetsCreated = 0;
  let totalSchedulesCreated = 0;
  let totalAuditsCreated = 0;

  for (const asset of assets) {
    const numDuplicates = Math.floor(Math.random() * 4) + 1; // 1 to 4 duplicates
    
    for (let i = 1; i <= numDuplicates; i++) {
      const assetId = `${asset.baseId}_${String(i).padStart(3, '0')}`;
      const assetName = numDuplicates === 1 ? asset.name : `${asset.name} ${i}`;
      
      // Generate realistic cost based on asset type
      let costRange;
      switch (asset.category) {
        case 'RADIOLOGY':
          costRange = { min: 50000, max: 2000000 };
          break;
        case 'SURGERY':
          costRange = { min: 10000, max: 500000 };
          break;
        case 'ICU':
          costRange = { min: 5000, max: 200000 };
          break;
        case 'LABORATORY':
          costRange = { min: 3000, max: 150000 };
          break;
        default:
          costRange = { min: 1000, max: 50000 };
      }
      
      const cost = Math.floor(Math.random() * (costRange.max - costRange.min + 1)) + costRange.min;
      
      // Generate purchase date within last 5 years
      const purchaseDate = new Date(
        Date.now() - Math.floor(Math.random() * 5 * 365 * 24 * 60 * 60 * 1000)
      );

      try {
        const fixedAsset = await prisma.fixedAsset.create({
          data: {
            id: assetId,
            name: assetName,
            purchaseDate,
            cost
          }
        });

        totalAssetsCreated++;

        // Create Depreciation Schedules (3-10 years)
        const depreciationYears = Math.floor(Math.random() * 8) + 3; // 3 to 10 years
        const annualDepreciation = cost / depreciationYears;
        
        for (let j = 0; j < depreciationYears; j++) {
          const scheduleId = `${assetId}_dep_${String(j + 1).padStart(2, '0')}`;
          const depreciationDate = new Date(purchaseDate.getTime() + (j + 1) * 365 * 24 * 60 * 60 * 1000);
          
          await prisma.depreciationSchedule.create({
            data: {
              id: scheduleId,
              fixedAssetId: fixedAsset.id,
              depreciationDate,
              amount: annualDepreciation
            }
          });
          
          totalSchedulesCreated++;
        }

        // Create Asset Audits (quarterly or semi-annually)
        const monthsSincePurchase = Math.floor((Date.now() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
        const auditInterval = Math.random() > 0.5 ? 6 : 3; // 6 months or 3 months
        const auditCount = Math.floor(monthsSincePurchase / auditInterval);
        
        for (let k = 0; k < Math.min(auditCount, 10); k++) { // Limit to 10 audits max
          const auditId = `${assetId}_aud_${String(k + 1).padStart(2, '0')}`;
          const auditDate = new Date(purchaseDate.getTime() + k * auditInterval * 30 * 24 * 60 * 60 * 1000);
          
          await prisma.assetAudit.create({
            data: {
              id: auditId,
              fixedAssetId: fixedAsset.id,
              auditDate,
              findings: generateAuditFindings(assetName, k)
            }
          });
          
          totalAuditsCreated++;
        }

      } catch (error) {
        console.error(`Error creating asset ${assetName}:`, error);
      }
    }
  }

  console.log('Seeding completed successfully!');
  console.log(`Total assets created: ${totalAssetsCreated}`);
  console.log(`Total depreciation schedules created: ${totalSchedulesCreated}`);
  console.log(`Total audits created: ${totalAuditsCreated}`);
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });