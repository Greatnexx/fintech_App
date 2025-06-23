import prisma from "../prisma/client.js";

export const generateAccountNumber = async () => {
  const prefix = "04";
  let account_number;
  let exists = true;

  while (exists) {
    const random_part = Math.floor(
      10000000 + Math.random() * 90000000
    ).toString();
    account_number = prefix + random_part;
    const wallet = await prisma.wallet.findUnique({
      where: { account_number },
    });
    if (!wallet) {
      exists = false;
    }
  }

  return account_number;
};
