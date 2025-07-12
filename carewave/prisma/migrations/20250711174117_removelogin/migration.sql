/*
  Warnings:

  - You are about to drop the `EmailVerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LoginAttempt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserLogin` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EmailVerificationToken" DROP CONSTRAINT "EmailVerificationToken_userRegistrationId_fkey";

-- DropForeignKey
ALTER TABLE "LoginAttempt" DROP CONSTRAINT "LoginAttempt_userLoginId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userLoginId_fkey";

-- DropForeignKey
ALTER TABLE "UserRegistration" DROP CONSTRAINT "UserRegistration_email_fkey";

-- DropTable
DROP TABLE "EmailVerificationToken";

-- DropTable
DROP TABLE "LoginAttempt";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "UserLogin";
