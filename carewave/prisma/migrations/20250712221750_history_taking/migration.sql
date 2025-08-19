-- AlterTable
ALTER TABLE "VitalSign" ADD COLUMN     "oxygenSaturation" DOUBLE PRECISION,
ADD COLUMN     "respiratoryRate" INTEGER;

-- CreateTable
CREATE TABLE "ChiefComplaint" (
    "id" TEXT NOT NULL,
    "medicalRecordId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "onset" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChiefComplaint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PresentIllness" (
    "id" TEXT NOT NULL,
    "medicalRecordId" TEXT NOT NULL,
    "narrative" TEXT NOT NULL,
    "severity" TEXT,
    "progress" TEXT,
    "associatedSymptoms" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PresentIllness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PastMedicalCondition" (
    "id" TEXT NOT NULL,
    "medicalRecordId" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "diagnosisDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PastMedicalCondition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurgicalHistory" (
    "id" TEXT NOT NULL,
    "medicalRecordId" TEXT NOT NULL,
    "procedure" TEXT NOT NULL,
    "datePerformed" TIMESTAMP(3),
    "outcome" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SurgicalHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyHistory" (
    "id" TEXT NOT NULL,
    "medicalRecordId" TEXT NOT NULL,
    "relative" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "ageAtDiagnosis" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FamilyHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicationHistory" (
    "id" TEXT NOT NULL,
    "medicalRecordId" TEXT NOT NULL,
    "medicationName" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicationHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialHistory" (
    "id" TEXT NOT NULL,
    "medicalRecordId" TEXT NOT NULL,
    "smokingStatus" TEXT,
    "alcoholUse" TEXT,
    "occupation" TEXT,
    "maritalStatus" TEXT,
    "livingSituation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewOfSystems" (
    "id" TEXT NOT NULL,
    "medicalRecordId" TEXT NOT NULL,
    "system" TEXT NOT NULL,
    "findings" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewOfSystems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Immunization" (
    "id" TEXT NOT NULL,
    "medicalRecordId" TEXT NOT NULL,
    "vaccine" TEXT NOT NULL,
    "dateGiven" TIMESTAMP(3) NOT NULL,
    "administeredBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Immunization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TravelHistory" (
    "id" TEXT NOT NULL,
    "medicalRecordId" TEXT NOT NULL,
    "countryVisited" TEXT NOT NULL,
    "dateFrom" TIMESTAMP(3),
    "dateTo" TIMESTAMP(3),
    "purpose" TEXT,
    "travelNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TravelHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChiefComplaint_medicalRecordId_key" ON "ChiefComplaint"("medicalRecordId");

-- CreateIndex
CREATE UNIQUE INDEX "PresentIllness_medicalRecordId_key" ON "PresentIllness"("medicalRecordId");

-- CreateIndex
CREATE UNIQUE INDEX "SocialHistory_medicalRecordId_key" ON "SocialHistory"("medicalRecordId");

-- AddForeignKey
ALTER TABLE "ChiefComplaint" ADD CONSTRAINT "ChiefComplaint_medicalRecordId_fkey" FOREIGN KEY ("medicalRecordId") REFERENCES "MedicalRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresentIllness" ADD CONSTRAINT "PresentIllness_medicalRecordId_fkey" FOREIGN KEY ("medicalRecordId") REFERENCES "MedicalRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PastMedicalCondition" ADD CONSTRAINT "PastMedicalCondition_medicalRecordId_fkey" FOREIGN KEY ("medicalRecordId") REFERENCES "MedicalRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurgicalHistory" ADD CONSTRAINT "SurgicalHistory_medicalRecordId_fkey" FOREIGN KEY ("medicalRecordId") REFERENCES "MedicalRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyHistory" ADD CONSTRAINT "FamilyHistory_medicalRecordId_fkey" FOREIGN KEY ("medicalRecordId") REFERENCES "MedicalRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationHistory" ADD CONSTRAINT "MedicationHistory_medicalRecordId_fkey" FOREIGN KEY ("medicalRecordId") REFERENCES "MedicalRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialHistory" ADD CONSTRAINT "SocialHistory_medicalRecordId_fkey" FOREIGN KEY ("medicalRecordId") REFERENCES "MedicalRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewOfSystems" ADD CONSTRAINT "ReviewOfSystems_medicalRecordId_fkey" FOREIGN KEY ("medicalRecordId") REFERENCES "MedicalRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Immunization" ADD CONSTRAINT "Immunization_medicalRecordId_fkey" FOREIGN KEY ("medicalRecordId") REFERENCES "MedicalRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelHistory" ADD CONSTRAINT "TravelHistory_medicalRecordId_fkey" FOREIGN KEY ("medicalRecordId") REFERENCES "MedicalRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
