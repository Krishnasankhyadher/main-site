import ordermodel from "../models/ordermodel.js"
import usermodel from "../models/usermodel.js";
import productmodel from "../models/productmodel.js";
import promomodel from "../models/promomodel.js"

// Placing Order
// In placeorder controller - update the COD vs Online logic
const placeorder = async (req, res) => {
  try {
    const { userid, items, amount, address, promoCode, paymentmethod } = req.body;

    // Step 1: Validate stock (Check only, do not deduct yet)
    for (const item of items) {
      const product = await productmodel.findById(item._id);
      if (!product) return res.json({ success: false, message: "Product not found" });

      const sizeExists = product.sizes.includes(item.size);
      if (!sizeExists) return res.json({ success: false, message: `Size ${item.size} not available for product ${product.name}.` });

      if (item.quantity > 1) return res.json({ success: false, message: "Only 1 quantity allowed per product." });
    }

    // Step 2: Validate Promo Code
    let discountAmount = 0;
    let finalAmount = amount;

    if (promoCode) {
      const promo = await promomodel.findOne({ code: promoCode.toUpperCase().trim(), isActive: true });
      if (!promo) return res.json({ success: false, message: "Invalid promo code" });
      
      // ... (Include your existing promo validation checks here: dates, minOrder, etc.) ...
      
      discountAmount = promo.discountAmount;
      finalAmount = amount - discountAmount;
      if (finalAmount < 0) finalAmount = 0;
    }

    // For COD: Create order immediately
    if (paymentmethod === "cod") {
      // Step 3: Create Order for COD
      const orderdata = {
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
        status: "Order Placed",
      };

      const neworder = new ordermodel(orderdata);
      await neworder.save();

      // Step 4: Handle Stock & Cart for COD
      for (const item of items) {
        const product = await productmodel.findById(item._id);
        product.sizes = product.sizes.filter(s => s !== item.size);
        product.outofstock = product.sizes.length === 0;
        await product.save();
      }

      // Increment promo usage for COD
      if (promoCode) {
        const promo = await promomodel.findOne({ code: promoCode.toUpperCase().trim() });
        if (promo) {
          promo.currentUses += 1;
          await promo.save();
        }
      }

      await usermodel.findByIdAndUpdate(userid, { cartdata: {} });

      return res.json({ 
        success: true, 
        orderId: neworder._id,
        message: "Order placed successfully", 
        merchantOrderId: neworder._id.toString(),
        finalAmount
      });
    }

    // For Online Payment: Just validate and return amount, create order in verifyOrder
    // Don't create order in database yet
    return res.json({ 
      success: true, 
      message: "Proceed to payment", 
      merchantOrderId: `TEMP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      finalAmount,
      items, // Send items back for verification
      address // Send address back for order creation
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// NEW: Verify Payment Status with PhonePe
// In verifyOrder controller - modify to create order on success
const verifyOrder = async (req, res) => {
  const { merchantOrderId, items, address } = req.body; // Accept items and address from frontend

  try {
    if (!merchantOrderId) {
      return res.json({ success: false, message: "Order ID missing" });
    }

    // Check if this is a temporary ID (for new orders)
    const isNewOrder = merchantOrderId.startsWith('TEMP_');
    
    if (isNewOrder) {
      // For new orders, we need to check payment status first
      const token = await getPhonePeToken();

      const response = await fetch(
        `https://api.phonepe.com/apis/pg/checkout/v2/order/${merchantOrderId}/status`,
        {
          method: "GET",
          headers: {
            Authorization: `O-Bearer ${token}`,
            Accept: "application/json"
          }
        }
      );

      const data = await response.json();
      console.log("📦 PhonePe status:", data);

      // ❌ NOT COMPLETED → Return failure without creating order
      if (data.state !== "COMPLETED") {
        return res.json({
          success: false,
          message: `Payment ${data.state || "failed"}`,
          shouldDelete: false // No order to delete
        });
      }

      // ✅ COMPLETED → Create order in database
      // You'll need to receive order details from frontend or store them temporarily
      // For simplicity, let's assume frontend sends items and address
      
      if (!items || !address) {
        return res.json({ 
          success: false, 
          message: "Order details missing. Please try again." 
        });
      }

      // Calculate amount (you might need to receive this too)
      // For now, let's create a simplified order
      const orderdata = {
        userid: req.user.id, // Get from auth middleware
        items,
        address,
        amount: data.amount ? data.amount / 100 : 0, // Convert from paise
        paymentmethod: "online",
        payment: true,
        date: Date.now(),
        status: "Order Placed",
      };

      const neworder = new ordermodel(orderdata);
      await neworder.save();

      // Deduct stock
      for (const item of items) {
        const product = await productmodel.findById(item._id);
        if (!product) continue;

        product.sizes = product.sizes.filter(s => s !== item.size);
        product.outofstock = product.sizes.length === 0;
        await product.save();
      }

      // Promo usage (if any)
      if (req.body.promoCode) {
        const promo = await promomodel.findOne({ code: req.body.promoCode });
        if (promo) {
          promo.currentUses += 1;
          await promo.save();
        }
      }

      // Clear cart
      await usermodel.findByIdAndUpdate(req.user.id, { cartdata: {} });

      return res.json({
        success: true,
        message: "Payment verified and order placed",
        orderId: neworder._id
      });

    } else {
      // Existing order verification logic (for orders already in DB)
      const order = await ordermodel.findById(merchantOrderId);
      if (!order) {
        return res.json({ success: false, message: "Order not found" });
      }

      // Rest of your existing verifyOrder logic for existing orders...
      // [Keep your existing logic here for orders that are already in DB]
    }

  } catch (error) {
    console.error("❌ Verify error:", error);
    return res.json({
      success: false,
      message: "Payment verification failed"
    });
  }
};

// Keep existing exports and functions
const placeorderrazorpay = async (req, res) => {} // Unused
const allorders = async (req, res) => {
  try {
    const orders = await ordermodel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
const userorder = async (req, res) => {
    try {
        const userid = req.user.id
        const order = await ordermodel.find({userid})
        res.json({success:true, order})
    } catch (error) {
        console.log(error)
        res.json({success:false ,message:error.message})
    }
}
const updatestatus = async (req, res)=>{
    try {
      const {orderid, status}= req.body
      await ordermodel.findByIdAndUpdate(orderid,{status})
      res.json({success:true, message:'status updated'})
    } catch (error) {
      console.log(error)
        res.json({success:false ,message:error.message})
    }
}
// In ordercontroller.js - add this function
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    const order = await ordermodel.findById(orderId);
    
    if (!order) {
      return res.json({ success: true, message: "Order not found or already deleted" });
    }
    
    // Only cancel if payment is still pending
    if (order.status === "Payment Pending") {
      await ordermodel.findByIdAndDelete(orderId);
      return res.json({ success: true, message: "Order cancelled successfully" });
    }
    
    return res.json({ success: false, message: "Cannot cancel processed order" });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};

// Add to exports
export { placeorder, placeorderrazorpay, allorders, updatestatus, userorder, verifyOrder, cancelOrder };