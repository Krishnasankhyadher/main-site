import express from "express";
import { getPhonePeToken } from "../utils/phonepayToken.js";

const router = express.Router();

router.post("/initiate", async (req, res) => {
  try {
    console.log("🔥 PhonePe Checkout V2 initiate");

    const { amount, orderId } = req.body;

    const token = await getPhonePeToken();

    const payload = {
      merchantOrderId: orderId,
      amount: amount * 100, // paisa
      paymentFlow: {
        type: "PG_CHECKOUT",
        merchantUrls: {
          redirectUrl: `${process.env.FRONTEND_URL}/ordersuccess`
        }
      }
    };

    console.log("👉 Payload:", payload);

    // 🔥 USE FETCH INSTEAD OF AXIOS
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
      console.error("❌ PhonePe Error:", data);
      return res.status(500).json({
        success: false,
        message: "PhonePe checkout failed",
        error: data
      });
    }

    console.log("✅ PhonePe response:", data);

    return res.json({
      success: true,
      url: data.redirectUrl
    });

  } catch (err) {
    console.error("❌ PhonePe Checkout Fatal Error:", err);
    return res.status(500).json({ success: false });
  }
});

export default router;
