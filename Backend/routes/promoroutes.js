import express from "express";
import { 
  createPromoCode, 
  validatePromoCode, 
  getAllPromoCodes, // Make sure this is imported
  getPromoCodeById,
  updatePromoCode,
  deletePromoCode
} from "../controller/promocontroller.js";
import adminauth from "../middleware/adminauth.js"

const promorouter = express.Router();

// Public routes
promorouter.post("/validate", validatePromoCode);

// Admin routes
promorouter.post("/", adminauth, createPromoCode);
promorouter.get("/", adminauth, getAllPromoCodes);
promorouter.get("/:id", adminauth, getPromoCodeById);
promorouter.put("/:id", adminauth, updatePromoCode);
promorouter.delete("/:id", adminauth, deletePromoCode);
// Add to promoroutes.js
promorouter.get('/test-auth', adminauth, (req, res) => {
  res.json({
    success: true,
    user: req.user // Assuming your adminauth attaches user
  });
});

export default promorouter;