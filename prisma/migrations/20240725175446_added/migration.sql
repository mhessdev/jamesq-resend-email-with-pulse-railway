/*
  Warnings:

  - Added the required column `token` to the `Subscriber` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscriber" ADD COLUMN     "erified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "token" VARCHAR(255) NOT NULL;
