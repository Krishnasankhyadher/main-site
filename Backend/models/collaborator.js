// models/Collaborator.js
import mongoose from "mongoose";

const collaboratorSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  promoCode: { type: String, required: true, uppercase: true },

  testimonial: { type: String, default: "" }

}, { timestamps: true });

export default mongoose.model("Collaborator", collaboratorSchema);
