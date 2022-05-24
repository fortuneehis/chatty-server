-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_parentId_fkey`;

-- AlterTable
ALTER TABLE `Message` MODIFY `parentId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Message`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
