import prisma from '../../prisma/client.js';
import { sendResponse } from '../../utils/responseHelper.js';
import { v4 as uuidv4 } from 'uuid';
import pkg from '@prisma/client';
const { TransactionStatus, TransactionType, MoneyFlow } = pkg;
import { deleteOtp, getSavedOtp, sendOtpToEmail } from '../../utils/otpHelper.js';
import { confirmTransferMessage } from '../../utils/message.js';

export const initiateTransfer = async(req, res, next) => {
  try {
    const user_id = req.user.id;

    const { recipient_email, amount, narration } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: user_id },
      include: { wallet: true },
    });

    if (!user) {
      return sendResponse(res, 401, false, 'User or wallet not found');
    }

    if (!amount || amount <= 0 || !recipient_email) {
      return sendResponse(res, 400, false, 'Invalid amount or recipient email');
    }

    if (user.wallet.balance < parseFloat(amount)) {
      return sendResponse(res, 400, false, 'Insufficient balance');
    }

    const recipient = await prisma.user.findUnique({
      where: { email: recipient_email },
      include: { wallet: true },
    });

    if (!recipient) {
      return sendResponse(res, 400, false, 'No wallet or recipient found');
    }

    const reference = `DEP-${uuidv4()}`;
    ;

    await prisma.transaction.create({
      data: {
        type: TransactionType.TRANSFER,
        status: TransactionStatus.PENDING,
        amount: parseFloat(amount),
        narration,
        reference,
        // Use the relation fields 'sender' and 'receiver' with 'connect'
        receiver: {
          connect: { id: recipient.id }, // Connect to the recipient User record
        },
        sender: {
          connect: { id: user_id }, // Connect to the sender User record
        },
        money_flow: MoneyFlow.DEBIT,
        wallet:{
          connect: { id: user.wallet.id },
        },
      },
    });

    // the redis key name is dynamic and can be based on the reference or email
    // transfers needs to be tracked by reference so that we can verify the otp
    const redis_key = `otp:${reference}`;

    await sendOtpToEmail(
      user,
      'confirm your transfer',
      confirmTransferMessage,
      redis_key,
    );

    return sendResponse(
      res,
      200,
      true,
      'Transfer initiated successfully. Please verify your OTP.',
      {
        reference,
        amount,
        narration,
      },
    );
  } catch (error) {
    next(error);

  }
};

export const verifyTransfer = async(req, res, next) => {
  try {

    const user_id = req.user.id;
    const { reference, otp } = req.body;

    //  Get transaction
    const transaction = await prisma.transaction.findUnique({
      where: { reference },
    });

    // Check if transaction exists and belongs to the user
    if (!transaction) {
      return sendResponse(res, 404, false, 'Transaction not found');
    }
    // Ensure the transaction belongs to the user and is pending
    if (transaction.sender_id !== user_id) {
      return sendResponse(res, 403, false, 'You are not authorized to verify this transfer');
    }
    // Check if transaction is pending
    if (transaction.status !== TransactionStatus.PENDING) {
      return sendResponse(res, 400, false, `Transaction is already ${transaction.status}`);
    }

    // Validate OTP
    const redis_key = `otp:${reference}`;

    const storedOtp = await getSavedOtp(redis_key);

    if (storedOtp !== otp) {
      return sendResponse(res, 400, false, 'Invalid OTP');
    }

    //  Get sender and recipient wallets
    const senderWallet = await prisma.wallet.findUnique({
      where: { user_id: transaction.sender_id },
    });

    // Check if recipient wallet exists
    const recipientWallet = await prisma.wallet.findUnique({
      where: { user_id: transaction.receiver_id },
    });

    if (!senderWallet || !recipientWallet) {
      return sendResponse(res, 404, false, 'Wallet(s) not found');
    }

    // Check if sender has sufficient balance
    if (senderWallet.balance < transaction.amount) {
      return sendResponse(res, 400, false, 'Insufficient balance to complete transfer');
    }

    // this is how to initiate a database transaction using Prisma
    // this is to ensure that the transfer is atomic and consistent
    await prisma.$transaction(async(tx) => {
      // Debit sender
      await tx.wallet.update({
        where: { id: senderWallet.id },
        data: {
          balance: {
            decrement: transaction.amount,
          },
        },
      });

      // Credit recipient
      await tx.wallet.update({
        where: { id: recipientWallet.id },
        data: {
          balance: {
            increment: transaction.amount,
          },
        },
      });

      // Update transaction status
      await tx.transaction.update({
        where: { reference },
        data: {
          status: TransactionStatus.SUCCESS,
        },
      });
    });

    //  Remove OTP from Redis
    await deleteOtp(redis_key);

    return sendResponse(res, 200, true, 'Transfer successful');
  } catch (error) {
    next(error);
    return sendResponse(res, 500, false, 'Failed to verify transfer');
  }
};
