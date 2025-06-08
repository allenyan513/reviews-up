-- CreateEnum
CREATE TYPE "ReviewSource" AS ENUM ('manual', 'json', 'x', 'google', 'facebook', 'trustpilot');

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "source" "ReviewSource" NOT NULL DEFAULT 'manual';
