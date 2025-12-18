import express from "express";
import cors from "cors";
import "dotenv/config";

import connectdb from "../config/mongodb.js";
import connectcloudinary from "../config/cloudinary.js";

import userouter from "../routes/userroutes.js";
import productroutes from "../routes/productroutes.js";
import cartrouter from "../routes/cartroutes.js";
import orderrouter from "../routes/orderroutes.js";
import mailrouter from "../routes/mailrouter.js";
import promorouter from "../routes/promoroutes.js";
import paymentrouter from "../routes/payment.js";

const app = express();

/* ---------- DB & Cloudinary (safe for serverless) ---------- */
let isConnected = false;

async function initServices() {
  if (!isConnected) {
    await connectdb();
    connectcloudinary();
    isConnected = true;
  }
}

initServices();

/* ---------- Middleware ---------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------- Routes ---------- */
app.use("/api/payment", paymentrouter);
app.use("/api/user", userouter);
app.use("/api/product", productroutes);
app.use("/api/cart", cartrouter);
app.use("/api/order", orderrouter);
app.use("/api/mail", mailrouter);
app.use("/api/promo", promorouter);

/* ---------- Health Check ---------- */
app.get("/", (req, res) => {
  res.json({ success: true, message: "Trendoor backend running on Vercel" });
});

/* ---------- IMPORTANT ---------- */
export default app; // 🚫 NO app.listen()
