import { v4 as uuidv4 } from 'uuid';
import pkg from '@prisma/client';
import prisma from '../../prisma/client.js';
const {  TransactionStatus, TransactionType } = pkg;
import { sendResponse } from '../../utils/responseHelper.js';
import { initializePaystackTransaction } from '../../utils/paystack.js';

export const initiateDeposit = async(req, res,next) => {
  try {
    const { amount, narration } = req.body;
    const user_id = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: user_id },
    });

    if (!user) {
      return sendResponse(res, 400, false, 'User not found');
    }
    // Validate amount

    if (!amount || amount <= 0) {
      return sendResponse(res, 400, false, 'Invalid Amount');
    }

    // Wallet check ensures that only users with wallets can initiate deposits.
    const wallet = await prisma.wallet.findUnique({
      where: { user_id },
    });

    // We create a unique reference number so we can later say: “Hey Paystack, what happened to this exact transaction”
    const reference = `DEP-${uuidv4()}`;

    if (!wallet) {
      return sendResponse(res, 400, false, 'Wallet not found');
    }

    // Create pending transaction in the database
    // wallet_id – where you’ll credit when verification succeeds.
    // sender_id – who initiated it (owner of the wallet).
    await prisma.transaction.create({
      data: {
        type: TransactionType.DEPOSIT,
        status: TransactionStatus.PENDING,
        amount: parseFloat(amount),
        narration,
        reference,
        balance_before: wallet.balance,
        balance_after: wallet.balance + parseFloat(amount),
        wallet_id: wallet.id,
        sender_id: user_id,
      },
    });

    // Now we call Paystack to initiate the transaction
    const paystackRes = await initializePaystackTransaction({
      email: user.email,
      amount,
      reference,
      metadata: {
        user_id,
        wallet_id: wallet.id,
      },
    });

    // If Paystack returns a successful response, we extract the authorization URL which the user will use to complete the payment

    const authUrl = paystackRes.data?.authorization_url;

    // We redirect the user to the authorization URL
    return sendResponse(res, 200, true, 'Deposit initiated', {
      reference,
      authorization_url: authUrl,
    });
  } catch (error) {

    next(error);
  }
};
