import express from "express";
import { getPhonePeToken } from "../utils/phonepayToken.js";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto"
import axios from "axios";
import ordermodel from "../models/ordermodel.js";
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
    const merchantOrderId = orderId;
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

    const request =
  CreateSdkOrderRequest.StandardCheckoutBuilder()
    .merchantOrderId(merchantOrderId)
    .amount(amount * 100)
    .redirectUrl(
      `${redirectUrl}?orderId=${orderId}`
    )
    .metaInfo(metaInfo)
    .build();

     // 🔥 CREATE PAYMENT ORDER
    const response = await client.pay(request);

    // ✅ SAVE merchantOrderId IN DB
    await ordermodel.findByIdAndUpdate(orderId, {
      merchantOrderId: merchantOrderId
    });

    return res.json({
      success: true,
      checkoutPageUrl: response.redirectUrl
    });

  } catch (err) {
    console.error("❌ PhonePe initiate error:", err);
    return res.status(500).json({
      success: false,
      message: "Payment initiation failed"
    });
  }
});

router.get("/checkPaymentStatus", async (req, res) => {
  try {
    const { orderId } = req.query;

    const client = StandardCheckoutClient.getInstance(
      process.env.PHONEPE_CLIENT_ID,
      process.env.PHONEPE_CLIENT_SECRET,
      1,
      Env.PRODUCTION
    );

    const order = await ordermodel.findById(orderId);
    if (!order) {
      return res.redirect("https://www.trendoor.in/orderfailed");
    }

    const response = await client.getOrderStatus(order.merchantOrderId);

    // ✅ CORRECT SUCCESS CHECK
    if (response.state === "SUCCESS") {

      order.paymentStatus = "paid";
      order.status = "Order placed";

      // ✅ CORRECT transactionId extraction
      order.transactionId =
        response?.paymentDetails?.transactionId ||
        response?.data?.transactionId ||
        null;

      await order.save();

      // ✅ UPDATE STOCK
      for (const item of order.items) {
        const product = await productmodel.findById(item._id);
        if (!product) continue;

        product.sizes = product.sizes.filter(
          (s) => s !== item.size
        );
        product.outofstock = product.sizes.length === 0;
        await product.save();
      }

      // ✅ CLEAR CART
      await usermodel.findByIdAndUpdate(order.userid, {
        cartdata: {}
      });

      return res.redirect("https://www.trendoor.in/ordersuccess");
    }

    // ❌ Payment failed / pending
    order.paymentStatus = "failed";
    order.status = "Payment failed";
    await order.save();

    return res.redirect("https://www.trendoor.in/orderfailed");

  } catch (err) {
    console.error("Payment verification error:", err);
    return res.redirect("https://www.trendoor.in/orderfailed");
  }
});


export default router;
