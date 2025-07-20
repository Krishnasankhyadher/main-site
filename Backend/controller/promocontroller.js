import promomodel from "../models/promomodel.js";
import ordermodel from "../models/ordermodel.js";

// Create a new promo code (admin only)
 const createPromoCode = async (req, res) => {
    console.log('----------- STARTING PROMO CREATION -----------');
  console.log('Full request object:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body
  });

   
  try {
    
    console.log("Raw request body:", req.body); 
    const { code, discountAmount, minOrderAmount, maxUses, validFrom, validUntil, isActive } = req.body;
  console.log("Type of discountAmount:", typeof discountAmount);
    console.log("Type of minOrderAmount:", typeof minOrderAmount);
    const promoData = {
      code: code.toUpperCase(),
      discountAmount,
      minOrderAmount: minOrderAmount || 0,
      maxUses: maxUses || null,
      validFrom: validFrom || null,
      validUntil: validUntil || null,
      isActive: isActive !== undefined ? isActive : true
    };
    console.log("Processed promo data:", promoData); 
    const newPromo = new promomodel(promoData);
    await newPromo.save();
    console.log("Saved document:", savedPromo); 
    res.status(201).json({ 
      success: true, 
      message: "Promo code created successfully",
      promo: newPromo 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message.includes('duplicate key') 
        ? 'Promo code already exists' 
        : error.message 
    });
  }
};

// Get all promo codes
 const getAllPromoCodes = async (req, res) => {
  try {
    const promos = await promomodel.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, promos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single promo code
export const getPromoCodeById = async (req, res) => {
  try {
    const promo = await promomodel.findById(req.params.id);
    if (!promo) {
      return res.status(404).json({ success: false, message: 'Promo code not found' });
    }
    res.status(200).json({ success: true, promo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update promo code
export const updatePromoCode = async (req, res) => {
  try {
    const updatedPromo = await promomodel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPromo) {
      return res.status(404).json({ success: false, message: 'Promo code not found' });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Promo code updated successfully',
      promo: updatedPromo 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete promo code
export const deletePromoCode = async (req, res) => {
  try {
    const deletedPromo = await promomodel.findByIdAndDelete(req.params.id);
    
    if (!deletedPromo) {
      return res.status(404).json({ success: false, message: 'Promo code not found' });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Promo code deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Validate a promo code
const validatePromoCode = async (req, res) => {
  try {
    const { code, userId, cartAmount } = req.body;
    const upperCode = code.toUpperCase().trim();

    // Find the promo code
    const promo = await promomodel.findOne({ code: upperCode, isActive: true });

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
    if (cartAmount < promo.minOrderAmount) {
      return res.json({ 
        success: false, 
        message: `Minimum order amount of ${promo.minOrderAmount} required for this promo`
      });
    }

    // Check max uses
    if (promo.maxUses !== null && promo.currentUses >= promo.maxUses) {
      return res.json({ success: false, message: "Promo code has reached its usage limit" });
    }

    // Check if user has already used this code (optional)
    const userOrders = await ordermodel.find({ 
      userid: userId,
      promoCode: upperCode 
    });

    if (userOrders.length > 0) {
      return res.json({ success: false, message: "You've already used this promo code" });
    }

    res.json({ 
      success: true, 
      discount: promo.discountAmount,
      promoCode: promo.code
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// List all promo codes (admin)
const listPromoCodes = async (req, res) => {
  try {
    const promos = await promomodel.find({});
    res.json({ success: true, promos });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update promo code status (admin)
const updatePromoStatus = async (req, res) => {
  try {
    const { promoId, isActive } = req.body;
    await promomodel.findByIdAndUpdate(promoId, { isActive });
    res.json({ success: true, message: "Promo code updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { createPromoCode, validatePromoCode, listPromoCodes, updatePromoStatus,getAllPromoCodes };