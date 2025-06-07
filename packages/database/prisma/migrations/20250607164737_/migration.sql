/*
  Warnings:

  - The `status` column on the `Review` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `formId` on the `Widget` table. All the data in the column will be lost.
  - The `type` column on the `Widget` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `workspaceId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workspaceId` to the `Widget` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('pending', 'public', 'hidden');

-- CreateEnum
CREATE TYPE "WidgetType" AS ENUM ('grid', 'list', 'carousel', 'masonry');

-- DropForeignKey
ALTER TABLE "Widget" DROP CONSTRAINT "Widget_formId_fkey";

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "workspaceId" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "ReviewStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "Widget" DROP COLUMN "formId",
ADD COLUMN     "workspaceId" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "WidgetType" NOT NULL DEFAULT 'grid';

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Widget" ADD CONSTRAINT "Widget_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
