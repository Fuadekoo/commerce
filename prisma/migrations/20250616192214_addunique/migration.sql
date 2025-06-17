/*
  Warnings:

  - A unique constraint covering the columns `[orderNumber]` on the table `product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderNumber,userId]` on the table `profitCard` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `product_orderNumber_key` ON `product`(`orderNumber`);

-- CreateIndex
CREATE UNIQUE INDEX `profitCard_orderNumber_userId_key` ON `profitCard`(`orderNumber`, `userId`);
