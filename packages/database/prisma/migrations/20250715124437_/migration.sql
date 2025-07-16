-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "bindingFormId" TEXT,
ALTER COLUMN "screenshot" DROP NOT NULL,
ALTER COLUMN "receiveReviewCount" DROP NOT NULL,
ALTER COLUMN "submitReviewCount" DROP NOT NULL,
ALTER COLUMN "taskReviewCount" DROP NOT NULL;
