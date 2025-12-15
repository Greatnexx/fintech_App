/*
  Warnings:

  - A unique constraint covering the columns `[recipient_code]` on the table `Beneficiary` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Beneficiary" ADD COLUMN     "recipient_code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Beneficiary_recipient_code_key" ON "Beneficiary"("recipient_code");
