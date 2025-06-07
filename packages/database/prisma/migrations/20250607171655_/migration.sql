/*
  Warnings:

  - You are about to drop the column `userEmail` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `userImage` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `Review` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Form` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Widget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "userEmail",
DROP COLUMN "userImage",
DROP COLUMN "userName",
ADD COLUMN     "reviewerEmail" TEXT,
ADD COLUMN     "reviewerImage" TEXT,
ADD COLUMN     "reviewerName" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Widget" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Widget" ADD CONSTRAINT "Widget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
