/*
  Warnings:

  - You are about to drop the column `surgeryDate` on the `Surgery` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SurgeryStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SurgicalRole" AS ENUM ('SURGEON', 'ASSISTANT', 'ANESTHESIOLOGIST', 'SCRUB_NURSE', 'CIRCULATING_NURSE', 'TECHNICIAN');

-- AlterTable
ALTER TABLE "Surgery" DROP COLUMN "surgeryDate",
ADD COLUMN     "actualDurationMinutes" INTEGER,
ADD COLUMN     "complications" TEXT,
ADD COLUMN     "estimatedDurationMinutes" INTEGER,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "status" "SurgeryStatus" NOT NULL DEFAULT 'PLANNED',
ADD COLUMN     "type" TEXT;

-- CreateTable
CREATE TABLE "SurgicalTeamMember" (
    "id" TEXT NOT NULL,
    "surgicalTeamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "SurgicalRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SurgicalTeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnesthesiaRecord" (
    "id" TEXT NOT NULL,
    "surgeryId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "notes" TEXT,
    "administeredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnesthesiaRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostOpRecovery" (
    "id" TEXT NOT NULL,
    "surgeryId" TEXT NOT NULL,
    "recoveryNotes" TEXT,
    "dischargeDate" TIMESTAMP(3),
    "complications" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostOpRecovery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurgeryAuditLog" (
    "id" TEXT NOT NULL,
    "surgeryId" TEXT NOT NULL,
    "changedById" TEXT NOT NULL,
    "fieldChanged" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurgeryAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnesthesiaRecord_surgeryId_key" ON "AnesthesiaRecord"("surgeryId");

-- CreateIndex
CREATE UNIQUE INDEX "PostOpRecovery_surgeryId_key" ON "PostOpRecovery"("surgeryId");

-- AddForeignKey
ALTER TABLE "SurgicalTeamMember" ADD CONSTRAINT "SurgicalTeamMember_surgicalTeamId_fkey" FOREIGN KEY ("surgicalTeamId") REFERENCES "SurgicalTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurgicalTeamMember" ADD CONSTRAINT "SurgicalTeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserRegistration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnesthesiaRecord" ADD CONSTRAINT "AnesthesiaRecord_surgeryId_fkey" FOREIGN KEY ("surgeryId") REFERENCES "Surgery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostOpRecovery" ADD CONSTRAINT "PostOpRecovery_surgeryId_fkey" FOREIGN KEY ("surgeryId") REFERENCES "Surgery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurgeryAuditLog" ADD CONSTRAINT "SurgeryAuditLog_surgeryId_fkey" FOREIGN KEY ("surgeryId") REFERENCES "Surgery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurgeryAuditLog" ADD CONSTRAINT "SurgeryAuditLog_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "UserRegistration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
