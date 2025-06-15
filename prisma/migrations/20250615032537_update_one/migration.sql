/*
  Warnings:

  - You are about to drop the column `description` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `account` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `order` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `orderNumber` to the `product` table without a default value. This is not possible if the table is not empty.
  - Made the column `photo` on table `rechargerecord` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `order_productId_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `order_userId_fkey`;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `description`,
    DROP COLUMN `image`,
    ADD COLUMN `orderNumber` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `rechargerecord` MODIFY `photo` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `account`,
    ADD COLUMN `leftTask` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `remarks` VARCHAR(191) NULL,
    ADD COLUMN `todayTask` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `totalTask` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `walletAddress` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `order`;

-- CreateTable
CREATE TABLE `message` (
    `id` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profitCard` (
    `id` VARCHAR(191) NOT NULL,
    `orderNumber` INTEGER NOT NULL,
    `profit` INTEGER NOT NULL,
    `priceDifference` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `profitCard` ADD CONSTRAINT `profitCard_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
