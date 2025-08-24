import { MoneyFlow, TransactionStatus, TransactionType } from "@prisma/client";

export const debitWallet = async (
  tx,
  {
    walletId,
    userId,
    amount,
    narration,
    reference,
    transactionType = TransactionType.TRANSFER,
    receiverId = null,
    balanceBefore,
  }
) => {
  // Update wallet balance
  await tx.wallet.update({
    where: { id: walletId },
    data: { balance: { decrement: amount } },
  });

  const balanceAfter = balanceBefore - amount;

  // Create debit transaction record
  const transaction = await tx.transaction.create({
    data: {
      reference,
      type: transactionType,
      status: TransactionStatus.SUCCESS,
      amount,
      narration,
      sender_id: userId,
      receiver_id: receiverId,
      wallet_id: walletId,
      money_flow: MoneyFlow.DEBIT,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
    },
  });

  return {
    transaction,
    balanceAfter,
  };
};
