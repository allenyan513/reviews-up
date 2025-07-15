/*
  Warnings:

  - Made the column `description` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `icon` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `screenshot` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `category` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "reviewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "reviewRating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "description" SET DEFAULT '',
ALTER COLUMN "icon" SET NOT NULL,
ALTER COLUMN "icon" SET DEFAULT '',
ALTER COLUMN "screenshot" SET NOT NULL,
ALTER COLUMN "screenshot" SET DEFAULT '',
ALTER COLUMN "category" SET NOT NULL,
ALTER COLUMN "category" SET DEFAULT 'ai';
