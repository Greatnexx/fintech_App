import {  TransactionType } from '@prisma/client';
import prisma from '../../prisma/client.js';
import { v4 as uuidv4 } from 'uuid';
import { sendResponse } from '../../utils/responseHelper.js';
import { creditWallet } from '../../utils/creditWallet.js';
import { debitWallet } from '../../utils/debitWallet.js';

export const initiateTransfer = async(req, res, next) => {
  try {
    const { amount, accountNumber, narration } = req.body;
    const senderId = req.user.id;

    if (!senderId) {return sendResponse(res, 401, false, 'Unauthorized');}
    if (!amount || !accountNumber) {
      return sendResponse(res, 400, false, 'Missing required fields');
    }

    // fetch wallets
    const senderWallet = await prisma.wallet.findUnique({
      where: { user_id: senderId },
    });
    const receiverWallet = await prisma.wallet.findUnique({
      where: { account_number: accountNumber },
    });

    if (!senderWallet)
    {return sendResponse(res, 404, false, 'Sender wallet not found');}
    if (!receiverWallet)
    {return sendResponse(res, 404, false, 'Receiver wallet not found');}

    if (senderWallet.balance < amount) {
      return sendResponse(res, 400, false, 'Insufficient balance');
    }

    if (senderWallet.account_number === accountNumber) {
      return sendResponse(
        res,
        400,
        false,
        'Cannot transfer to your own account',
      );
    }

    const senderReference = `TRF-${uuidv4()}`;
    const receiverReference = `TRF-${uuidv4()}`;

    const senderBalanceBefore = senderWallet.balance;

    const receiverBalanceBefore = receiverWallet.balance;

    // Run atomically
    const result = await prisma.$transaction(async (tx) => {
      // Debit sender wallet
      const debitResult = await debitWallet(tx, {
        walletId: senderWallet.id,
        userId: senderId,
        amount,
        narration: narration || `Transfer to ${accountNumber}`,
        reference: senderReference,
        transactionType: TransactionType.TRANSFER,
        receiverId: receiverWallet.user_id,
        balanceBefore: senderBalanceBefore,
      });

      // Credit receiver wallet
      const creditResult = await creditWallet(tx, {
        walletId: receiverWallet.id,
        userId: receiverWallet.user_id,
        amount,
        narration: narration || `Transfer from ${senderWallet.account_number}`,
        reference: receiverReference,
        transactionType: TransactionType.TRANSFER,
        senderId: senderId,
        balanceBefore: receiverBalanceBefore,
      });

      return {
        debitResult,
        creditResult,
      };
    });

    return sendResponse(res, 200, true, 'Transfer successful', {
      amount,
      narration,
      transaction_date: new Date(),
      sender: {
        id: senderId,
        wallet_id: senderWallet.id,
        accountNumber: senderWallet.account_number,
        balance_before: senderBalanceBefore,
        balance_after: result.debitResult.balanceAfter,
        reference: senderReference,
      },
      receiver: {
        id: receiverWallet.user_id,
        wallet_id: receiverWallet.id,
        accountNumber: receiverWallet.account_number,
        balance_before: receiverBalanceBefore,
        balance_after: result.creditResult.balanceAfter,
        reference: receiverReference,
      },
    });
  } catch (error) {
    next(error);
  }
};
