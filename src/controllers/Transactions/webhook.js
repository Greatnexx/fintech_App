// webhook.controller.ts
import prisma from '../../prisma/client.js';
import crypto from 'crypto';

export const handlePaystackWebhook = async(req, res) => {
  try {
    // console.log(req.body)
    const secret = process.env.PAYSTACK_SECRET_KEY;

    // Convert raw body buffer to string for signature verification
    const rawBody = req.body.toString('utf8');

    // Verify Paystack signature
    const hash = crypto
      .createHmac('sha512', secret)
      .update(rawBody)
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    // Parse event body
    const { event, data } = JSON.parse(rawBody);
    const { reference, amount, metadata } = data;

    // eslint-disable-next-line
    console.log(`✅ Webhook received: ${event} - ${reference}`);

    switch (event) {
    case 'charge.success': {
      const existingTxn = await prisma.transaction.findUnique({
        where: { reference },
      });

      if (!existingTxn) {
        // eslint-disable-next-line
          console.log("⚠️ No pending transaction found:", reference);
        return res.sendStatus(200);
      }

      if (existingTxn.status === 'SUCCESS') {
        // eslint-disable-next-line
          console.log("ℹ️ Transaction already processed:", reference);
        return res.sendStatus(200);
      }

      // Update transaction to SUCCESS
      await prisma.transaction.update({
        where: { reference },
        data: { status: 'SUCCESS' },
      });

      // Credit wallet
      await prisma.wallet.update({
        where: { id: metadata.wallet_id },
        data: { balance: { increment: amount / 100 } },
      });

      break;
    }

    case 'charge.failed': {
      await prisma.transaction.update({
        where: { reference },
        data: { status: 'FAILED' },
      });

      break;
    }

    default:
      // eslint-disable-next-line
        console.log(" Unhandled event:", event);
    }

    res.sendStatus(200);
  } catch (err) {
    // eslint-disable-next-line
    console.error('Webhook error:', err);
    res.sendStatus(500);
  }
};

// paystack webhook look like this
// {
//   "event": "charge.success",
//   "data": {
//     "id": "txn_123",
//     "reference": "ref_123",
//     "amount": 10000,
//     "currency": "NGN",
//     "status": "SUCCESS",
//     "metadata": {
//       "wallet_id": "wallet_123"
//     }
//   }
// }
