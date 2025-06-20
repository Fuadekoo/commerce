/*
  Warnings:

  - You are about to alter the column `balance` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Int`.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `balance` INTEGER NOT NULL DEFAULT 0;
