// routes/adminCollaborator.js
import express from "express";
import bcrypt from "bcryptjs";
import collaborator from "../models/collaborator.js";
import PromoCode from "../models/promomodel.js";
import adminauth from "../middleware/adminauth.js";

const collabrouter = express.Router();

collabrouter.post("/add", adminauth, async (req, res) => {
  try {
    const { name, email, password, promoCode } = req.body;

    // check promo exists
    const promo = await PromoCode.findOne({ code: promoCode.toUpperCase() });
    if (!promo) {
      return res.status(400).json({ success: false, message: "Promo code not found" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await collaborator.create({
      name,
      email,
      password: hashed,
      promoCode: promoCode.toUpperCase()
    });

    res.json({ success: true, message: "Collaborator created" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
// Add this inside routes/adminCollaborator.js
collabrouter.get("/all", adminauth, async (req, res) => {
  try {
    const collaborators = await collaborator.find({});
    res.json({ success: true, collaborators });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default collabrouter;
