/*
  Warnings:

  - You are about to drop the column `createdDate` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Chat` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Message` DROP COLUMN `createdDate`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
