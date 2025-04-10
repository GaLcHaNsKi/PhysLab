/*
  Warnings:

  - You are about to drop the column `permissionID` on the `RolePermission` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[roleId,permissionId]` on the table `RolePermission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `permissionId` to the `RolePermission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_permissionID_fkey";

-- DropIndex
DROP INDEX "RolePermission_roleId_permissionID_key";

-- AlterTable
ALTER TABLE "RolePermission" DROP COLUMN "permissionID",
ADD COLUMN     "permissionId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON "RolePermission"("roleId", "permissionId");

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
