-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Patient" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patientId" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "dateOfBirth" DATETIME,
    "gender" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "emergencyContact" TEXT,
    "emergencyContactPhone" TEXT,
    "insuranceProvider" TEXT,
    "insurancePolicy" TEXT,
    "bloodType" TEXT,
    "allergies" TEXT,
    "medicalHistory" TEXT,
    "presentingComplaint" TEXT,
    "familyHistory" TEXT,
    "socialHistory" TEXT,
    "pastMedicalHistory" TEXT,
    "medications" TEXT,
    "prescribedToId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Patient" ("address", "allergies", "bloodType", "createdAt", "dateOfBirth", "email", "emergencyContact", "emergencyContactPhone", "familyHistory", "gender", "id", "insurancePolicy", "insuranceProvider", "medicalHistory", "medications", "name", "pastMedicalHistory", "patientId", "phone", "prescribedToId", "presentingComplaint", "socialHistory", "updatedAt") SELECT "address", "allergies", "bloodType", "createdAt", "dateOfBirth", "email", "emergencyContact", "emergencyContactPhone", "familyHistory", "gender", "id", "insurancePolicy", "insuranceProvider", "medicalHistory", "medications", "name", "pastMedicalHistory", "patientId", "phone", "prescribedToId", "presentingComplaint", "socialHistory", "updatedAt" FROM "Patient";
DROP TABLE "Patient";
ALTER TABLE "new_Patient" RENAME TO "Patient";
CREATE UNIQUE INDEX "Patient_patientId_key" ON "Patient"("patientId");
CREATE UNIQUE INDEX "Patient_email_key" ON "Patient"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
