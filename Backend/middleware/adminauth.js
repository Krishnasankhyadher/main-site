import jwt from "jsonwebtoken";

const adminauth = (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] ||
      req.headers.token;

    if (!token) {
      return res.status(401).json({ success: false });

    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false });
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false });
  }
};

export default adminauth
