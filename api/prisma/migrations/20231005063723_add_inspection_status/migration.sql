/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Condition` table. All the data in the column will be lost.
  - Added the required column `status` to the `Inspection` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('OPEN', 'CLOSED', 'DONE');

-- DropForeignKey
ALTER TABLE "Condition" DROP CONSTRAINT "Condition_categoryId_fkey";

-- AlterTable
ALTER TABLE "Condition" DROP COLUMN "categoryId";

-- AlterTable
ALTER TABLE "Inspection" ADD COLUMN     "status" "Status" NOT NULL;

-- CreateTable
CREATE TABLE "_CategoryToCondition" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToCondition_AB_unique" ON "_CategoryToCondition"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToCondition_B_index" ON "_CategoryToCondition"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToCondition" ADD CONSTRAINT "_CategoryToCondition_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToCondition" ADD CONSTRAINT "_CategoryToCondition_B_fkey" FOREIGN KEY ("B") REFERENCES "Condition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
