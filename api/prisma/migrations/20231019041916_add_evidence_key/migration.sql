/*
  Warnings:

  - You are about to drop the column `url` on the `Evidence` table. All the data in the column will be lost.
  - Added the required column `key` to the `Evidence` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Evidence" DROP COLUMN "url",
ADD COLUMN     "key" TEXT NOT NULL;
