// controller/testimonialController.js
import Collaborator from "../models/collaborator.js";

export const getPublicTestimonials = async (req, res) => {
  try {
    const testimonials = await Collaborator.find(
      { testimonial: { $ne: "" } }, // not empty
      {
        name: 1,
        testimonial: 1,
        promoCode: 1
      }
    ).sort({ updatedAt: -1 });

    res.json({
      success: true,
      testimonials
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
