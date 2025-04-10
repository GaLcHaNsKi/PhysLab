/*
  Warnings:

  - A unique constraint covering the columns `[userId,laboratoryId]` on the table `user_laboratories` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_laboratoryWorkId_fkey";

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "laboratoryWorkId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_laboratories_userId_laboratoryId_key" ON "user_laboratories"("userId", "laboratoryId");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_laboratoryWorkId_fkey" FOREIGN KEY ("laboratoryWorkId") REFERENCES "LaboratoryWork"("id") ON DELETE SET NULL ON UPDATE CASCADE;
