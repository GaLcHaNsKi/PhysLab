/*
  Warnings:

  - The primary key for the `Laboratory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `CreatedAt` on the `Laboratory` table. All the data in the column will be lost.
  - You are about to drop the column `Description` on the `Laboratory` table. All the data in the column will be lost.
  - You are about to drop the column `ID` on the `Laboratory` table. All the data in the column will be lost.
  - You are about to drop the column `Name` on the `Laboratory` table. All the data in the column will be lost.
  - You are about to drop the column `OwnerID` on the `Laboratory` table. All the data in the column will be lost.
  - You are about to drop the column `Visibility` on the `Laboratory` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `CreatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `Email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `ID` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `LastLoginAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `Name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `Nickname` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `PasswordHash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `Surname` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Laboratory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nickname]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Laboratory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerID` to the `Laboratory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visibility` to the `Laboratory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nickname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_AuthorID_fkey";

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_DeletedByID_fkey";

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_EditedByID_fkey";

-- DropForeignKey
ALTER TABLE "EquipmentLaboratories" DROP CONSTRAINT "EquipmentLaboratories_LaboratoryID_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_UploadedByID_fkey";

-- DropForeignKey
ALTER TABLE "Laboratory" DROP CONSTRAINT "Laboratory_OwnerID_fkey";

-- DropForeignKey
ALTER TABLE "LaboratoryWorker" DROP CONSTRAINT "LaboratoryWorker_LaboratoryID_fkey";

-- DropForeignKey
ALTER TABLE "Posts" DROP CONSTRAINT "Posts_AuthorID_fkey";

-- DropForeignKey
ALTER TABLE "Posts" DROP CONSTRAINT "Posts_DeletedByID_fkey";

-- DropForeignKey
ALTER TABLE "Posts" DROP CONSTRAINT "Posts_EditedByID_fkey";

-- DropForeignKey
ALTER TABLE "Posts" DROP CONSTRAINT "Posts_LaboratoryID_fkey";

-- DropForeignKey
ALTER TABLE "UserLaboratories" DROP CONSTRAINT "UserLaboratories_LaboratoryID_fkey";

-- DropForeignKey
ALTER TABLE "UserLaboratories" DROP CONSTRAINT "UserLaboratories_UserID_fkey";

-- DropIndex
DROP INDEX "Laboratory_Name_key";

-- DropIndex
DROP INDEX "User_Email_key";

-- DropIndex
DROP INDEX "User_Nickname_key";

-- AlterTable
ALTER TABLE "Laboratory" DROP CONSTRAINT "Laboratory_pkey",
DROP COLUMN "CreatedAt",
DROP COLUMN "Description",
DROP COLUMN "ID",
DROP COLUMN "Name",
DROP COLUMN "OwnerID",
DROP COLUMN "Visibility",
ADD COLUMN     "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "ownerID" INTEGER NOT NULL,
ADD COLUMN     "visibility" "Visibility" NOT NULL,
ADD CONSTRAINT "Laboratory_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "CreatedAt",
DROP COLUMN "Email",
DROP COLUMN "ID",
DROP COLUMN "LastLoginAt",
DROP COLUMN "Name",
DROP COLUMN "Nickname",
DROP COLUMN "PasswordHash",
DROP COLUMN "Surname",
ADD COLUMN     "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "lastLoginAt" TIMESTAMP,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "nickname" TEXT NOT NULL,
ADD COLUMN     "passwordHash" TEXT NOT NULL,
ADD COLUMN     "surname" TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Laboratory_name_key" ON "Laboratory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Laboratory" ADD CONSTRAINT "Laboratory_ownerID_fkey" FOREIGN KEY ("ownerID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLaboratories" ADD CONSTRAINT "UserLaboratories_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLaboratories" ADD CONSTRAINT "UserLaboratories_LaboratoryID_fkey" FOREIGN KEY ("LaboratoryID") REFERENCES "Laboratory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentLaboratories" ADD CONSTRAINT "EquipmentLaboratories_LaboratoryID_fkey" FOREIGN KEY ("LaboratoryID") REFERENCES "Laboratory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaboratoryWorker" ADD CONSTRAINT "LaboratoryWorker_LaboratoryID_fkey" FOREIGN KEY ("LaboratoryID") REFERENCES "Laboratory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_AuthorID_fkey" FOREIGN KEY ("AuthorID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_EditedByID_fkey" FOREIGN KEY ("EditedByID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_DeletedByID_fkey" FOREIGN KEY ("DeletedByID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_AuthorID_fkey" FOREIGN KEY ("AuthorID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_EditedByID_fkey" FOREIGN KEY ("EditedByID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_DeletedByID_fkey" FOREIGN KEY ("DeletedByID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_LaboratoryID_fkey" FOREIGN KEY ("LaboratoryID") REFERENCES "Laboratory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_UploadedByID_fkey" FOREIGN KEY ("UploadedByID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
