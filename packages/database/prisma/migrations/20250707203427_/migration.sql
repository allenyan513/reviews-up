/*
  Warnings:

  - You are about to drop the column `taskCount` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "taskCount",
ADD COLUMN     "receiveReviewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "submitReviewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "taskReviewCount" INTEGER NOT NULL DEFAULT 0;
