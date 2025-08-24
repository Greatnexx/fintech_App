import axios from 'axios';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export const initializePaystackTransaction = async({
  email,
  amount,
  reference,
  metadata,
}) => {
  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: amount * 100, // Paystack expects kobo
        reference,
        metadata,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  } catch (error) {
    // eslint-disable-next-line
    console.error(
      'Paystack init error:',
      error.response?.data || error.message,
    );
    throw new Error('Failed to initialize Paystack transaction');
  }
};
