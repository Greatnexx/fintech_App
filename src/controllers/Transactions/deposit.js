import { v4 as uuidv4 } from "uuid";
import pkg from '@prisma/client';
import prisma from "../../prisma/client.js";
const {  TransactionStatus, TransactionType, MoneyFlow } = pkg;
import { sendResponse } from "../../utils/responseHelper.js";
import axios from "axios";

export const initiateDeposit = async (req, res,next) => {
  try {
    const { amount, narration } = req.body;
    const user_id = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: user_id },
    });

    if (!user) {
      return sendResponse(res, 400, false, "User not found");
    }

    if (!amount || amount <= 0) {
      return sendResponse(res, 400, false, "Invalid Amount");
    }

    // We create a unique reference number so we can later say: “Hey Paystack, what happened to this exact transaction”
    const reference = `DEP-${uuidv4()}`;

// Wallet check ensures that only users with wallets can initiate deposits. 

    const wallet = await prisma.wallet.findUnique({
      where: { user_id },
    });

    if (!wallet) {
      return sendResponse(res, 404, false, "Wallet not found");
    }

    // Create pending transaction in the database
    await prisma.transaction.create({
      data: {
        type: TransactionType.DEPOSIT,
        status: TransactionStatus.PENDING,
        amount: parseFloat(amount),
        narration,
        reference,
        wallet_id: wallet.id,
        sender_id: user_id,
      },
    });

    // Now we call Paystack to initiate the transaction
    // We send the user’s email, amount, and reference to Paystack
    // Paystack will then return an authorization URL that we can redirect the user to
    // so they can complete the payment process
    // We also include metadata so we can later link the transaction back to the user and wallet
    // Note: Paystack expects amounts in kobo, so we multiply by 100
    

    const paystackRes = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: user.email,
        amount: amount * 100,
        reference,
        metadata: {
          user_id,
          wallet_id: wallet.id,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // If Paystack returns a successful response, we extract the authorization URL which the user will use to complete the payment

    const authUrl = paystackRes.data.data.authorization_url;

    // We redirect the user to the authorization URL
    return sendResponse(res, 200, true, "Deposit initiated", {
      reference,
      authorization_url: authUrl,
    });
  } catch (error) {
    console.error("Deposit initiation failed:", error.response?.data || error.message)
    next(error);
  }
};
