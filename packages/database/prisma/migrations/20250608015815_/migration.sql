/*
  Warnings:

  - Made the column `reviewerName` on table `Review` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_formId_fkey";

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "formId" DROP NOT NULL,
ALTER COLUMN "reviewerName" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE SET NULL ON UPDATE CASCADE;
