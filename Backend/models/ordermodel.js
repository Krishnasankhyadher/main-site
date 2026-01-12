import mongoose from "mongoose";

const orderschema = new mongoose.Schema({
  userid: {
    type: String,
    required: true
  },

  items: [
    {
      _id: String,
      name: String,
      price: Number,
      image: [String],
      category: String,
      subcategory: String,
      size: String,
      quantity: Number,
    }
  ],

  amount: {
    type: Number,
    required: true
  },

  originalAmount: {
    type: Number,
    required: true
  },

  discountAmount: {
    type: Number,
    default: 0
  },

  promoCode: {
    type: String,
    default: null
  },

  address: {
    type: Object,
    required: true
  },

  /* 🔑 PAYMENT FIELDS */
  paymentMethod: {
    type: String,
    enum: ["cod", "phonepe"],
    required: true
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  },

  merchantOrderId: {
    type: String,
    default: null
  },

  transactionId: {
    type: String,
    default: null
  },

  /* 🧾 ORDER STATUS */
  status: {
    type: String,
    enum: [
      "Payment pending",
      "Order placed",
      "Packed",
      "Shipped",
      "Delivered",
      "Cancelled"
    ],
    default: "Payment pending"
  },

  date: {
    type: Date,
    default: Date.now
  }
});

const ordermodel =
  mongoose.models.order || mongoose.model("order", orderschema);

export default ordermodel;
