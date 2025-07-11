-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "formShortId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "widgetShortId" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_widgetId_fkey" FOREIGN KEY ("widgetId") REFERENCES "Showcase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
