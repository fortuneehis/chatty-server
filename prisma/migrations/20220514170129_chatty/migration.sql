-- AlterTable
ALTER TABLE `User` ADD COLUMN `status` ENUM('ONLINE', 'OFFLINE') NOT NULL DEFAULT 'OFFLINE';
