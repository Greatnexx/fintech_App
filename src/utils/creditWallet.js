import prisma from '../prisma/client.js';

export const creditWallet = async(walletId, amount, tx = prisma) => {
  return await tx.wallet.update({
    where: { id: walletId },
    data: {
      balance: {
        increment: amount,
      },
    },
  });
};
