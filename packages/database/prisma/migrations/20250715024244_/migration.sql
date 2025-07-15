/*
  Warnings:

  - You are about to drop the column `workspaceId` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `workspaceId` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `formId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `formShortId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `reviewCount` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `reviewRating` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `showcaseId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `showcaseShortId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `workspaceId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `workspaceId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the `Showcase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Workspace` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productId` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Form` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Campaign" DROP CONSTRAINT "Campaign_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "Form" DROP CONSTRAINT "Form_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_formId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_showcaseId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "Showcase" DROP CONSTRAINT "Showcase_userId_fkey";

-- DropForeignKey
ALTER TABLE "Showcase" DROP CONSTRAINT "Showcase_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "Workspace" DROP CONSTRAINT "Workspace_userId_fkey";

-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "workspaceId",
ADD COLUMN     "productId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Form" DROP COLUMN "workspaceId",
ADD COLUMN     "productId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "formId",
DROP COLUMN "formShortId",
DROP COLUMN "reviewCount",
DROP COLUMN "reviewRating",
DROP COLUMN "showcaseId",
DROP COLUMN "showcaseShortId",
DROP COLUMN "workspaceId";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "workspaceId",
ADD COLUMN     "productId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Showcase";

-- DropTable
DROP TABLE "Workspace";

-- CreateTable
CREATE TABLE "Widget" (
    "id" TEXT NOT NULL,
    "shortId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "config" JSONB DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Widget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Widget_shortId_key" ON "Widget"("shortId");

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Widget" ADD CONSTRAINT "Widget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Widget" ADD CONSTRAINT "Widget_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
