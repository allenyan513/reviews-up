-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('free', 'pro');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "github" TEXT,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "pinterest" TEXT,
ADD COLUMN     "subscriptionTier" "SubscriptionTier" NOT NULL DEFAULT 'free',
ADD COLUMN     "tiktok" TEXT,
ADD COLUMN     "twitter" TEXT,
ADD COLUMN     "website" TEXT,
ADD COLUMN     "youtube" TEXT;
