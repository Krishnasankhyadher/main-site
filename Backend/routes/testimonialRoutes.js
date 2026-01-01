// routes/testimonialRoutes.js
import express from "express";
import { getPublicTestimonials } from "../controller/testimonialController.js";

const router = express.Router();

router.get("/", getPublicTestimonials);

export default router;
