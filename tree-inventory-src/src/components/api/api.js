import emailjs from "emailjs-com";

export const postFormData = async (formData) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/google-sheets/add-report`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("api.js: Error submitting report:", error);
  }
};

export const postPendingEtransfer = async (formData) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/google-sheets/add-pending-etransfer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("api.js: Error posting etransfer:", error);
  }
};

export const updateInventory = async (itemsPurchased, reduceInventory) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/google-sheets/update-inventory`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemsPurchased: itemsPurchased,
          reduceInventory: reduceInventory,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("api.js: Error updating inventory:", error);
  }
};

export const getOrderDetails = async (orderID) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/google-sheets/get-order-details`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderID: orderID,
        }),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("api.js: Error retrieving order details:", error);
  }
};

export const createPaymentIntent = async (totalInCents) => {
  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/stripe/create-payment-intent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: totalInCents }),
    }
  );
  if (!response.ok) {
    console.error("HTTP Error:", response.statusText);
    return null;
  }

  const paymentIntentData = await response.json();
  if (!paymentIntentData) {
    return null;
  }
  return paymentIntentData.clientSecret;
};
export const sendOrderConfirmationEmail = async (
  name,
  emailAddress,
  total,
  itemsPurchased,
  pickupLocation,
  orderID
) => {
  const emailParams = {
    to_name: name,
    to_email: emailAddress,
    order_total: total,
    items_purchased: itemsPurchased,
    pickup_location: pickupLocation,
    order_id: orderID,
  };
  try {
    const emailResponse = await emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
      emailParams,
      process.env.REACT_APP_EMAILJS_PUBLIC_KEY
    );
    return true;
  } catch (error) {
    console.error("api.js: Failed to send email:", error);
    return false;
  }
};
