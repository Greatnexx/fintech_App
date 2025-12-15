import prisma from '../../prisma/client.js';
import { sendResponse } from '../../utils/responseHelper.js';

export const getAllTransactions = async(req, res, next) => {
  try {
    const user_id = req.user.id;

    // Fetch all transactions for the user
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [{ sender_id: user_id }, { receiver_id: user_id }],
      },
    });

    // Check if transactions exist
    if (!transactions || transactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No transactions found',
      });
    }

    // Return the transactions
    return res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

export const getAccountDetailsByAccountNumber = async(req, res, next) => {
  try {

    const user_id = req.user.id;

    if (!user_id) {
      return sendResponse(res, 401, false, 'Unauthorized');
    }

    const { account_number } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: user_id },
      include: { wallet: true },
    });

    const account = await prisma.wallet.findUnique({
      where: { account_number },
    });

    if (!account) {
      return sendResponse(res, 404, false, null, 'Account not found');
    }

    return sendResponse(res, 200, true, 'Account details retrieved successfully', {
      account_name: user.first_name + ' ' + user.last_name,
      account_number: account.account_number,
      bank_name: 'Swift Pay Bank',
    });
  } catch (error) {
    next(error);

  }
};
