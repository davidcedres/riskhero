/*
  Warnings:

  - Added the required column `updatedAt` to the `Inspection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "State" ADD VALUE 'SKIPPED';

-- AlterTable
ALTER TABLE "Inspection" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
