/*
  Warnings:

  - You are about to drop the column `widgetId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `widgetShortId` on the `Product` table. All the data in the column will be lost.
  - Added the required column `showcaseId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_widgetId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "widgetId",
DROP COLUMN "widgetShortId",
ADD COLUMN     "showcaseId" TEXT NOT NULL,
ADD COLUMN     "showcaseShortId" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_showcaseId_fkey" FOREIGN KEY ("showcaseId") REFERENCES "Showcase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
