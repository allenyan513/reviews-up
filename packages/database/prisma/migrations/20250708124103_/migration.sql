/*
  Warnings:

  - The values [pendingFroSubmit] on the enum `ProductStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProductStatus_new" AS ENUM ('waitingForAdminReview', 'rejected', 'pendingForSubmit', 'pendingForReceive', 'listing');
ALTER TABLE "Product" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Product" ALTER COLUMN "status" TYPE "ProductStatus_new" USING ("status"::text::"ProductStatus_new");
ALTER TYPE "ProductStatus" RENAME TO "ProductStatus_old";
ALTER TYPE "ProductStatus_new" RENAME TO "ProductStatus";
DROP TYPE "ProductStatus_old";
ALTER TABLE "Product" ALTER COLUMN "status" SET DEFAULT 'waitingForAdminReview';
COMMIT;
