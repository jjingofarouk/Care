/*
  Warnings:

  - You are about to drop the column `prescriberId` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `doctorId` on the `User` table. All the data in the column will be lost.
  - Added the required column `name` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `Doctor` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Doctor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "doctorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "specialty" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "office" TEXT,
    "departmentId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Doctor_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Doctor" ("createdAt", "departmentId", "doctorId", "id", "licenseNumber", "office", "phone", "specialty", "updatedAt") SELECT "createdAt", "departmentId", "doctorId", "id", "licenseNumber", "office", "phone", "specialty", "updatedAt" FROM "Doctor";
DROP TABLE "Doctor";
ALTER TABLE "new_Doctor" RENAME TO "Doctor";
CREATE UNIQUE INDEX "Doctor_doctorId_key" ON "Doctor"("doctorId");
CREATE UNIQUE INDEX "Doctor_email_key" ON "Doctor"("email");
CREATE UNIQUE INDEX "Doctor_licenseNumber_key" ON "Doctor"("licenseNumber");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'PATIENT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "dispensedById" INTEGER,
    "processedById" INTEGER,
    "adjustedById" INTEGER
);
INSERT INTO "new_User" ("adjustedById", "createdAt", "dispensedById", "email", "id", "name", "password", "processedById", "role", "updatedAt") SELECT "adjustedById", "createdAt", "dispensedById", "email", "id", "name", "password", "processedById", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
