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

/* ---------- DB & Cloudinary (serverless-safe) ---------- */
let isConnected = false;

async function initServices() {
  if (isConnected) return;

  try {
    await connectdb();
    connectcloudinary();
    isConnected = true;
    console.log("Services initialized");
  } catch (err) {
    console.error("Init failed:", err);
    throw err;
  }
}

/* ---------- CORS (FIXED) ---------- */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://trendoor.in",
  "https://www.trendoor.in"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "token"]
  })
);

/* ---------- Middleware ---------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------- Init services per request ---------- */
app.use(async (req, res, next) => {
  try {
    await initServices();
    next();
  } catch {
    res.status(500).json({ error: "Service initialization failed" });
  }
});

/* ---------- Routes ---------- */
app.use("/api/payment", paymentrouter);
app.use("/api/user", userouter);
app.use("/api/product", productroutes);
app.use("/api/cart", cartrouter);
app.use("/api/order", orderrouter);
app.use("/api/mail", mailrouter);
app.use("/api/promo", promorouter);

/* ---------- Health ---------- */
app.get("/", (req, res) => {
  res.json({ success: true, message: "Trendoor backend running on Vercel" });
});

export default app;
