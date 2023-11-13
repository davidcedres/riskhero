/*
  Warnings:

  - Added the required column `url` to the `Evidence` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Evidence" ADD COLUMN     "url" TEXT NOT NULL;
