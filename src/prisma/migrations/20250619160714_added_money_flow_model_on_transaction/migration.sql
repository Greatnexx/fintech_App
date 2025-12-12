-- CreateEnum
CREATE TYPE "MoneyFlow" AS ENUM ('CREDIT', 'DEBIT');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "money_flow" "MoneyFlow" NOT NULL DEFAULT 'CREDIT';
