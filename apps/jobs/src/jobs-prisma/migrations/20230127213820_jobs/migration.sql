-- CreateEnum
CREATE TYPE "employment_type" AS ENUM ('FULL_TIME', 'PART_TIME');

-- CreateTable
CREATE TABLE "jobs" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "salary" INTEGER NOT NULL,
    "employment_type" "employment_type" NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);
