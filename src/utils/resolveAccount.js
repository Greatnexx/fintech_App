import axios from 'axios';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE = process.env.PAYSTACK_BASE_URL;

export const resolveAccountInternal = async(account_number, bank_code) => {
  try {
    const response = await axios.get(`${PAYSTACK_BASE}/bank/resolve`, {
      params: { account_number, bank_code },
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
    });

    return response.data.data;
  } catch (error) {
    // eslint-disable-next-line
    console.error(
      'Error resolving account internally:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
