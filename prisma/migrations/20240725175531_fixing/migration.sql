/*
  Warnings:

  - You are about to drop the column `erified` on the `Subscriber` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Subscriber" DROP COLUMN "erified",
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
