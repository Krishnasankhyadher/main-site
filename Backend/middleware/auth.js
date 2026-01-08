import jwt from "jsonwebtoken";

const authuser = (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] ||
      req.headers.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User not authorized"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 THIS IS THE KEY CHECK
    if (decoded.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Admin token cannot access user routes"
      });
    }

    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid user token"
    });
  }
};

export default authuser;
