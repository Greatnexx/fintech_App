import prisma from '../../prisma/client.js';
import pkg from '@prisma/client';
const { MoneyFlow, TransactionType, TransactionStatus } = pkg;
import { sendResponse } from '../../utils/responseHelper.js';
import { v4 as uuidv4 } from 'uuid';
import {
  deleteOtp,
  getSavedOtp,
  sendOtpToEmail,
} from '../../utils/otpHelper.js';
import { withdrawalConfirmationMessage } from '../../utils/message.js';

export const initiateWithdrawal = async(req, res, next) => {
  try {
    const { amount, narration } = req.body;
    const user_id = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: user_id },
      include: { wallet: true },
    });

    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    if (!user.wallet) {
      return sendResponse(res, 404, false, 'Wallet not found');
    }

    if (user.wallet.balance < amount) {
      return sendResponse(res, 400, false, 'Insufficient balance');
    }
    if (!amount || amount <= 0) {
      return sendResponse(res, 400, false, 'Invalid Amount');
    }

    const reference = `WD-${uuidv4()}`;
    // Create withdrawal record
    await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        type: TransactionType.WITHDRAWAL,
        money_flow: MoneyFlow.DEBIT,
        status: TransactionStatus.PENDING,
        narration,
        reference,
        sender: {
          connect: { id: user_id },
        },
        wallet: {
          connect: { id: user.wallet.id },
        },
      },
    });
    const redis_key = `otp:${reference}`;

    await sendOtpToEmail(
      user,
      'Withdrawal Confirmation',
      withdrawalConfirmationMessage,
      redis_key,
    );

    return sendResponse(res, 200, true, 'Withdrawal initiated successfully', {
      reference,
      amount,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyWithdrawal = async(req, res, next) => {
  try {
    const user_id = req.user.id;
    const { reference, otp } = req.body;

    const transaction = await prisma.transaction.findUnique({
      where: { reference },
    });

    if (!transaction || transaction.sender_id !== user_id) {
      return sendResponse(
        res,
        404,
        false,
        'Transaction not found or unauthorized',
      );
    }

    if (transaction.status !== TransactionStatus.PENDING) {
      return sendResponse(res, 400, false, 'Transaction already processed');
    }

    const redis_key = `otp:${reference}`;
    const savedOtp = await getSavedOtp(redis_key);

    if (!savedOtp || savedOtp !== otp) {
      return sendResponse(res, 400, false, 'Invalid or expired OTP');
    }

    const wallet = await prisma.wallet.findUnique({
      where: { id: transaction.wallet_id },
    });

    if (!wallet || wallet.balance < transaction.amount) {
      return sendResponse(res, 400, false, 'Insufficient funds');
    }

    await prisma.$transaction(async(tx) => {
      // Deduct from wallet
      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { decrement: transaction.amount },
        },
      });

      // Update transaction status
      await tx.transaction.update({
        where: { reference },
        data: { status: TransactionStatus.SUCCESS },
      });
    });

    await deleteOtp(redis_key);

    return sendResponse(res, 200, true, 'Withdrawal successful');
  } catch (error) {
    next(error);
  }
};
