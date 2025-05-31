/*
  Warnings:

  - You are about to drop the column `date_of_birth` on the `User` table. All the data in the column will be lost.
  - Added the required column `lga` to the `UserProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `marital_status` to the `UserProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "date_of_birth";

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "lga" TEXT NOT NULL,
ADD COLUMN     "marital_status" TEXT NOT NULL;
