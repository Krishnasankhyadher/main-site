import express from "express";
import { getPhonePeToken } from "../utils/phonepayToken.js";

const router = express.Router();

// In paymentrouter.js - update the initiate endpoint
router.post("/initiate", async (req, res) => {
  try {
    const { amount, merchantOrderId } = req.body;
    const token = await getPhonePeToken();

    const payload = {
      merchantOrderId: merchantOrderId,
      amount: amount * 100,
      paymentFlow: {
        type: "PG_CHECKOUT",
        merchantUrls: {
          // Update: Use success and failure URLs
          redirectUrl: `${process.env.FRONTEND_URL}/payment-callback`,
          cancelUrl: `${process.env.FRONTEND_URL}/orderfailed`,
          webhookUrl: `${process.env.BACKEND_URL}/api/payment/webhook`
        }
      }
    };

    const response = await fetch(
      "https://api.phonepe.com/apis/pg/checkout/v2/pay",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `O-Bearer ${token}`
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ success: false, message: "PhonePe checkout failed", error: data });
    }

    return res.json({ success: true, url: data.redirectUrl });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;