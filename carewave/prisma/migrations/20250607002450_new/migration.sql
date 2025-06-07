/*
  Warnings:

  - You are about to drop the column `userId` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `User` table. All the data in the column will be lost.
  - Added the required column `name` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Patient" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
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
INSERT INTO "new_Patient" ("address", "allergies", "bloodType", "createdAt", "dateOfBirth", "emergencyContact", "emergencyContactPhone", "gender", "id", "insurancePolicy", "insuranceProvider", "medicalHistory", "patientId", "phone", "prescribedToId", "updatedAt") SELECT "address", "allergies", "bloodType", "createdAt", "dateOfBirth", "emergencyContact", "emergencyContactPhone", "gender", "id", "insurancePolicy", "insuranceProvider", "medicalHistory", "patientId", "phone", "prescribedToId", "updatedAt" FROM "Patient";
DROP TABLE "Patient";
ALTER TABLE "new_Patient" RENAME TO "Patient";
CREATE UNIQUE INDEX "Patient_patientId_key" ON "Patient"("patientId");
CREATE UNIQUE INDEX "Patient_email_key" ON "Patient"("email");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'PATIENT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "doctorId" INTEGER,
    "dispensedById" INTEGER,
    "processedById" INTEGER,
    "adjustedById" INTEGER,
    CONSTRAINT "User_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("adjustedById", "createdAt", "dispensedById", "doctorId", "email", "id", "name", "password", "processedById", "role", "updatedAt") SELECT "adjustedById", "createdAt", "dispensedById", "doctorId", "email", "id", "name", "password", "processedById", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_doctorId_key" ON "User"("doctorId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
