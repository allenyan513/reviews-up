-- AlterEnum
ALTER TYPE "ProductStatus" ADD VALUE 'draft';

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "status" SET DEFAULT 'waitingForAdminReview';
