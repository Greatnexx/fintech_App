import { MoneyFlow, TransactionStatus, TransactionType } from '@prisma/client';

export const creditWallet = async(
  tx,
  {
    walletId,
    userId,
    amount,
    narration,
    reference,
    transactionType = TransactionType.TRANSFER,
    senderId = null,
    balanceBefore,
  },
) => {
  // Update wallet balance
  await tx.wallet.update({
    where: { id: walletId },
    data: { balance: { increment: amount } },
  });

  const balanceAfter = balanceBefore + amount;

  // Create credit transaction record
  const transaction = await tx.transaction.create({
    data: {
      reference,
      type: transactionType,
      status: TransactionStatus.SUCCESS,
      amount,
      narration,
      sender_id: senderId,
      receiver_id: userId,
      wallet_id: walletId,
      money_flow: MoneyFlow.CREDIT,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
    },
  });

  return {
    transaction,
    balanceAfter,
  };
};
