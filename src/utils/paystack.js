import axios from "axios";

export const initializePaystackTransaction = async ({
  email,
  amount,
  reference,
  metadata,
}) => {
  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100, 
        reference,
        metadata,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Return success response
  } catch (error) {
    // Log the error
    const message = error.response?.data || error.message;
    console.error(`Paystack initialization failed: ${JSON.stringify(message)}`);

    // Return error response instead of undefined
    return {
      status: false,
      message: error.response?.data?.message || error.message,
      data: null,
    };
  }
};
