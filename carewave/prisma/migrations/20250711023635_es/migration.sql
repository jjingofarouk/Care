/*
  Warnings:

  - The primary key for the `Admission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dischargeDate` on the `Admission` table. All the data in the column will be lost.
  - You are about to drop the column `dischargeNotes` on the `Admission` table. All the data in the column will be lost.
  - You are about to drop the column `doctorId` on the `Admission` table. All the data in the column will be lost.
  - You are about to drop the column `preAdmissionNotes` on the `Admission` table. All the data in the column will be lost.
  - You are about to drop the column `presentingComplaints` on the `Admission` table. All the data in the column will be lost.
  - You are about to drop the column `relayedInfo` on the `Admission` table. All the data in the column will be lost.
  - You are about to drop the column `scheduledDate` on the `Admission` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Admission` table. All the data in the column will be lost.
  - You are about to drop the column `triageNotes` on the `Admission` table. All the data in the column will be lost.
  - You are about to drop the column `triagePriority` on the `Admission` table. All the data in the column will be lost.
  - The primary key for the `Appointment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bookedById` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `checkInTime` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `checkOutTime` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `departmentId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `reminderSent` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Appointment` table. All the data in the column will be lost.
  - The primary key for the `Department` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `description` on the `Department` table. All the data in the column will be lost.
  - The primary key for the `Discharge` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dischargeNotes` on the `Discharge` table. All the data in the column will be lost.
  - You are about to drop the column `doctorId` on the `Discharge` table. All the data in the column will be lost.
  - You are about to drop the column `followUpInstructions` on the `Discharge` table. All the data in the column will be lost.
  - You are about to drop the column `medications` on the `Discharge` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `Discharge` table. All the data in the column will be lost.
  - The primary key for the `Doctor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `doctorId` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `licenseNumber` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `office` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `specialty` on the `Doctor` table. All the data in the column will be lost.
  - The primary key for the `FixedAsset` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `currentValue` on the `FixedAsset` table. All the data in the column will be lost.
  - You are about to drop the column `depreciation` on the `FixedAsset` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseCost` on the `FixedAsset` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `FixedAsset` table. All the data in the column will be lost.
  - The primary key for the `Invoice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `paymentMethod` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `prescriptionId` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `transactionId` on the `Invoice` table. All the data in the column will be lost.
  - The primary key for the `MedicalRecord` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `allergies` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `diagnosis` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `doctorName` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `familyHistory` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `medications` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `pastMedicalHistory` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `presentingComplaint` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `recordId` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `socialHistory` on the `MedicalRecord` table. All the data in the column will be lost.
  - The primary key for the `Patient` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `address` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `allergies` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `bloodType` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `emergencyContact` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `emergencyContactPhone` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `familyHistory` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `insurancePolicy` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `insuranceProvider` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `medicalHistory` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `medications` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `pastMedicalHistory` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `prescribedToId` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `presentingComplaint` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `socialHistory` on the `Patient` table. All the data in the column will be lost.
  - The primary key for the `Prescription` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `notes` on the `Prescription` table. All the data in the column will be lost.
  - You are about to drop the column `prescriptionDate` on the `Prescription` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Prescription` table. All the data in the column will be lost.
  - The primary key for the `PurchaseOrder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `status` on the `PurchaseOrder` table. All the data in the column will be lost.
  - The primary key for the `Supplier` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `address` on the `Supplier` table. All the data in the column will be lost.
  - You are about to drop the column `contact` on the `Supplier` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Supplier` table. All the data in the column will be lost.
  - The primary key for the `Ward` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `department` on the `Ward` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Ward` table. All the data in the column will be lost.
  - You are about to drop the column `nurseInCharge` on the `Ward` table. All the data in the column will be lost.
  - You are about to drop the column `occupiedBeds` on the `Ward` table. All the data in the column will be lost.
  - You are about to drop the column `totalBeds` on the `Ward` table. All the data in the column will be lost.
  - You are about to drop the column `wardNumber` on the `Ward` table. All the data in the column will be lost.
  - You are about to drop the `CSSDInstrument` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CSSDLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CSSDRecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CSSDRequisition` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CostCenter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DispensingRecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DoctorAvailability` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DrugInteraction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Formulary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Medication` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payroll` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PrescriptionItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PurchaseOrderItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Queue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Refund` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StockAdjustment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `FixedAsset` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Supplier` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Ward` will be added. If there are existing duplicate values, this will fail.
  - Made the column `wardId` on table `Admission` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `appointmentDate` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visitTypeId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departmentType` to the `Department` table without a default value. This is not possible if the table is not empty.
  - Added the required column `admissionId` to the `Discharge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `Doctor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `departmentId` on table `Doctor` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `cost` to the `FixedAsset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceDate` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientId` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recordDate` to the `MedicalRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Made the column `dateOfBirth` on table `Patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `Patient` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `dosage` to the `Prescription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `drugId` to the `Prescription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prescribedAt` to the `Prescription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departmentId` to the `Ward` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AppointmentStatusEnum" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "HelpCategoryEnum" AS ENUM ('TECHNICAL', 'BILLING', 'CLINICAL', 'OTHER');

-- CreateEnum
CREATE TYPE "BillingCategoryEnum" AS ENUM ('CONSULTATION', 'PROCEDURE', 'MEDICATION', 'OTHER');

-- CreateEnum
CREATE TYPE "ClaimStatusEnum" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUBMITTED');

-- CreateEnum
CREATE TYPE "DepartmentTypeEnum" AS ENUM ('CLINICAL', 'ADMINISTRATIVE', 'SUPPORT');

-- DropForeignKey
ALTER TABLE "Admission" DROP CONSTRAINT "Admission_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Admission" DROP CONSTRAINT "Admission_patientId_fkey";

-- DropForeignKey
ALTER TABLE "Admission" DROP CONSTRAINT "Admission_wardId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_bookedById_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_patientId_fkey";

-- DropForeignKey
ALTER TABLE "CSSDLog" DROP CONSTRAINT "CSSDLog_instrumentId_fkey";

-- DropForeignKey
ALTER TABLE "CSSDLog" DROP CONSTRAINT "CSSDLog_recordId_fkey";

-- DropForeignKey
ALTER TABLE "CSSDLog" DROP CONSTRAINT "CSSDLog_requisitionId_fkey";

-- DropForeignKey
ALTER TABLE "CSSDLog" DROP CONSTRAINT "CSSDLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "CSSDRecord" DROP CONSTRAINT "CSSDRecord_instrumentId_fkey";

-- DropForeignKey
ALTER TABLE "CSSDRequisition" DROP CONSTRAINT "CSSDRequisition_instrumentId_fkey";

-- DropForeignKey
ALTER TABLE "CSSDRequisition" DROP CONSTRAINT "CSSDRequisition_requestedBy_fkey";

-- DropForeignKey
ALTER TABLE "Discharge" DROP CONSTRAINT "Discharge_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Discharge" DROP CONSTRAINT "Discharge_patientId_fkey";

-- DropForeignKey
ALTER TABLE "DispensingRecord" DROP CONSTRAINT "DispensingRecord_dispensedById_fkey";

-- DropForeignKey
ALTER TABLE "DispensingRecord" DROP CONSTRAINT "DispensingRecord_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "DispensingRecord" DROP CONSTRAINT "DispensingRecord_medicationId_fkey";

-- DropForeignKey
ALTER TABLE "DispensingRecord" DROP CONSTRAINT "DispensingRecord_prescriptionId_fkey";

-- DropForeignKey
ALTER TABLE "Doctor" DROP CONSTRAINT "Doctor_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorAvailability" DROP CONSTRAINT "DoctorAvailability_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "DrugInteraction" DROP CONSTRAINT "DrugInteraction_medicationId1_fkey";

-- DropForeignKey
ALTER TABLE "DrugInteraction" DROP CONSTRAINT "DrugInteraction_medicationId2_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_prescriptionId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "MedicalRecord" DROP CONSTRAINT "MedicalRecord_patientId_fkey";

-- DropForeignKey
ALTER TABLE "Medication" DROP CONSTRAINT "Medication_formularyId_fkey";

-- DropForeignKey
ALTER TABLE "Medication" DROP CONSTRAINT "Medication_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "Payroll" DROP CONSTRAINT "Payroll_userId_fkey";

-- DropForeignKey
ALTER TABLE "Prescription" DROP CONSTRAINT "Prescription_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Prescription" DROP CONSTRAINT "Prescription_patientId_fkey";

-- DropForeignKey
ALTER TABLE "PrescriptionItem" DROP CONSTRAINT "PrescriptionItem_medicationId_fkey";

-- DropForeignKey
ALTER TABLE "PrescriptionItem" DROP CONSTRAINT "PrescriptionItem_prescriptionId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseOrder" DROP CONSTRAINT "PurchaseOrder_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseOrderItem" DROP CONSTRAINT "PurchaseOrderItem_medicationId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseOrderItem" DROP CONSTRAINT "PurchaseOrderItem_purchaseOrderId_fkey";

-- DropForeignKey
ALTER TABLE "Queue" DROP CONSTRAINT "Queue_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "Refund" DROP CONSTRAINT "Refund_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "Refund" DROP CONSTRAINT "Refund_processedById_fkey";

-- DropForeignKey
ALTER TABLE "StockAdjustment" DROP CONSTRAINT "StockAdjustment_adjustedById_fkey";

-- DropForeignKey
ALTER TABLE "StockAdjustment" DROP CONSTRAINT "StockAdjustment_medicationId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_costCenterId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_patientId_fkey";

-- DropIndex
DROP INDEX "Doctor_doctorId_key";

-- DropIndex
DROP INDEX "Doctor_licenseNumber_key";

-- DropIndex
DROP INDEX "Invoice_prescriptionId_key";

-- DropIndex
DROP INDEX "MedicalRecord_recordId_key";

-- DropIndex
DROP INDEX "Patient_patientId_key";

-- DropIndex
DROP INDEX "Supplier_email_key";

-- DropIndex
DROP INDEX "Ward_wardNumber_key";

-- AlterTable
ALTER TABLE "Admission" DROP CONSTRAINT "Admission_pkey",
DROP COLUMN "dischargeDate",
DROP COLUMN "dischargeNotes",
DROP COLUMN "doctorId",
DROP COLUMN "preAdmissionNotes",
DROP COLUMN "presentingComplaints",
DROP COLUMN "relayedInfo",
DROP COLUMN "scheduledDate",
DROP COLUMN "status",
DROP COLUMN "triageNotes",
DROP COLUMN "triagePriority",
ADD COLUMN     "bedId" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "patientId" SET DATA TYPE TEXT,
ALTER COLUMN "wardId" SET NOT NULL,
ALTER COLUMN "wardId" SET DATA TYPE TEXT,
ALTER COLUMN "admissionDate" DROP DEFAULT,
ADD CONSTRAINT "Admission_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Admission_id_seq";

-- AlterTable
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_pkey",
DROP COLUMN "bookedById",
DROP COLUMN "checkInTime",
DROP COLUMN "checkOutTime",
DROP COLUMN "date",
DROP COLUMN "departmentId",
DROP COLUMN "notes",
DROP COLUMN "reason",
DROP COLUMN "reminderSent",
DROP COLUMN "status",
DROP COLUMN "type",
ADD COLUMN     "appointmentDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "appointmentStatus" "AppointmentStatusEnum" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "visitTypeId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "patientId" SET DATA TYPE TEXT,
ALTER COLUMN "doctorId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Appointment_id_seq";

-- AlterTable
ALTER TABLE "Department" DROP CONSTRAINT "Department_pkey",
DROP COLUMN "description",
ADD COLUMN     "departmentType" "DepartmentTypeEnum" NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Department_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Department_id_seq";

-- AlterTable
ALTER TABLE "Discharge" DROP CONSTRAINT "Discharge_pkey",
DROP COLUMN "dischargeNotes",
DROP COLUMN "doctorId",
DROP COLUMN "followUpInstructions",
DROP COLUMN "medications",
DROP COLUMN "patientId",
ADD COLUMN     "admissionId" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "dischargeDate" DROP DEFAULT,
ADD CONSTRAINT "Discharge_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Discharge_id_seq";

-- AlterTable
ALTER TABLE "Doctor" DROP CONSTRAINT "Doctor_pkey",
DROP COLUMN "doctorId",
DROP COLUMN "licenseNumber",
DROP COLUMN "name",
DROP COLUMN "office",
DROP COLUMN "specialty",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "departmentId" SET NOT NULL,
ALTER COLUMN "departmentId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Doctor_id_seq";

-- AlterTable
ALTER TABLE "FixedAsset" DROP CONSTRAINT "FixedAsset_pkey",
DROP COLUMN "currentValue",
DROP COLUMN "depreciation",
DROP COLUMN "purchaseCost",
DROP COLUMN "status",
ADD COLUMN     "cost" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "FixedAsset_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "FixedAsset_id_seq";

-- AlterTable
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_pkey",
DROP COLUMN "paymentMethod",
DROP COLUMN "prescriptionId",
DROP COLUMN "status",
DROP COLUMN "transactionId",
ADD COLUMN     "invoiceDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "patientId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Invoice_id_seq";

-- AlterTable
ALTER TABLE "MedicalRecord" DROP CONSTRAINT "MedicalRecord_pkey",
DROP COLUMN "allergies",
DROP COLUMN "date",
DROP COLUMN "diagnosis",
DROP COLUMN "doctorName",
DROP COLUMN "familyHistory",
DROP COLUMN "medications",
DROP COLUMN "pastMedicalHistory",
DROP COLUMN "presentingComplaint",
DROP COLUMN "recordId",
DROP COLUMN "socialHistory",
ADD COLUMN     "recordDate" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "patientId" SET DATA TYPE TEXT,
ADD CONSTRAINT "MedicalRecord_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "MedicalRecord_id_seq";

-- AlterTable
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_pkey",
DROP COLUMN "address",
DROP COLUMN "allergies",
DROP COLUMN "bloodType",
DROP COLUMN "emergencyContact",
DROP COLUMN "emergencyContactPhone",
DROP COLUMN "familyHistory",
DROP COLUMN "insurancePolicy",
DROP COLUMN "insuranceProvider",
DROP COLUMN "medicalHistory",
DROP COLUMN "medications",
DROP COLUMN "name",
DROP COLUMN "pastMedicalHistory",
DROP COLUMN "patientId",
DROP COLUMN "prescribedToId",
DROP COLUMN "presentingComplaint",
DROP COLUMN "socialHistory",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "dateOfBirth" SET NOT NULL,
ALTER COLUMN "gender" SET NOT NULL,
ADD CONSTRAINT "Patient_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Patient_id_seq";

-- AlterTable
ALTER TABLE "Prescription" DROP CONSTRAINT "Prescription_pkey",
DROP COLUMN "notes",
DROP COLUMN "prescriptionDate",
DROP COLUMN "status",
ADD COLUMN     "dosage" TEXT NOT NULL,
ADD COLUMN     "drugId" TEXT NOT NULL,
ADD COLUMN     "prescribedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "patientId" SET DATA TYPE TEXT,
ALTER COLUMN "doctorId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Prescription_id_seq";

-- AlterTable
ALTER TABLE "PurchaseOrder" DROP CONSTRAINT "PurchaseOrder_pkey",
DROP COLUMN "status",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "supplierId" SET DATA TYPE TEXT,
ALTER COLUMN "orderDate" DROP DEFAULT,
ADD CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "PurchaseOrder_id_seq";

-- AlterTable
ALTER TABLE "Supplier" DROP CONSTRAINT "Supplier_pkey",
DROP COLUMN "address",
DROP COLUMN "contact",
DROP COLUMN "email",
ADD COLUMN     "contactInfo" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Supplier_id_seq";

-- AlterTable
ALTER TABLE "Ward" DROP CONSTRAINT "Ward_pkey",
DROP COLUMN "department",
DROP COLUMN "location",
DROP COLUMN "nurseInCharge",
DROP COLUMN "occupiedBeds",
DROP COLUMN "totalBeds",
DROP COLUMN "wardNumber",
ADD COLUMN     "departmentId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Ward_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Ward_id_seq";

-- DropTable
DROP TABLE "CSSDInstrument";

-- DropTable
DROP TABLE "CSSDLog";

-- DropTable
DROP TABLE "CSSDRecord";

-- DropTable
DROP TABLE "CSSDRequisition";

-- DropTable
DROP TABLE "CostCenter";

-- DropTable
DROP TABLE "DispensingRecord";

-- DropTable
DROP TABLE "DoctorAvailability";

-- DropTable
DROP TABLE "DrugInteraction";

-- DropTable
DROP TABLE "Formulary";

-- DropTable
DROP TABLE "Medication";

-- DropTable
DROP TABLE "Payroll";

-- DropTable
DROP TABLE "PrescriptionItem";

-- DropTable
DROP TABLE "PurchaseOrderItem";

-- DropTable
DROP TABLE "Queue";

-- DropTable
DROP TABLE "Refund";

-- DropTable
DROP TABLE "StockAdjustment";

-- DropTable
DROP TABLE "Transaction";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "DashboardStats" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "period" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DashboardStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KPI" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "target" DOUBLE PRECISION NOT NULL,
    "currentValue" DOUBLE PRECISION NOT NULL,
    "period" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KPI_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Widget" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "statsId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Widget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomepageConfig" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "theme" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepageConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeroSection" (
    "id" TEXT NOT NULL,
    "homepageConfigId" TEXT NOT NULL,
    "imageUrl" TEXT,
    "headline" TEXT NOT NULL,
    "subheadline" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "News" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Highlight" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Highlight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLogin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserLogin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginAttempt" (
    "id" TEXT NOT NULL,
    "userLoginId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "success" BOOLEAN NOT NULL,
    "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoginAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userLoginId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRegistration" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailVerificationToken" (
    "id" TEXT NOT NULL,
    "userRegistrationId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailVerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Specialization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Specialization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorSpecialization" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "specializationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorSpecialization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorSchedule" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorLeave" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorLeave_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nurse" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "departmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Nurse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NurseSchedule" (
    "id" TEXT NOT NULL,
    "nurseId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NurseSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shift" (
    "id" TEXT NOT NULL,
    "nurseId" TEXT NOT NULL,
    "wardId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemAdmin" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminLog" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialWorker" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialWorker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientSupportCase" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "socialWorkerId" TEXT NOT NULL,
    "caseDetails" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientSupportCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncentiveProgram" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IncentiveProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncentiveRecord" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "staffType" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "awardedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IncentiveRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientAddress" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "postalCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NextOfKin" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NextOfKin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsuranceInfo" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "policyNumber" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InsuranceInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Allergy" (
    "id" TEXT NOT NULL,
    "medicalRecordId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Allergy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diagnosis" (
    "id" TEXT NOT NULL,
    "medicalRecordId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "diagnosedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Diagnosis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VitalSign" (
    "id" TEXT NOT NULL,
    "medicalRecordId" TEXT NOT NULL,
    "bloodPressure" TEXT,
    "heartRate" INTEGER,
    "temperature" DOUBLE PRECISION,
    "recordedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VitalSign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transfer" (
    "id" TEXT NOT NULL,
    "admissionId" TEXT NOT NULL,
    "fromWardId" TEXT NOT NULL,
    "toWardId" TEXT NOT NULL,
    "transferDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bed" (
    "id" TEXT NOT NULL,
    "wardId" TEXT NOT NULL,
    "bedNumber" TEXT NOT NULL,
    "isOccupied" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "wardId" TEXT NOT NULL,
    "roomNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QueueEntry" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "serviceCounterId" TEXT NOT NULL,
    "queueStatusId" TEXT NOT NULL,
    "queueNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QueueEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceCounter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceCounter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QueueStatus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QueueStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicalNote" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicalNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressNote" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgressNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SOAPNote" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "subjective" TEXT,
    "objective" TEXT,
    "assessment" TEXT,
    "plan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SOAPNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicalTask" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "assignedToId" TEXT NOT NULL,
    "assignedToType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicalTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppointmentStatus" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "status" "AppointmentStatusEnum" NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppointmentStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisitType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisitType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmergencyCase" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "triageId" TEXT NOT NULL,
    "admissionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmergencyCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Triage" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "triageLevel" TEXT NOT NULL,
    "symptoms" TEXT NOT NULL,
    "assessedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Triage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ambulance" (
    "id" TEXT NOT NULL,
    "vehicleNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ambulance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmergencyLog" (
    "id" TEXT NOT NULL,
    "emergencyCaseId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "loggedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmergencyLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaternityCase" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaternityCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryRecord" (
    "id" TEXT NOT NULL,
    "maternityCaseId" TEXT NOT NULL,
    "deliveryDate" TIMESTAMP(3) NOT NULL,
    "deliveryType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ANCVisit" (
    "id" TEXT NOT NULL,
    "maternityCaseId" TEXT NOT NULL,
    "visitDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ANCVisit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PNCVisit" (
    "id" TEXT NOT NULL,
    "maternityCaseId" TEXT NOT NULL,
    "visitDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PNCVisit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VaccinationRecord" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "vaccineId" TEXT NOT NULL,
    "immunizationScheduleId" TEXT,
    "administeredDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VaccinationRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vaccine" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vaccine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImmunizationSchedule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImmunizationSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Surgery" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "theatreId" TEXT NOT NULL,
    "surgicalTeamId" TEXT NOT NULL,
    "preOpAssessmentId" TEXT,
    "surgeryDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Surgery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Theatre" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Theatre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurgicalTeam" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SurgicalTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreOpAssessment" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "assessment" TEXT NOT NULL,
    "assessedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PreOpAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabTest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabResult" (
    "id" TEXT NOT NULL,
    "labRequestId" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "resultedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabRequest" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "labTestId" TEXT NOT NULL,
    "sampleId" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sample" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "sampleType" TEXT NOT NULL,
    "collectedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sample_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RadiologyTest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RadiologyTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RadiologyResult" (
    "id" TEXT NOT NULL,
    "imagingOrderId" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "resultedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RadiologyResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImagingOrder" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "radiologyTestId" TEXT NOT NULL,
    "orderedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImagingOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScanImage" (
    "id" TEXT NOT NULL,
    "radiologyResultId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScanImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PharmacyItem" (
    "id" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,
    "batchNumber" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PharmacyItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Drug" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Drug_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DispenseRecord" (
    "id" TEXT NOT NULL,
    "pharmacyItemId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "dispensedAt" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DispenseRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dispensary" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dispensary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pharmacist" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pharmacist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DispensaryStock" (
    "id" TEXT NOT NULL,
    "dispensaryId" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DispensaryStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CSSDItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CSSDItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SterilizationCycle" (
    "id" TEXT NOT NULL,
    "cssdItemId" TEXT NOT NULL,
    "cycleDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SterilizationCycle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstrumentRequest" (
    "id" TEXT NOT NULL,
    "cssdItemId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "requestedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstrumentRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HelpTicket" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userType" TEXT NOT NULL,
    "category" "HelpCategoryEnum" NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "supportAgentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HelpTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportAgent" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupportAgent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectricityLog" (
    "id" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL,
    "usageKwh" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ElectricityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaterLog" (
    "id" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL,
    "usageLiters" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WaterLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BackupGeneratorStatus" (
    "id" TEXT NOT NULL,
    "generatorId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BackupGeneratorStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureToggle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeatureToggle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThemeSetting" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "primaryColor" TEXT NOT NULL,
    "secondaryColor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ThemeSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userType" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userType" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserVerificationStatus" (
    "id" TEXT NOT NULL,
    "verificationTokenId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserVerificationStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "method" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillingItem" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "billingCategory" "BillingCategoryEnum" NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BillingItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalEntry" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "entryDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ledgerId" TEXT NOT NULL,

    CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ledger" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrialBalance" (
    "id" TEXT NOT NULL,
    "ledgerId" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrialBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Claim" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "claimBatchId" TEXT,
    "claimStatusId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Claim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClaimBatch" (
    "id" TEXT NOT NULL,
    "batchNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClaimBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClaimStatus" (
    "id" TEXT NOT NULL,
    "claimId" TEXT NOT NULL,
    "status" "ClaimStatusEnum" NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClaimStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClaimSubmission" (
    "id" TEXT NOT NULL,
    "claimId" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClaimSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NHIFClaim" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "nhifBenefitId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NHIFClaim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NHIFBenefit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NHIFBenefit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NHIFSubmission" (
    "id" TEXT NOT NULL,
    "nhifClaimId" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NHIFSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockMovement" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "movementType" TEXT NOT NULL,
    "movedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpiryAlert" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "alertedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExpiryAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoodsReceivedNote" (
    "id" TEXT NOT NULL,
    "purchaseOrderId" TEXT NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoodsReceivedNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Substore" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Substore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubstoreTransfer" (
    "id" TEXT NOT NULL,
    "fromSubstoreId" TEXT NOT NULL,
    "toSubstoreId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "transferredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubstoreTransfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Requisition" (
    "id" TEXT NOT NULL,
    "substoreId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "requestedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Requisition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepreciationSchedule" (
    "id" TEXT NOT NULL,
    "fixedAssetId" TEXT NOT NULL,
    "depreciationDate" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DepreciationSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetAudit" (
    "id" TEXT NOT NULL,
    "fixedAssetId" TEXT NOT NULL,
    "auditDate" TIMESTAMP(3) NOT NULL,
    "findings" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "reportTemplateId" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportSchedule" (
    "id" TEXT NOT NULL,
    "reportTemplateId" TEXT NOT NULL,
    "scheduleDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomReport" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportField" (
    "id" TEXT NOT NULL,
    "customReportId" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "fieldType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportFilter" (
    "id" TEXT NOT NULL,
    "customReportId" TEXT NOT NULL,
    "filterName" TEXT NOT NULL,
    "filterValue" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportFilter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "referringDoctorId" TEXT,
    "referralSourceId" TEXT NOT NULL,
    "referralDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferringDoctor" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReferringDoctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralSource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReferralSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RolePermissions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserLogin_email_key" ON "UserLogin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "UserRegistration_email_key" ON "UserRegistration"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerificationToken_userRegistrationId_key" ON "EmailVerificationToken"("userRegistrationId");

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerificationToken_token_key" ON "EmailVerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Specialization_name_key" ON "Specialization"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Nurse_email_key" ON "Nurse"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SystemAdmin_email_key" ON "SystemAdmin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SocialWorker_email_key" ON "SocialWorker"("email");

-- CreateIndex
CREATE UNIQUE INDEX "IncentiveProgram_name_key" ON "IncentiveProgram"("name");

-- CreateIndex
CREATE UNIQUE INDEX "NextOfKin_patientId_key" ON "NextOfKin"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "InsuranceInfo_patientId_key" ON "InsuranceInfo"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "InsuranceInfo_policyNumber_key" ON "InsuranceInfo"("policyNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Bed_bedNumber_key" ON "Bed"("bedNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Room_roomNumber_key" ON "Room"("roomNumber");

-- CreateIndex
CREATE UNIQUE INDEX "QueueEntry_queueNumber_key" ON "QueueEntry"("queueNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCounter_name_key" ON "ServiceCounter"("name");

-- CreateIndex
CREATE UNIQUE INDEX "QueueStatus_name_key" ON "QueueStatus"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentStatus_appointmentId_key" ON "AppointmentStatus"("appointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "VisitType_name_key" ON "VisitType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Ambulance_vehicleNumber_key" ON "Ambulance"("vehicleNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Vaccine_name_key" ON "Vaccine"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ImmunizationSchedule_name_key" ON "ImmunizationSchedule"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Theatre_name_key" ON "Theatre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SurgicalTeam_name_key" ON "SurgicalTeam"("name");

-- CreateIndex
CREATE UNIQUE INDEX "LabTest_name_key" ON "LabTest"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RadiologyTest_name_key" ON "RadiologyTest"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Drug_name_key" ON "Drug"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Dispensary_name_key" ON "Dispensary"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Pharmacist_email_key" ON "Pharmacist"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CSSDItem_name_key" ON "CSSDItem"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SupportAgent_email_key" ON "SupportAgent"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BackupGeneratorStatus_generatorId_key" ON "BackupGeneratorStatus"("generatorId");

-- CreateIndex
CREATE UNIQUE INDEX "SystemSetting_key_key" ON "SystemSetting"("key");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureToggle_name_key" ON "FeatureToggle"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ThemeSetting_name_key" ON "ThemeSetting"("name");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "UserVerificationStatus_verificationTokenId_key" ON "UserVerificationStatus"("verificationTokenId");

-- CreateIndex
CREATE UNIQUE INDEX "Ledger_name_key" ON "Ledger"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Account_name_key" ON "Account"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Claim_claimStatusId_key" ON "Claim"("claimStatusId");

-- CreateIndex
CREATE UNIQUE INDEX "ClaimBatch_batchNumber_key" ON "ClaimBatch"("batchNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ClaimStatus_claimId_key" ON "ClaimStatus"("claimId");

-- CreateIndex
CREATE UNIQUE INDEX "NHIFBenefit_name_key" ON "NHIFBenefit"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Item_name_key" ON "Item"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Substore_name_key" ON "Substore"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_name_key" ON "Unit"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ReportTemplate_name_key" ON "ReportTemplate"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CustomReport_name_key" ON "CustomReport"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ReferringDoctor_email_key" ON "ReferringDoctor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralSource_name_key" ON "ReferralSource"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_RolePermissions_AB_unique" ON "_RolePermissions"("A", "B");

-- CreateIndex
CREATE INDEX "_RolePermissions_B_index" ON "_RolePermissions"("B");

-- CreateIndex
CREATE UNIQUE INDEX "FixedAsset_name_key" ON "FixedAsset"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_name_key" ON "Supplier"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Ward_name_key" ON "Ward"("name");

-- AddForeignKey
ALTER TABLE "Widget" ADD CONSTRAINT "Widget_statsId_fkey" FOREIGN KEY ("statsId") REFERENCES "DashboardStats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeroSection" ADD CONSTRAINT "HeroSection_homepageConfigId_fkey" FOREIGN KEY ("homepageConfigId") REFERENCES "HomepageConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoginAttempt" ADD CONSTRAINT "LoginAttempt_userLoginId_fkey" FOREIGN KEY ("userLoginId") REFERENCES "UserLogin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userLoginId_fkey" FOREIGN KEY ("userLoginId") REFERENCES "UserLogin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailVerificationToken" ADD CONSTRAINT "EmailVerificationToken_userRegistrationId_fkey" FOREIGN KEY ("userRegistrationId") REFERENCES "UserRegistration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorSpecialization" ADD CONSTRAINT "DoctorSpecialization_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorSpecialization" ADD CONSTRAINT "DoctorSpecialization_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specialization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorSchedule" ADD CONSTRAINT "DoctorSchedule_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorLeave" ADD CONSTRAINT "DoctorLeave_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nurse" ADD CONSTRAINT "Nurse_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NurseSchedule" ADD CONSTRAINT "NurseSchedule_nurseId_fkey" FOREIGN KEY ("nurseId") REFERENCES "Nurse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_nurseId_fkey" FOREIGN KEY ("nurseId") REFERENCES "Nurse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "Ward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemAdmin" ADD CONSTRAINT "SystemAdmin_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminLog" ADD CONSTRAINT "AdminLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "SystemAdmin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientSupportCase" ADD CONSTRAINT "PatientSupportCase_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientSupportCase" ADD CONSTRAINT "PatientSupportCase_socialWorkerId_fkey" FOREIGN KEY ("socialWorkerId") REFERENCES "SocialWorker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncentiveRecord" ADD CONSTRAINT "IncentiveRecord_programId_fkey" FOREIGN KEY ("programId") REFERENCES "IncentiveProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientAddress" ADD CONSTRAINT "PatientAddress_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NextOfKin" ADD CONSTRAINT "NextOfKin_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsuranceInfo" ADD CONSTRAINT "InsuranceInfo_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Allergy" ADD CONSTRAINT "Allergy_medicalRecordId_fkey" FOREIGN KEY ("medicalRecordId") REFERENCES "MedicalRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnosis" ADD CONSTRAINT "Diagnosis_medicalRecordId_fkey" FOREIGN KEY ("medicalRecordId") REFERENCES "MedicalRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VitalSign" ADD CONSTRAINT "VitalSign_medicalRecordId_fkey" FOREIGN KEY ("medicalRecordId") REFERENCES "MedicalRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admission" ADD CONSTRAINT "Admission_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admission" ADD CONSTRAINT "Admission_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "Ward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admission" ADD CONSTRAINT "Admission_bedId_fkey" FOREIGN KEY ("bedId") REFERENCES "Bed"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discharge" ADD CONSTRAINT "Discharge_admissionId_fkey" FOREIGN KEY ("admissionId") REFERENCES "Admission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_admissionId_fkey" FOREIGN KEY ("admissionId") REFERENCES "Admission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_fromWardId_fkey" FOREIGN KEY ("fromWardId") REFERENCES "Ward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_toWardId_fkey" FOREIGN KEY ("toWardId") REFERENCES "Ward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bed" ADD CONSTRAINT "Bed_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "Ward"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ward" ADD CONSTRAINT "Ward_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "Ward"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueEntry" ADD CONSTRAINT "QueueEntry_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueEntry" ADD CONSTRAINT "QueueEntry_serviceCounterId_fkey" FOREIGN KEY ("serviceCounterId") REFERENCES "ServiceCounter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueEntry" ADD CONSTRAINT "QueueEntry_queueStatusId_fkey" FOREIGN KEY ("queueStatusId") REFERENCES "QueueStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceCounter" ADD CONSTRAINT "ServiceCounter_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalNote" ADD CONSTRAINT "ClinicalNote_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalNote" ADD CONSTRAINT "ClinicalNote_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressNote" ADD CONSTRAINT "ProgressNote_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressNote" ADD CONSTRAINT "ProgressNote_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SOAPNote" ADD CONSTRAINT "SOAPNote_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SOAPNote" ADD CONSTRAINT "SOAPNote_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalTask" ADD CONSTRAINT "ClinicalTask_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_visitTypeId_fkey" FOREIGN KEY ("visitTypeId") REFERENCES "VisitType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentStatus" ADD CONSTRAINT "AppointmentStatus_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmergencyCase" ADD CONSTRAINT "EmergencyCase_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmergencyCase" ADD CONSTRAINT "EmergencyCase_triageId_fkey" FOREIGN KEY ("triageId") REFERENCES "Triage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmergencyCase" ADD CONSTRAINT "EmergencyCase_admissionId_fkey" FOREIGN KEY ("admissionId") REFERENCES "Admission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Triage" ADD CONSTRAINT "Triage_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmergencyLog" ADD CONSTRAINT "EmergencyLog_emergencyCaseId_fkey" FOREIGN KEY ("emergencyCaseId") REFERENCES "EmergencyCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaternityCase" ADD CONSTRAINT "MaternityCase_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryRecord" ADD CONSTRAINT "DeliveryRecord_maternityCaseId_fkey" FOREIGN KEY ("maternityCaseId") REFERENCES "MaternityCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ANCVisit" ADD CONSTRAINT "ANCVisit_maternityCaseId_fkey" FOREIGN KEY ("maternityCaseId") REFERENCES "MaternityCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PNCVisit" ADD CONSTRAINT "PNCVisit_maternityCaseId_fkey" FOREIGN KEY ("maternityCaseId") REFERENCES "MaternityCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VaccinationRecord" ADD CONSTRAINT "VaccinationRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VaccinationRecord" ADD CONSTRAINT "VaccinationRecord_vaccineId_fkey" FOREIGN KEY ("vaccineId") REFERENCES "Vaccine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VaccinationRecord" ADD CONSTRAINT "VaccinationRecord_immunizationScheduleId_fkey" FOREIGN KEY ("immunizationScheduleId") REFERENCES "ImmunizationSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Surgery" ADD CONSTRAINT "Surgery_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Surgery" ADD CONSTRAINT "Surgery_theatreId_fkey" FOREIGN KEY ("theatreId") REFERENCES "Theatre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Surgery" ADD CONSTRAINT "Surgery_surgicalTeamId_fkey" FOREIGN KEY ("surgicalTeamId") REFERENCES "SurgicalTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Surgery" ADD CONSTRAINT "Surgery_preOpAssessmentId_fkey" FOREIGN KEY ("preOpAssessmentId") REFERENCES "PreOpAssessment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Theatre" ADD CONSTRAINT "Theatre_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreOpAssessment" ADD CONSTRAINT "PreOpAssessment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabResult" ADD CONSTRAINT "LabResult_labRequestId_fkey" FOREIGN KEY ("labRequestId") REFERENCES "LabRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabRequest" ADD CONSTRAINT "LabRequest_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabRequest" ADD CONSTRAINT "LabRequest_labTestId_fkey" FOREIGN KEY ("labTestId") REFERENCES "LabTest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabRequest" ADD CONSTRAINT "LabRequest_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "Sample"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sample" ADD CONSTRAINT "Sample_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RadiologyResult" ADD CONSTRAINT "RadiologyResult_imagingOrderId_fkey" FOREIGN KEY ("imagingOrderId") REFERENCES "ImagingOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImagingOrder" ADD CONSTRAINT "ImagingOrder_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImagingOrder" ADD CONSTRAINT "ImagingOrder_radiologyTestId_fkey" FOREIGN KEY ("radiologyTestId") REFERENCES "RadiologyTest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanImage" ADD CONSTRAINT "ScanImage_radiologyResultId_fkey" FOREIGN KEY ("radiologyResultId") REFERENCES "RadiologyResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PharmacyItem" ADD CONSTRAINT "PharmacyItem_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "Drug"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "Drug"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispenseRecord" ADD CONSTRAINT "DispenseRecord_pharmacyItemId_fkey" FOREIGN KEY ("pharmacyItemId") REFERENCES "PharmacyItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispenseRecord" ADD CONSTRAINT "DispenseRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispensaryStock" ADD CONSTRAINT "DispensaryStock_dispensaryId_fkey" FOREIGN KEY ("dispensaryId") REFERENCES "Dispensary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispensaryStock" ADD CONSTRAINT "DispensaryStock_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "Drug"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SterilizationCycle" ADD CONSTRAINT "SterilizationCycle_cssdItemId_fkey" FOREIGN KEY ("cssdItemId") REFERENCES "CSSDItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstrumentRequest" ADD CONSTRAINT "InstrumentRequest_cssdItemId_fkey" FOREIGN KEY ("cssdItemId") REFERENCES "CSSDItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstrumentRequest" ADD CONSTRAINT "InstrumentRequest_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HelpTicket" ADD CONSTRAINT "HelpTicket_supportAgentId_fkey" FOREIGN KEY ("supportAgentId") REFERENCES "SupportAgent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVerificationStatus" ADD CONSTRAINT "UserVerificationStatus_verificationTokenId_fkey" FOREIGN KEY ("verificationTokenId") REFERENCES "VerificationToken"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingItem" ADD CONSTRAINT "BillingItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_ledgerId_fkey" FOREIGN KEY ("ledgerId") REFERENCES "Ledger"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrialBalance" ADD CONSTRAINT "TrialBalance_ledgerId_fkey" FOREIGN KEY ("ledgerId") REFERENCES "Ledger"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_claimBatchId_fkey" FOREIGN KEY ("claimBatchId") REFERENCES "ClaimBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_claimStatusId_fkey" FOREIGN KEY ("claimStatusId") REFERENCES "ClaimStatus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClaimSubmission" ADD CONSTRAINT "ClaimSubmission_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NHIFClaim" ADD CONSTRAINT "NHIFClaim_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NHIFClaim" ADD CONSTRAINT "NHIFClaim_nhifBenefitId_fkey" FOREIGN KEY ("nhifBenefitId") REFERENCES "NHIFBenefit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NHIFSubmission" ADD CONSTRAINT "NHIFSubmission_nhifClaimId_fkey" FOREIGN KEY ("nhifClaimId") REFERENCES "NHIFClaim"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpiryAlert" ADD CONSTRAINT "ExpiryAlert_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceivedNote" ADD CONSTRAINT "GoodsReceivedNote_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubstoreTransfer" ADD CONSTRAINT "SubstoreTransfer_fromSubstoreId_fkey" FOREIGN KEY ("fromSubstoreId") REFERENCES "Substore"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubstoreTransfer" ADD CONSTRAINT "SubstoreTransfer_toSubstoreId_fkey" FOREIGN KEY ("toSubstoreId") REFERENCES "Substore"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubstoreTransfer" ADD CONSTRAINT "SubstoreTransfer_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requisition" ADD CONSTRAINT "Requisition_substoreId_fkey" FOREIGN KEY ("substoreId") REFERENCES "Substore"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requisition" ADD CONSTRAINT "Requisition_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepreciationSchedule" ADD CONSTRAINT "DepreciationSchedule_fixedAssetId_fkey" FOREIGN KEY ("fixedAssetId") REFERENCES "FixedAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetAudit" ADD CONSTRAINT "AssetAudit_fixedAssetId_fkey" FOREIGN KEY ("fixedAssetId") REFERENCES "FixedAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reportTemplateId_fkey" FOREIGN KEY ("reportTemplateId") REFERENCES "ReportTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportSchedule" ADD CONSTRAINT "ReportSchedule_reportTemplateId_fkey" FOREIGN KEY ("reportTemplateId") REFERENCES "ReportTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportField" ADD CONSTRAINT "ReportField_customReportId_fkey" FOREIGN KEY ("customReportId") REFERENCES "CustomReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportFilter" ADD CONSTRAINT "ReportFilter_customReportId_fkey" FOREIGN KEY ("customReportId") REFERENCES "CustomReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referringDoctorId_fkey" FOREIGN KEY ("referringDoctorId") REFERENCES "ReferringDoctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referralSourceId_fkey" FOREIGN KEY ("referralSourceId") REFERENCES "ReferralSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RolePermissions" ADD CONSTRAINT "_RolePermissions_A_fkey" FOREIGN KEY ("A") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RolePermissions" ADD CONSTRAINT "_RolePermissions_B_fkey" FOREIGN KEY ("B") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
