/*
  Warnings:

  - You are about to drop the column `roleID` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the column `laboratoryID` on the `UserLaboratories` table. All the data in the column will be lost.
  - You are about to drop the column `roleID` on the `UserLaboratories` table. All the data in the column will be lost.
  - You are about to drop the column `userID` on the `UserLaboratories` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[roleId,permissionID]` on the table `RolePermission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roleId` to the `RolePermission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `laboratoryId` to the `UserLaboratories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleId` to the `UserLaboratories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `UserLaboratories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_roleID_fkey";

-- DropForeignKey
ALTER TABLE "UserLaboratories" DROP CONSTRAINT "UserLaboratories_laboratoryID_fkey";

-- DropForeignKey
ALTER TABLE "UserLaboratories" DROP CONSTRAINT "UserLaboratories_roleID_fkey";

-- DropForeignKey
ALTER TABLE "UserLaboratories" DROP CONSTRAINT "UserLaboratories_userID_fkey";

-- DropIndex
DROP INDEX "RolePermission_roleID_permissionID_key";

-- DropIndex
DROP INDEX "UserLaboratories_userID_laboratoryID_idx";

-- AlterTable
ALTER TABLE "RolePermission" DROP COLUMN "roleID",
ADD COLUMN     "roleId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "UserLaboratories" DROP COLUMN "laboratoryID",
DROP COLUMN "roleID",
DROP COLUMN "userID",
ADD COLUMN     "laboratoryId" INTEGER NOT NULL,
ADD COLUMN     "roleId" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_permissionID_key" ON "RolePermission"("roleId", "permissionID");

-- CreateIndex
CREATE INDEX "UserLaboratories_userId_laboratoryId_idx" ON "UserLaboratories"("userId", "laboratoryId");

-- AddForeignKey
ALTER TABLE "UserLaboratories" ADD CONSTRAINT "UserLaboratories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLaboratories" ADD CONSTRAINT "UserLaboratories_laboratoryId_fkey" FOREIGN KEY ("laboratoryId") REFERENCES "Laboratory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLaboratories" ADD CONSTRAINT "UserLaboratories_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
