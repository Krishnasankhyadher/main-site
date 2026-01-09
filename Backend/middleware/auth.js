import jwt from "jsonwebtoken";

const authuser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "User not authorized",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    

    if (decoded.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Only users can access this route",
      });
    }

    // ✅ SINGLE SOURCE OF TRUTH
    req.userId = decoded.userId;

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid user token",
    });
  }
};

export default authuser;
