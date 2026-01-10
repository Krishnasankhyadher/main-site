import express, { response } from "express";
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

    const request = CreateSdkOrderRequest.StandardCheckoutBuilder().merchantOrderId(merchantOrderId).amount(amount * 100).redirectUrl(`${redirectUrl}/?orderId=${merchantOrderId}&dbId=${orderId}`).metaInfo(metaInfo).build()

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
    const { orderId, dbId } = req.query;

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

    const response = await client.getOrderStatus(orderId);
    const state = response?.response?.data?.state;

    if (state === "COMPLETED") {
      const updated = await ordermodel.findById(dbId)
      return res.json({
        success: "true 1",
        updatedOrder: updated,
        response
      })
      // return res.redirect("https://www.trendoor.in/ordersuccess");
    }

    // return res.redirect("https://www.trendoor.in/orderfailed");
    return res.json({
      success: "true 2",
      response,
    })

  } catch (err) {
    // return res.redirect("https://www.trendoor.in/orderfailed");
    return res.json({
      success: "false 1",
      message: err
    })
  }
})


export default router;
