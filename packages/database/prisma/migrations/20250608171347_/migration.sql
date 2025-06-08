/*
  Warnings:

  - You are about to drop the column `twitterUrl` on the `Review` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Review" DROP COLUMN "twitterUrl",
ADD COLUMN     "tweetId" TEXT;
