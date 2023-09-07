/*
  Warnings:

  - You are about to drop the column `quantity` on the `WishListItem` table. All the data in the column will be lost.
  - Added the required column `executedAt` to the `LoginAttempt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image1` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewimage` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LoginAttempt" ADD COLUMN     "executedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "orderId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "image1" TEXT NOT NULL,
ADD COLUMN     "image2" TEXT,
ADD COLUMN     "image3" TEXT,
ADD COLUMN     "image4" TEXT,
ADD COLUMN     "previewimage" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RetiredPassword" ALTER COLUMN "retiredAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "WishListItem" DROP COLUMN "quantity";

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
