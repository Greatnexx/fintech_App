import axios from 'axios';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE = process.env.PAYSTACK_BASE_URL;

export const createRecipientInternal = async(
  account_number,
  bank_code,
  account_name,
) => {
  try {
    const response = await axios.post(
      `${PAYSTACK_BASE}/transferrecipient`,
      {
        type: 'nuban',
        name: account_name,
        account_number,
        bank_code,
        currency: 'NGN',
      },
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } },
    );

    return response.data.data.recipient_code;
  } catch (error) {
    // eslint-disable-next-line
    console.error(
      'Error creating recipient internally:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
