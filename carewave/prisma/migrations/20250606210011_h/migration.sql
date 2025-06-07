-- CreateTable
CREATE TABLE "MedicalRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patientId" INTEGER NOT NULL,
    "recordId" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "presentingComplaint" TEXT,
    "familyHistory" TEXT,
    "socialHistory" TEXT,
    "pastMedicalHistory" TEXT,
    "allergies" TEXT,
    "medications" TEXT,
    "date" DATETIME NOT NULL,
    "doctorName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MedicalRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Patient" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER,
    "patientId" TEXT NOT NULL,
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
    "prescribedToId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Patient" ("address", "allergies", "bloodType", "createdAt", "dateOfBirth", "emergencyContact", "emergencyContactPhone", "gender", "id", "insurancePolicy", "insuranceProvider", "medicalHistory", "patientId", "phone", "prescribedToId", "updatedAt") SELECT "address", "allergies", "bloodType", "createdAt", "dateOfBirth", "emergencyContact", "emergencyContactPhone", "gender", "id", "insurancePolicy", "insuranceProvider", "medicalHistory", "patientId", "phone", "prescribedToId", "updatedAt" FROM "Patient";
DROP TABLE "Patient";
ALTER TABLE "new_Patient" RENAME TO "Patient";
CREATE UNIQUE INDEX "Patient_userId_key" ON "Patient"("userId");
CREATE UNIQUE INDEX "Patient_patientId_key" ON "Patient"("patientId");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'PATIENT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "doctorId" INTEGER,
    "patientId" INTEGER,
    "dispensedById" INTEGER,
    "processedById" INTEGER,
    "adjustedById" INTEGER,
    CONSTRAINT "User_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("adjustedById", "createdAt", "dispensedById", "doctorId", "email", "id", "name", "password", "patientId", "processedById", "role", "updatedAt") SELECT "adjustedById", "createdAt", "dispensedById", "doctorId", "email", "id", "name", "password", "patientId", "processedById", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_doctorId_key" ON "User"("doctorId");
CREATE UNIQUE INDEX "User_patientId_key" ON "User"("patientId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "MedicalRecord_recordId_key" ON "MedicalRecord"("recordId");
