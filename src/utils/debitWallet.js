import prisma from '../prisma/client.js';

export const debitWallet = async(walletID,amount,tx=prisma)=>{
  return await tx.wallet.update({
    where :{ id:walletID },
    data:{
      balance :{
        decrement:amount,
      },
    },
  });
};

