/*
  Warnings:

  - You are about to drop the `LaboratoryWork` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_laboratoryWorkId_fkey";

-- DropTable
DROP TABLE "LaboratoryWork";

-- CreateTable
CREATE TABLE "laboratory_works" (
    "id" SERIAL NOT NULL,
    "course" INTEGER NOT NULL,
    "semester" "Semester" NOT NULL,

    CONSTRAINT "laboratory_works_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "laboratory_works_course_semester_key" ON "laboratory_works"("course", "semester");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_laboratoryWorkId_fkey" FOREIGN KEY ("laboratoryWorkId") REFERENCES "laboratory_works"("id") ON DELETE SET NULL ON UPDATE CASCADE;
