import ordermodel from "../models/ordermodel.js";
import usermodel from "../models/usermodel.js";
import productmodel from "../models/productmodel.js";
import promomodel from "../models/promomodel.js";

/* ================= PLACE ORDER ================= */
const placeorder = async (req, res) => {
  try {
    const { items, amount, address, promoCode } = req.body;
    const userid = req.userId;

    // 1️⃣ Validate stock
    for (const item of items) {
      const product = await productmodel.findById(item._id);
      if (!product) {
        return res.json({ success: false, message: "Product not found" });
      }

      if (!product.sizes.includes(item.size)) {
        return res.json({
          success: false,
          message: `Size ${item.size} not available`,
        });
      }

      if (item.quantity > 1) {
        return res.json({
          success: false,
          message: "Only 1 quantity allowed per product",
        });
      }
    }

    // 2️⃣ Promo validation
    let discountAmount = 0;
    let finalAmount = amount;

    if (promoCode) {
      const promo = await promomodel.findOne({
        code: promoCode.toUpperCase().trim(),
        isActive: true,
      });

      if (!promo)
        return res.json({ success: false, message: "Invalid promo code" });

      const now = new Date();
      if (promo.validFrom && promo.validFrom > now)
        return res.json({ success: false, message: "Promo not yet valid" });

      if (promo.validUntil && promo.validUntil < now)
        return res.json({ success: false, message: "Promo expired" });

      if (amount < promo.minOrderAmount)
        return res.json({
          success: false,
          message: `Minimum order ${promo.minOrderAmount}`,
        });

      const used = await ordermodel.findOne({
        userid,
        promoCode: promo.code,
      });
      if (used)
        return res.json({
          success: false,
          message: "Promo already used",
        });

      discountAmount = promo.discountAmount;
      finalAmount = Math.max(0, amount - discountAmount);

      promo.currentUses += 1;
      await promo.save();
    }

    // 3️⃣ Update product stock
    for (const item of items) {
      const product = await productmodel.findById(item._id);
      product.sizes = product.sizes.filter((s) => s !== item.size);
      product.outofstock = product.sizes.length === 0;
      await product.save();
    }

    // 4️⃣ Save order
    const neworder = await ordermodel.create({
      userid,
      items,
      address,
      amount: finalAmount,
      originalAmount: amount,
      discountAmount,
      promoCode: promoCode || null,
      paymentmethod: "cod",
      payment: false,
      date: Date.now(),
      status: "Order placed",
    });

    // 5️⃣ Clear cart
    await usermodel.findByIdAndUpdate(userid, { cartdata: {} });

    res.json({
      success: true,
      message: "Order placed successfully",
      orderId: neworder._id,
      finalAmount: neworder.amount
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* ================= RAZORPAY (EMPTY) ================= */
const placeorderrazorpay = async (req, res) => {};

/* ================= ADMIN: ALL ORDERS ================= */
const allorders = async (req, res) => {
  try {
    const orders = await ordermodel.find({}).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ================= USER ORDERS ================= */
const userorder = async (req, res) => {
  try {
    const userid = req.userId;
    const order = await ordermodel.find({ userid }).sort({ date: -1 });
    res.json({ success: true, order });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ================= UPDATE STATUS ================= */
const updatestatus = async (req, res) => {
  try {
    const { orderid, status } = req.body;
    await ordermodel.findByIdAndUpdate(orderid, { status });
    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ================= DELETE ORDER (NEW) ================= */
const deleteorder = async (req, res) => {
  try {
    const { orderid } = req.body;

    const order = await ordermodel.findById(orderid);
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    await ordermodel.findByIdAndDelete(orderid);

    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeorder,
  placeorderrazorpay,
  allorders,
  userorder,
  updatestatus,
  deleteorder,
};
