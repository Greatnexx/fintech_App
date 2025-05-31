/*
  Warnings:

  - You are about to drop the `UserProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserProfile" DROP CONSTRAINT "UserProfile_user_id_fkey";

-- DropIndex
DROP INDEX "User_id_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "date_of_birth" TIMESTAMP(3),
ADD COLUMN     "lga" TEXT,
ADD COLUMN     "marital_status" TEXT,
ADD COLUMN     "profile_image" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "zip_code" TEXT;

-- DropTable
DROP TABLE "UserProfile";
