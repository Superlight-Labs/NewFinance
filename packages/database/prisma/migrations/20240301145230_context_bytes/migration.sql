/*
  Warnings:

  - Made the column `deriveContext` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `deriveContext` LONGBLOB NULL;
