import prisma from '../../prisma/client';

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
