import express from "express";
import { getPhonePeToken } from "../utils/phonepayToken.js";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto"
import axios from "axios";
import {
  StandardCheckoutClient,
  Env,
  CreateSdkOrderRequest,
  MetaInfo
} from "pg-sdk-node";

const router = express.Router();

router.post("/initiate", async (req, res) => {
  try {
    const { amount, orderId, mobileNumber } = req.body;
    const merchantOrderId = uuidv4();
    const redirectUrl = "https://trendoor-backend.onrender.com/api/payment/checkPaymentStatus"
    const clientId = process.env.PHONEPE_CLIENT_ID
    const clientSecret = process.env.PHONEPE_CLIENT_SECRET
    const clientVersion = 1
    const env = Env.PRODUCTION

    const client = StandardCheckoutClient.getInstance(
      clientId,
      clientSecret,
      clientVersion,
      env
    )

    const metaInfo = MetaInfo.builder().udf1("udf1").udf2("udf2").build()

    const request = CreateSdkOrderRequest.StandardCheckoutBuilder().merchantOrderId(merchantOrderId).amount(amount*100).redirectUrl(`${redirectUrl}/?id=${merchantOrderId}/orderId${orderId}`).metaInfo(metaInfo).build()

    client.pay(request).then((response) => {
      const checkoutPageUrl = response.redirectUrl
      return res.json({
        success: true,
        message: "Payment order created successfully.",
        checkoutPageUrl,
        merchantOrderId
      })
    })

    return

  } catch (err) {
    console.error("❌ PhonePe Checkout Fatal Error:", err || err);
    return res.status(500).json({ success: false, error: err.response?.data || err.message });
  }
});

router.get("/checkPaymentStatus", async (req, res) => {
  try {
    const clientId = process.env.PHONEPE_CLIENT_ID
    const clientSecret = process.env.PHONEPE_CLIENT_SECRET
    const clientVersion = 1
    const env = Env.PRODUCTION
  
    const client = StandardCheckoutClient.getInstance(
      clientId,
      clientSecret,
      clientVersion,
      env
    )
  
    const info = req.query.id.split("/orderId")
  
    const response = await client.getOrderStatus(info[0])
  
    if (response.state == "COMPLETED") {
      return res.json({
        success: true,
        message: "Payment verified successfully."
      })
    } else {
      return res.json({
        success: false,
        message: "Payment failed."
      })
    }
  } catch (error) {
    return res.json({
      success: false,
      message: "Payment not verified yet."
    })
  }
})


export default router;
