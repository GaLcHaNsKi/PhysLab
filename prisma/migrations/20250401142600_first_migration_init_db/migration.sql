-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateTable
CREATE TABLE "User" (
    "ID" SERIAL NOT NULL,
    "Nickname" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "PasswordHash" TEXT NOT NULL,
    "Name" TEXT,
    "Surname" TEXT,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "LastLoginAt" TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Laboratory" (
    "ID" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Description" TEXT,
    "OwnerID" INTEGER NOT NULL,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Visibility" "Visibility" NOT NULL,

    CONSTRAINT "Laboratory_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "UserLaboratories" (
    "ID" SERIAL NOT NULL,
    "UserID" INTEGER NOT NULL,
    "LaboratoryID" INTEGER NOT NULL,
    "RoleID" INTEGER NOT NULL,
    "JoinedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserLaboratories_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Role" (
    "ID" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Description" TEXT,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Permission" (
    "ID" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Description" TEXT,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "ID" SERIAL NOT NULL,
    "RoleID" INTEGER NOT NULL,
    "PermissionID" INTEGER NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Equipment" (
    "ID" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "EquipmentDescription" (
    "ID" SERIAL NOT NULL,
    "EquipmentID" INTEGER NOT NULL,
    "Description" TEXT NOT NULL,

    CONSTRAINT "EquipmentDescription_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "EquipmentLaboratories" (
    "ID" SERIAL NOT NULL,
    "LaboratoryID" INTEGER NOT NULL,
    "EquipmentID" INTEGER NOT NULL,
    "DescriptionID" INTEGER,
    "Quantity" INTEGER NOT NULL,

    CONSTRAINT "EquipmentLaboratories_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "LaboratoryWorker" (
    "ID" SERIAL NOT NULL,
    "LaboratoryID" INTEGER NOT NULL,
    "Name" TEXT NOT NULL,
    "Surname" TEXT NOT NULL,
    "Fathername" TEXT,
    "Email" TEXT,
    "Phone" TEXT,
    "Description" TEXT,

    CONSTRAINT "LaboratoryWorker_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Comments" (
    "ID" SERIAL NOT NULL,
    "Text" TEXT NOT NULL,
    "AuthorID" INTEGER NOT NULL,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "EditedAt" TIMESTAMP,
    "EditedByID" INTEGER,
    "IsDeleted" BOOLEAN NOT NULL DEFAULT false,
    "DeletedByID" INTEGER,
    "IsModerated" BOOLEAN NOT NULL DEFAULT true,
    "PostID" INTEGER NOT NULL,
    "AnswerID" INTEGER,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Posts" (
    "ID" SERIAL NOT NULL,
    "Title" TEXT NOT NULL,
    "Text" TEXT NOT NULL,
    "isLaboratoryWork" BOOLEAN NOT NULL,
    "AuthorID" INTEGER NOT NULL,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "EditedAt" TIMESTAMP,
    "EditedByID" INTEGER,
    "IsDeleted" BOOLEAN NOT NULL DEFAULT false,
    "DeletedByID" INTEGER,
    "tags" TEXT[],
    "LaboratoryID" INTEGER NOT NULL,

    CONSTRAINT "Posts_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "File" (
    "ID" SERIAL NOT NULL,
    "UUIDName" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "UploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UploadedByID" INTEGER NOT NULL,
    "PostID" INTEGER NOT NULL,
    "isImage" BOOLEAN NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("ID")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Nickname_key" ON "User"("Nickname");

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Laboratory_Name_key" ON "Laboratory"("Name");

-- CreateIndex
CREATE INDEX "UserLaboratories_UserID_LaboratoryID_idx" ON "UserLaboratories"("UserID", "LaboratoryID");

-- CreateIndex
CREATE UNIQUE INDEX "Role_Name_key" ON "Role"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_Name_key" ON "Permission"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_RoleID_PermissionID_key" ON "RolePermission"("RoleID", "PermissionID");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_Name_key" ON "Equipment"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "File_UUIDName_key" ON "File"("UUIDName");

-- AddForeignKey
ALTER TABLE "Laboratory" ADD CONSTRAINT "Laboratory_OwnerID_fkey" FOREIGN KEY ("OwnerID") REFERENCES "User"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLaboratories" ADD CONSTRAINT "UserLaboratories_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLaboratories" ADD CONSTRAINT "UserLaboratories_LaboratoryID_fkey" FOREIGN KEY ("LaboratoryID") REFERENCES "Laboratory"("ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLaboratories" ADD CONSTRAINT "UserLaboratories_RoleID_fkey" FOREIGN KEY ("RoleID") REFERENCES "Role"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_RoleID_fkey" FOREIGN KEY ("RoleID") REFERENCES "Role"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_PermissionID_fkey" FOREIGN KEY ("PermissionID") REFERENCES "Permission"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentDescription" ADD CONSTRAINT "EquipmentDescription_EquipmentID_fkey" FOREIGN KEY ("EquipmentID") REFERENCES "Equipment"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentLaboratories" ADD CONSTRAINT "EquipmentLaboratories_LaboratoryID_fkey" FOREIGN KEY ("LaboratoryID") REFERENCES "Laboratory"("ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentLaboratories" ADD CONSTRAINT "EquipmentLaboratories_EquipmentID_fkey" FOREIGN KEY ("EquipmentID") REFERENCES "Equipment"("ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentLaboratories" ADD CONSTRAINT "EquipmentLaboratories_DescriptionID_fkey" FOREIGN KEY ("DescriptionID") REFERENCES "EquipmentDescription"("ID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaboratoryWorker" ADD CONSTRAINT "LaboratoryWorker_LaboratoryID_fkey" FOREIGN KEY ("LaboratoryID") REFERENCES "Laboratory"("ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_AuthorID_fkey" FOREIGN KEY ("AuthorID") REFERENCES "User"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_EditedByID_fkey" FOREIGN KEY ("EditedByID") REFERENCES "User"("ID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_DeletedByID_fkey" FOREIGN KEY ("DeletedByID") REFERENCES "User"("ID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_PostID_fkey" FOREIGN KEY ("PostID") REFERENCES "Posts"("ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_AnswerID_fkey" FOREIGN KEY ("AnswerID") REFERENCES "Comments"("ID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_AuthorID_fkey" FOREIGN KEY ("AuthorID") REFERENCES "User"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_EditedByID_fkey" FOREIGN KEY ("EditedByID") REFERENCES "User"("ID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_DeletedByID_fkey" FOREIGN KEY ("DeletedByID") REFERENCES "User"("ID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_LaboratoryID_fkey" FOREIGN KEY ("LaboratoryID") REFERENCES "Laboratory"("ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_UploadedByID_fkey" FOREIGN KEY ("UploadedByID") REFERENCES "User"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_PostID_fkey" FOREIGN KEY ("PostID") REFERENCES "Posts"("ID") ON DELETE CASCADE ON UPDATE CASCADE;
