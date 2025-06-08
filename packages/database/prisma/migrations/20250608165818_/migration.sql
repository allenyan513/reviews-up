/*
  Warnings:

  - The values [x] on the enum `ReviewSource` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReviewSource_new" AS ENUM ('manual', 'json', 'twitter', 'google', 'facebook', 'trustpilot');
ALTER TABLE "Review" ALTER COLUMN "source" DROP DEFAULT;
ALTER TABLE "Review" ALTER COLUMN "source" TYPE "ReviewSource_new" USING ("source"::text::"ReviewSource_new");
ALTER TYPE "ReviewSource" RENAME TO "ReviewSource_old";
ALTER TYPE "ReviewSource_new" RENAME TO "ReviewSource";
DROP TYPE "ReviewSource_old";
ALTER TABLE "Review" ALTER COLUMN "source" SET DEFAULT 'manual';
COMMIT;
