-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `emailVerified` DATETIME(3) NULL,
    `password` VARCHAR(191) NULL,
    `icon` VARCHAR(191) NULL,
    `point` INTEGER NULL,
    `bio` VARCHAR(191) NULL,
    `link` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `authority` VARCHAR(191) NULL,
    `birthday` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `accessedAt` DATETIME(3) NULL,
    `lastLogin` DATETIME(3) NULL,

    UNIQUE INDEX `User_userId_key`(`userId`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRemember` (
    `rememberToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `device` VARCHAR(191) NULL,
    `disableDate` DATETIME(3) NULL,

    PRIMARY KEY (`rememberToken`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Posts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `postId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL DEFAULT '',
    `body` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NULL,
    `pin` INTEGER NULL,
    `noindex` BOOLEAN NULL,
    `draft` BOOLEAN NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update` DATETIME(3) NULL,
    `flags` INTEGER NULL,
    `memo` VARCHAR(191) NULL,

    INDEX `Posts_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Posts` ADD CONSTRAINT `Posts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
