-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "search_index" TEXT,
ADD COLUMN     "searchable_since" TIMESTAMPTZ(6);
