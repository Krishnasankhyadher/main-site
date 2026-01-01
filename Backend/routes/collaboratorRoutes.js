// routes/collaboratorRoutes.js
import express from "express";
import {
  collaboratorLogin,
  getDashboard,
  updateTestimonial
} from "../controller/collabController.js";
import collaboratorAuth from "../middleware/collaboratorAuth.js";

const router = express.Router();

router.post("/login", collaboratorLogin);
router.get("/dashboard", collaboratorAuth, getDashboard);
router.put("/testimonial", collaboratorAuth, updateTestimonial);
// routes/collaboratorRoutes.js
router.post("/logout", (req, res) => {
  res.clearCookie("collab_token").json({ success: true });
});
// Add this inside routes/collaboratorRoutes.js
router.get("/me", collaboratorAuth, (req, res) => {
  res.json({ success: true, user: req.user });
});


export default router;
