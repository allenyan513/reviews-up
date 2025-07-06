-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ReviewSource" ADD VALUE 'csv';
ALTER TYPE "ReviewSource" ADD VALUE 'yelp';
ALTER TYPE "ReviewSource" ADD VALUE 'g2';
ALTER TYPE "ReviewSource" ADD VALUE 'appsumo';
ALTER TYPE "ReviewSource" ADD VALUE 'amazon';
ALTER TYPE "ReviewSource" ADD VALUE 'capterra';
ALTER TYPE "ReviewSource" ADD VALUE 'producthunt';
ALTER TYPE "ReviewSource" ADD VALUE 'tiktok';
ALTER TYPE "ReviewSource" ADD VALUE 'instagram';
ALTER TYPE "ReviewSource" ADD VALUE 'linkedin';
ALTER TYPE "ReviewSource" ADD VALUE 'youtube';
ALTER TYPE "ReviewSource" ADD VALUE 'vimeo';
ALTER TYPE "ReviewSource" ADD VALUE 'wistia';
ALTER TYPE "ReviewSource" ADD VALUE 'soundcloud';
