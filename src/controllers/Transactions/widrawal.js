// import pkg from "@prisma/client";
// const { MoneyFlow, TransactionStatus, TransactionType } = pkg;
// import prisma from "../../prisma/client.js";
// import { sendResponse } from "../../utils/responseHelper.js";
// import { v4 as uuidv4 } from 'uuid';
// import { debitWallet } from "../../utils/debitWallet.js";
// import axios from 'axios';

// export const initiateWithdrawal = async (req, res, next) => {
//   try {
//     const { amount, narration, recipient_code } = req.body;
//     const user_id = req.user.id;

//     // Validate required fields
//     if (!amount || !recipient_code) {
//       return sendResponse(
//         res,
//         400,
//         false,
//         "Amount and recipient code are required"
//       );
//     }

//     // Validate amount
//     if (amount <= 0) {
//       return sendResponse(
//         res,
//         400,
//         false,
//         "Amount must be greater than 0"
//       );
//     }

//     const user = await prisma.user.findUnique({
//       where: { id: user_id },
//       include: { wallet: true },
//     });

//     if (!user || !user.wallet) {
//       return sendResponse(
//         res,
//         400,
//         false,
//         "User not found or does not have a wallet"
//       );
//     }

//     // Check if user has sufficient balance
//     if (user.wallet.balance < amount) {
//       return sendResponse(
//         res,
//         400,
//         false,
//         "Insufficient wallet balance"
//       );
//     }

//     const reference = `WTH-${uuidv4()}`;

//     // Create a record of this transaction
//     await prisma.$transaction(async (tx) => {
//       // Debit wallet first
//       await debitWallet(user.wallet.id, amount, tx);

//       // Create pending transaction
//       await tx.transaction.create({
//         data: {
//           type: TransactionType.WITHDRAWAL,
//           status: TransactionStatus.PENDING,
//           amount,
//           reference,
//           narration,
//           sender: { connect: { id: user_id } },
//           money_flow: MoneyFlow.DEBIT,
//           wallet: { connect: { id: user.wallet.id } },
//         },
//       });
//     });

//     // Send request to Paystack Transfer API
//     const paystackResponse = await axios.post(
//       "https://api.paystack.co/transfer",
//       {
//         source: "balance",
//         amount: Math.round(amount * 100), // Paystack uses kobo
//         recipient: recipient_code,
//         reason: narration || "Wallet withdrawal",
//         reference,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return sendResponse(res, 200, true, "Withdrawal initiated successfully", {
//       reference,
//       paystack: paystackResponse.data,
//     });

//   } catch (error) {
//     console.error("Withdrawal error:", error?.response?.data || error.message);

//     next(error);

//   }
// };
