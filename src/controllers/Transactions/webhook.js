import crypto from "crypto";
import prisma from "../../prisma/client.js";
import { TransactionStatus } from "@prisma/client";
import { sendResponse } from "../../utils/responseHelper.js";

export const handlePaystackWebhook = async (req, res) => {
  try {
    // This will verify the webhook signature sent by Paystack 
    // It ensures that the request is genuinely from Paystack and not tampered with
    const paystackSignature = req.headers["x-paystack-signature"];
    const secret = process.env.PAYSTACK_SECRET_KEY;

    const hash = crypto
      .createHmac("sha512", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== paystackSignature) {
      console.warn("Invalid webhook signature");
      return sendResponse(res, 400, false, "Invalid signature");
    }

    
    // This is the event type that indicates a successful payment
    const event = req.body;
    if (event.event !== "charge.success") {
      return sendResponse(res, 200, true, "Event ignored");
    }
   console.log("Webhook received for:", event.data.reference); 

    // Extract the transaction reference from the event data
    // This reference is used to look up the transaction in our database
    const { reference } = event.data;

    // Find the transaction in our database using the reference
    // We assume that the reference is unique and corresponds to a pending deposit transaction
    const transaction = await prisma.transaction.findUnique({
      where: { reference },
    });

    if (!transaction || transaction.status !== TransactionStatus.PENDING) {
      return sendResponse(res, 404, false, "Transaction not found or already processed");
    }

    if (transaction.type !== "DEPOSIT") {
      return sendResponse(res, 400, false, "Not a deposit transaction");
    }

    //  Update balance + mark success — INSIDE Prisma transaction
    await prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { id: transaction.wallet_id },
        data: {
          balance: {
            increment: transaction.amount,
          },
        },
      });

        // Update the transaction status to SUCCESS
      await tx.transaction.update({
        where: { reference },
        data: {
          status: TransactionStatus.SUCCESS,
        },
      });
    }, {
    });

    return sendResponse(res, 200, true, "Deposit processed successfully");
  } catch (error) {
    console.error("Webhook error:", error);
    return sendResponse(res, 500, false, "Internal Server Error");
  }
};
