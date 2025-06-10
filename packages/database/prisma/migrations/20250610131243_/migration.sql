/*
  Warnings:

  - You are about to drop the column `type` on the `Showcase` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Showcase" DROP COLUMN "type",
ADD COLUMN     "config" JSONB DEFAULT '{}';

-- DropEnum
DROP TYPE "ShowcaseType";
