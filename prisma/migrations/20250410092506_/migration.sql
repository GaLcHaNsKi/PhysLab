/*
  Warnings:

  - You are about to drop the column `deletedById` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `comments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_deletedById_fkey";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "deletedById",
DROP COLUMN "isDeleted";
