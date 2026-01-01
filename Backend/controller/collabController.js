// controller/collaboratorController.js
import collaborator from "../models/collaborator.js";
import PromoCode from "../models/promomodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// controller/collaboratorController.js
export const collaboratorLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await collaborator.findOne({ email });
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, role: "collaborator" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // ✅ OLD STYLE RESPONSE
  res.json({ success: true, token });
};

// controller/collaboratorController.js
export const getDashboard = async (req, res) => {
  const collab = await collaborator.findById(req.user.id);

  const promo = await PromoCode.findOne({ code: collab.promoCode });

  res.json({
    name: collab.name,
    email: collab.email,
    promoCode: collab.promoCode,
    testimonial: collab.testimonial,
    usageCount: promo?.currentUses || 0
  });
};

export const updateTestimonial = async (req, res) => {
  const { testimonial } = req.body;

  await collaborator.findByIdAndUpdate(req.user.id, { testimonial });

  res.json({ success: true, message: "Testimonial updated" });
};

