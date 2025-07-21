
import ordermodel from "../models/ordermodel.js"
import usermodel from "../models/usermodel.js";
import productmodel from "../models/productmodel.js";
import promomodel from "../models/promomodel.js"
const placeorder = async (req, res) => {
  try {
    const { userid, items, amount, address, promoCode } = req.body;

    // Step 1: Validate stock for all items
    for (const item of items) {
      const product = await productmodel.findById(item._id);
      if (!product) {
        return res.json({ success: false, message: "Product not found" });
      }

      const size = item.size;
      const quantity = item.quantity;

      // Check if size exists in the array
      const sizeExists = product.sizes.includes(size);
      
      if (!sizeExists) {
        return res.json({
          success: false,
          message: `Size ${size} not available for product ${product.name}.`,
        });
      }

      // Enforce 1 quantity limit per product
      if (quantity > 1) {
        return res.json({
          success: false,
          message: "Only 1 quantity allowed per product.",
        });
      }
    }

    // Step 2: Validate promo code if provided
    let discountAmount = 0;
    let finalAmount = amount;
    
    if (promoCode) {
      const promo = await promomodel.findOne({ 
        code: promoCode.toUpperCase().trim(),
        isActive: true 
      });

      if (!promo) {
        return res.json({ success: false, message: "Invalid promo code" });
      }

      // Check validity dates
      const now = new Date();
      if (promo.validFrom && new Date(promo.validFrom) > now) {
        return res.json({ success: false, message: "Promo code not yet valid" });
      }

      if (promo.validUntil && new Date(promo.validUntil) < now) {
        return res.json({ success: false, message: "Promo code has expired" });
      }

      // Check minimum order amount
      if (amount < promo.minOrderAmount) {
        return res.json({ 
          success: false, 
          message: `Minimum order amount of ${promo.minOrderAmount} required for this promo`
        });
      }

      // Check max uses
      if (promo.maxUses !== null && promo.currentUses >= promo.maxUses) {
        return res.json({ success: false, message: "Promo code has reached its usage limit" });
      }

      // Check if user has already used this code
      const userOrders = await ordermodel.find({ 
        userid: userid,
        promoCode: promo.code 
      });

      if (userOrders.length > 0) {
        return res.json({ success: false, message: "You've already used this promo code" });
      }

      discountAmount = promo.discountAmount;
      finalAmount = amount - discountAmount;

      // Prevent negative total amount
      if (finalAmount < 0) finalAmount = 0;

      // Increment promo code usage
      promo.currentUses += 1;
      await promo.save();
    }

    // Step 3: Update product availability
    for (const item of items) {
      const product = await productmodel.findById(item._id);
      const size = item.size;

      // Remove the size from available sizes
      product.sizes = product.sizes.filter(s => s !== size);

      // Mark product as out of stock if no sizes left
      product.outofstock = product.sizes.length === 0;
      await product.save();
    }

    // Step 4: Save order with promo code info
    const orderdata = {
      userid,
      items,
      address,
      amount: finalAmount,
      originalAmount: amount, // Store original amount before discount
      discountAmount,
      promoCode: promoCode || null,
      paymentmethod: "cod",
      payment: false,
      date: Date.now(),
      status: "placed"
    };

    const neworder = new ordermodel(orderdata);
    await neworder.save();

    // Step 5: Clear user cart
    await usermodel.findByIdAndUpdate(userid, { cartdata: {} });

    res.json({ 
      success: true, 
      message: "Order successful", 
      orderId: neworder._id,
      discountApplied: discountAmount,
      finalAmount
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
const  placeorderrazorpay = async (req, res)=>{
    
}


const allorders = async (req, res) => {
  try {
    const orders = await ordermodel.find({});  // ✅ Await the actual data
    res.json({ success: true, orders });       // ✅ Return plain JSON-safe array
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


const  userorder = async (req, res)=>{
    try {
        const userid =req.user.id
        const order=await ordermodel.find({userid})
        res.json({success:true, order})
    } catch (error) {
        console.log(error)
        res.json({success:false ,message:error.message})
    }
}


const  updatestatus = async (req, res)=>{
    try {
      const {orderid, status}= req.body
      await ordermodel.findByIdAndUpdate(orderid,{status})
      res.json({success:true, message:'status updated'})
    } catch (error) {
      console.log(error)
        res.json({success:false ,message:error.message})
    }
}


export {placeorder,placeorderrazorpay,allorders,updatestatus,userorder}
