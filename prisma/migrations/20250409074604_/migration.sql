/*
  Warnings:

  - You are about to drop the column `isLaboratoryWork` on the `posts` table. All the data in the column will be lost.
  - Added the required column `laboratoryWorkId` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Semester" AS ENUM ('SPRING', 'AUTUMN');

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "isLaboratoryWork",
ADD COLUMN     "laboratoryWorkId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "LaboratoryWork" (
    "id" SERIAL NOT NULL,
    "course" INTEGER NOT NULL,
    "semester" "Semester" NOT NULL,

    CONSTRAINT "LaboratoryWork_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_laboratoryWorkId_fkey" FOREIGN KEY ("laboratoryWorkId") REFERENCES "LaboratoryWork"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
