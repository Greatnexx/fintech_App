/*
  Warnings:

  - Added the required column `balance_after` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `balance_before` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Made the column `updated_at` on table `Transaction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "balance_after" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "balance_before" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "transaction_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET NOT NULL;
