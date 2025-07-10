/*
  Warnings:

  - You are about to drop the column `status` on the `Order` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'completed');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'paid', 'unpaid', 'no_payment_required');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "status",
ADD COLUMN     "orderStatus" "OrderStatus" NOT NULL DEFAULT 'pending',
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'pending';

-- DropEnum
DROP TYPE "OrdersStatus";
