import { TransactionStatus, TransactionType, MoneyFlow } from "@prisma/client";
import prisma from "../../prisma/client.js";
import { v4 as uuidv4 } from "uuid";
import { sendResponse } from "../../utils/responseHelper.js";

export const initiateTransfer = async (req, res, next) => {
  try {
    const { amount, accountNumber, narration } = req.body;
    const senderId = req.user.id;

    if (!senderId) return sendResponse(res, 401, false, "Unauthorized");
    if (!amount || !accountNumber) {
      return sendResponse(res, 400, false, "Missing required fields");
    }

    // fetch wallets
    const senderWallet = await prisma.wallet.findUnique({
      where: { user_id: senderId },
    });
    const receiverWallet = await prisma.wallet.findUnique({
      where: { account_number: accountNumber },
    });

    if (!senderWallet)
      return sendResponse(res, 404, false, "Sender wallet not found");
    if (!receiverWallet)
      return sendResponse(res, 404, false, "Receiver wallet not found");

    if (senderWallet.balance < amount) {
      return sendResponse(res, 400, false, "Insufficient balance");
    }

    if (senderWallet.account_number === accountNumber) {
      return sendResponse(
        res,
        400,
        false,
        "Cannot transfer to your own account"
      );
    }

    const senderReference = `TRF-${uuidv4()}`;
    const receiverReference = `TRF-${uuidv4()}`;

    const senderBalanceBefore = senderWallet.balance;
    const senderBalanceAfter = senderWallet.balance - amount;

    const receiverBalanceBefore = receiverWallet.balance;
    const receiverBalanceAfter = receiverWallet.balance + amount;

    // Run atomically
    await prisma.$transaction(async (tx) => {
      // update balances
      await tx.wallet.update({
        where: { id: senderWallet.id },
        data: { balance: { decrement: amount } },
      });

      await tx.wallet.update({
        where: { id: receiverWallet.id },
        data: { balance: { increment: amount } },
      });

      // sender transaction (DEBIT)
      await tx.transaction.create({
        data: {
          reference: senderReference,
          type: TransactionType.TRANSFER,
          status: TransactionStatus.SUCCESS,
          amount,
          narration: narration || `Transfer to ${accountNumber}`,
          sender_id: senderId,
          receiver_id: receiverWallet.user_id,
          wallet_id: senderWallet.id,
          money_flow: MoneyFlow.DEBIT,
          balance_before: senderBalanceBefore,
          balance_after: senderBalanceAfter,
        },
      });

      // receiver transaction (CREDIT)
      await tx.transaction.create({
        data: {
          reference: receiverReference,
          type: TransactionType.TRANSFER,
          status: TransactionStatus.SUCCESS,
          amount,
          narration:
          narration || `Transfer from ${senderWallet.account_number}`,
          sender_id: senderId,
          receiver_id: receiverWallet.user_id,
          wallet_id: receiverWallet.id,
          money_flow: MoneyFlow.CREDIT,
          balance_before: receiverBalanceBefore,
          balance_after: receiverBalanceAfter,
        },
      });
    });

    return sendResponse(res, 200, true, "Transfer successful", {
        amount,
        narration,
        transaction_date: new Date(),
        sender: {
          id: senderId,
          wallet_id: senderWallet.id,
          accountNumber: senderWallet.account_number,
          balance_before: senderBalanceBefore,
          balance_after: senderBalanceAfter,
          reference: senderReference,
        },
      
      receiver: {
        id: receiverWallet.user_id,
        wallet_id: receiverWallet.id,
        accountNumber: receiverWallet.account_number,
        balance_before: receiverBalanceBefore,
        balance_after: receiverBalanceAfter,
        reference: receiverReference, 
      },
    });
  } catch (error) {
    next(error);
  }
};
