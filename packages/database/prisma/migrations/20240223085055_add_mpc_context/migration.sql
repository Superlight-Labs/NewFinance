-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `devicePublicKey` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deriveContext` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_id_devicePublicKey_key`(`id`, `devicePublicKey`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExternalAddress` (
    `address` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `userEmail` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ExternalAddress_userEmail_idx`(`userEmail`),
    PRIMARY KEY (`address`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaction` (
    `hash` VARCHAR(191) NOT NULL,
    `recieverAddress` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `senderAddress` VARCHAR(191) NOT NULL,
    `note` VARCHAR(191) NULL,

    INDEX `Transaction_recieverAddress_idx`(`recieverAddress`),
    INDEX `Transaction_senderAddress_idx`(`senderAddress`),
    PRIMARY KEY (`hash`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MpcKeyShare` (
    `id` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `value` VARCHAR(2000) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `userDevicePublicKey` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `MpcKeyShare_userId_userDevicePublicKey_idx`(`userId`, `userDevicePublicKey`),
    UNIQUE INDEX `MpcKeyShare_userId_path_key`(`userId`, `path`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
