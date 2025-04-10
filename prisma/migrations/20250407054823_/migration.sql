/*
  Warnings:

  - The primary key for the `Permission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Description` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `ID` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `Name` on the `Permission` table. All the data in the column will be lost.
  - The primary key for the `Role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Description` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `ID` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `Name` on the `Role` table. All the data in the column will be lost.
  - The primary key for the `RolePermission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ID` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the column `PermissionID` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the column `RoleID` on the `RolePermission` table. All the data in the column will be lost.
  - The primary key for the `UserLaboratories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ID` on the `UserLaboratories` table. All the data in the column will be lost.
  - You are about to drop the column `JoinedAt` on the `UserLaboratories` table. All the data in the column will be lost.
  - You are about to drop the column `LaboratoryID` on the `UserLaboratories` table. All the data in the column will be lost.
  - You are about to drop the column `RoleID` on the `UserLaboratories` table. All the data in the column will be lost.
  - You are about to drop the column `UserID` on the `UserLaboratories` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[roleID,permissionID]` on the table `RolePermission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `permissionID` to the `RolePermission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleID` to the `RolePermission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `laboratoryID` to the `UserLaboratories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleID` to the `UserLaboratories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userID` to the `UserLaboratories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_PermissionID_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_RoleID_fkey";

-- DropForeignKey
ALTER TABLE "UserLaboratories" DROP CONSTRAINT "UserLaboratories_LaboratoryID_fkey";

-- DropForeignKey
ALTER TABLE "UserLaboratories" DROP CONSTRAINT "UserLaboratories_RoleID_fkey";

-- DropForeignKey
ALTER TABLE "UserLaboratories" DROP CONSTRAINT "UserLaboratories_UserID_fkey";

-- DropIndex
DROP INDEX "Permission_Name_key";

-- DropIndex
DROP INDEX "Role_Name_key";

-- DropIndex
DROP INDEX "RolePermission_RoleID_PermissionID_key";

-- DropIndex
DROP INDEX "UserLaboratories_UserID_LaboratoryID_idx";

-- AlterTable
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_pkey",
DROP COLUMN "Description",
DROP COLUMN "ID",
DROP COLUMN "Name",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD CONSTRAINT "Permission_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Role" DROP CONSTRAINT "Role_pkey",
DROP COLUMN "Description",
DROP COLUMN "ID",
DROP COLUMN "Name",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD CONSTRAINT "Role_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_pkey",
DROP COLUMN "ID",
DROP COLUMN "PermissionID",
DROP COLUMN "RoleID",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "permissionID" INTEGER NOT NULL,
ADD COLUMN     "roleID" INTEGER NOT NULL,
ADD CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "UserLaboratories" DROP CONSTRAINT "UserLaboratories_pkey",
DROP COLUMN "ID",
DROP COLUMN "JoinedAt",
DROP COLUMN "LaboratoryID",
DROP COLUMN "RoleID",
DROP COLUMN "UserID",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "joinedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "laboratoryID" INTEGER NOT NULL,
ADD COLUMN     "roleID" INTEGER NOT NULL,
ADD COLUMN     "userID" INTEGER NOT NULL,
ADD CONSTRAINT "UserLaboratories_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleID_permissionID_key" ON "RolePermission"("roleID", "permissionID");

-- CreateIndex
CREATE INDEX "UserLaboratories_userID_laboratoryID_idx" ON "UserLaboratories"("userID", "laboratoryID");

-- AddForeignKey
ALTER TABLE "UserLaboratories" ADD CONSTRAINT "UserLaboratories_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLaboratories" ADD CONSTRAINT "UserLaboratories_laboratoryID_fkey" FOREIGN KEY ("laboratoryID") REFERENCES "Laboratory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLaboratories" ADD CONSTRAINT "UserLaboratories_roleID_fkey" FOREIGN KEY ("roleID") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleID_fkey" FOREIGN KEY ("roleID") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionID_fkey" FOREIGN KEY ("permissionID") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
