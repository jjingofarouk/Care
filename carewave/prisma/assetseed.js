import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  const assets = [
    // Radiology Department
    { name: 'MRI Scanner' },
    { name: 'CT Scanner' },
    { name: 'X-Ray Machine' },
    { name: 'Ultrasound Machine' },
    { name: 'Portable X-Ray' },
    { name: 'C-Arm' },
    { name: 'Mammography Unit' },
    { name: 'Fluoroscopy Machine' },
    { name: 'Bone Densitometer' },
    { name: 'PET Scanner' },
    { name: 'SPECT Scanner' },
    { name: 'Angiography System' },

    // Operating Theatre
    { name: 'Operating Table' },
    { name: 'Surgical Light' },
    { name: 'Anesthesia Machine' },
    { name: 'Surgical Microscope' },
    { name: 'Laparoscopy Tower' },
    { name: 'Endoscopy System' },
    { name: 'Electrocautery Unit' },
    { name: 'Surgical Navigation System' },
    { name: 'Orthopedic Drill' },
    { name: 'Sterile Processing Unit' },
    { name: 'Operating Room Ventilator' },

    // Intensive Care Unit
    { name: 'Ventilator' },
    { name: 'Patient Monitor' },
    { name: 'Infusion Pump' },
    { name: 'Defibrillator' },
    { name: 'Hemodynamic Monitor' },
    { name: 'Intra-Aortic Balloon Pump' },
    { name: 'ECMO Machine' },
    { name: 'CRRT Machine' },
    { name: 'Syringe Pump' },
    { name: 'Vital Signs Monitor' },

    // Emergency Department
    { name: 'ECG Machine' },
    { name: 'Portable Defibrillator' },
    { name: 'Trauma Stretcher' },
    { name: 'Emergency Ultrasound' },
    { name: 'Resuscitation Cart' },
    { name: 'Portable Ventilator' },
    { name: 'Suction Machine' },
    { name: 'Pulse Oximeter' },
    { name: 'Laryngoscope' },

    // Laboratory
    { name: 'Hematology Analyzer' },
    { name: 'Chemistry Analyzer' },
    { name: 'Blood Gas Analyzer' },
    { name: 'Coagulation Analyzer' },
    { name: 'Microscope' },
    { name: 'Centrifuge' },
    { name: 'PCR Machine' },
    { name: 'Flow Cytometer' },
    { name: 'Electrolyte Analyzer' },
    { name: 'Immunoassay Analyzer' },

    // Neonatal Intensive Care Unit
    { name: 'Incubator' },
    { name: 'Infant Warmer' },
    { name: 'Phototherapy Unit' },
    { name: 'Neonatal Ventilator' },
    { name: 'Neonatal Monitor' },
    { name: 'Bilirubin Meter' },
    { name: 'Apnea Monitor' },
    { name: 'Neonatal Resuscitator' },

    // Cardiology Department
    { name: 'Echocardiography Machine' },
    { name: 'Stress Test System' },
    { name: 'Holter Monitor' },
    { name: 'Cardiac Catheterization Lab' },
    { name: 'Pacemaker Programmer' },
    { name: 'Electrophysiology System' },

    // General Ward
    { name: 'Hospital Bed' },
    { name: 'Wheelchair' },
    { name: 'Examination Table' },
    { name: 'Overbed Table' },
    { name: 'Patient Lift' },
    { name: 'IV Pole' },
    { name: 'Medical Cart' },
    { name: 'Bedside Cabinet' },

    // Dialysis Unit
    { name: 'Dialysis Machine' },
    { name: 'Water Treatment System' },
    { name: 'Dialysis Chair' },

    // Sterilization Department
    { name: 'Autoclave' },
    { name: 'Sterilizer' },
    { name: 'Ultrasonic Cleaner' },
    { name: 'Plasma Sterilizer' },

    // Physical Therapy
    { name: 'Traction Table' },
    { name: 'Ultrasound Therapy Unit' },
    { name: 'TENS Machine' },
    { name: 'Exercise Bike' },
    { name: 'Parallel Bars' },
    { name: 'Hydrotherapy Tank' },

    // Oncology Department
    { name: 'Linear Accelerator' },
    { name: 'Brachytherapy Unit' },
    { name: 'Chemotherapy Infusion Pump' },
    { name: 'Radiation Therapy Simulator' },

    // Pharmacy
    { name: 'Medical Refrigerator' },
    { name: 'Medical Freezer' },
    { name: 'Compounding Hood' },
    { name: 'Automated Dispensing Machine' },

    // Endoscopy Suite
    { name: 'Colonoscopy System' },
    { name: 'Bronchoscopy System' },
    { name: 'Endoscope Reprocessor' },

    // Maternity Ward
    { name: 'Delivery Bed' },
    { name: 'Fetal Monitor' },
    { name: 'Birthing Chair' },
    { name: 'Infant Resuscitator' },

    // Neurology Department
    { name: 'EEG Machine' },
    { name: 'EMG Machine' },
    { name: 'Transcranial Doppler' },
    { name: 'Neurostimulator' },

    // Ophthalmology Department
    { name: 'Slit Lamp' },
    { name: 'Ophthalmic Laser' },
    { name: 'Autorefractor' },
    { name: 'Phoropter' },
    { name: 'Fundus Camera' },

    // Dental Department
    { name: 'Dental Chair' },
    { name: 'Dental X-Ray' },
    { name: 'Dental Autoclave' },
    { name: 'Intraoral Camera' },

    // ENT Department
    { name: 'Audiometer' },
    { name: 'Tympanometer' },
    { name: 'ENT Workstation' },
    { name: 'Otoscopy System' },

    // Orthopedics Department
    { name: 'Orthopedic Table' },
    { name: 'Bone Saw' },
    { name: 'Cast Cutter' },
    { name: 'Traction Device' },

    // Pathology Department
    { name: 'Tissue Processor' },
    { name: 'Cryostat' },
    { name: 'Slide Stainer' },
    { name: 'Histology Microscope' },

    // Pulmonary Department
    { name: 'Spirometer' },
    { name: 'Pulmonary Function Test Machine' },
    { name: 'Nebulizer' },

    // Additional Equipment
    { name: 'Medical Gas System' },
    { name: 'Blood Bank Refrigerator' },
    { name: 'Portable Suction Unit' },
    { name: 'Patient Warming System' },
    { name: 'Compression Therapy Unit' },
    { name: 'Bariatric Bed' },
    { name: 'Surgical Laser' },
    { name: 'Hyperbaric Chamber' },
    { name: 'Mobile Operating Lamp' },
    { name: 'Blood Pressure Monitor' },
    { name: 'Glucose Meter' },
    { name: 'Portable ECG' },
    { name: 'Medical Scale' },
    { name: 'Infant Scale' },
    { name: 'Surgical Instrument Table' },
    { name: 'Anesthesia Cart' },
    { name: 'Crash Cart' },
    { name: 'Medical Computer Workstation' },
    { name: 'Oxygen Concentrator' },
    { name: 'Portable Ultrasound' },
    { name: 'Patient Transfer Board' },
    { name: 'Medical Air Compressor' },
    { name: 'Endoscopic Camera' },
    { name: 'Surgical Suction Pump' },
    { name: 'Blood Warmer' },
    { name: 'Infant Phototherapy Blanket' },
    { name: 'Medical Waste Incinerator' },
    { name: 'Portable Dialysis Unit' },
    { name: 'Cardiac Monitor' },
    { name: 'Respiratory Humidifier' },
    { name: 'Medical Vacuum System' },
    { name: 'Portable Infusion Pump' },
    { name: 'Ophthalmic Ultrasound' },
    { name: 'Surgical Headlight' },
    { name: 'Patient Transport Stretcher' },
    { name: 'Medical Imaging Workstation' },
    { name: 'Portable Autoclave' },
    { name: 'EEG Video Monitor' },
    { name: 'Medical Gas Monitor' },
    { name: 'Surgical Power Tool' },
    { name: 'Endoscopy Light Source' },
    { name: 'Medical Chart Holder' },
    { name: 'Portable Patient Monitor' },
    { name: 'Infusion Stand' },
    { name: 'Medical Privacy Screen' },
    { name: 'Surgical Smoke Evacuator' },
    { name: 'Patient Warming Blanket' },
    { name: 'Medical Oxygen Cylinder' },
    { name: 'Portable Nebulizer' },
    { name: 'Surgical Drape Machine' },
    { name: 'Medical Storage Cabinet' },
    { name: 'Portable Chemistry Analyzer' },
    { name: 'Medical Waste Shredder' },
    { name: 'Patient Bedside Monitor' },
    { name: 'Medical Gas Pipeline' },
    { name: 'Portable Defibrillator Monitor' },
    { name: 'Surgical Instrument Sterilizer' },
    { name: 'Medical Transport Ventilator' },
    { name: 'Portable Blood Gas Analyzer' },
    { name: 'Medical Ultrasound Gel Warmer' },
    { name: 'Surgical Fluid Management System' },
    { name: 'Portable Hematology Analyzer' },
    { name: 'Medical Waste Autoclave' },
    { name: 'Patient Isolation Chamber' },
    { name: 'Medical Gas Alarm System' },
    { name: 'Portable ECG Monitor' },
    { name: 'Surgical Instrument Washer' },
    { name: 'Medical Oxygen Generator' },
    { name: 'Portable Pulse Oximeter' }
  ];

  for (const asset of assets) {
    const numDuplicates = Math.floor(Math.random() * 3) + 1; // 1 to 3 duplicates
    for (let i = 1; i <= numDuplicates; i++) {
      const cost = Math.floor(Math.random() * (1000000 - 1000 + 1)) + 1000; // Random cost between $1,000 and $1,000,000
      const purchaseDate = new Date(
        Date.now() - Math.floor(Math.random() * 5 * 365 * 24 * 60 * 60 * 1000) // Random date within last 5 years
      );
      const fixedAsset = await prisma.fixedAsset.create({
        data: {
          id: uuidv4(),
          name: `${asset.name} ${i}`,
          purchaseDate,
          cost
        }
      });

      // Create Depreciation Schedules
      const depreciationCount = Math.floor(Math.random() * 5) + 1; // 1 to 5 schedules
      for (let j = 0; j < depreciationCount; j++) {
        const depreciationDate = new Date(purchaseDate.getTime() + (j + 1) * 365 * 24 * 60 * 60 * 1000); // Yearly depreciation
        const amount = cost / depreciationCount; // Evenly split depreciation
        await prisma.depreciationSchedule.create({
          data: {
            id: uuidv4(),
            fixedAssetId: fixedAsset.id,
            depreciationDate,
            amount
          }
        });
      }

      // Create Asset Audits
      const auditCount = Math.floor(Math.random() * 3) + 1; // 1 to 3 audits
      for (let k = 0; k < auditCount; k++) {
        const auditDate = new Date(purchaseDate.getTime() + k * 180 * 24 * 60 * 60 * 1000); // Audits every 6 months
        await prisma.assetAudit.create({
          data: {
            id: uuidv4(),
            fixedAssetId: fixedAsset.id,
            auditDate,
            findings: `Audit ${k + 1} for ${asset.name} ${i}`
          }
        });
      }
    }
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