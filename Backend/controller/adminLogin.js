import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { email, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res
    .cookie("admin_token", token, {
      httpOnly: true,
      secure: false,     // ❗ true only in production HTTPS
      sameSite: "lax",   // ❗ IMPORTANT for localhost
      maxAge: 7 * 24 * 60 * 60 * 1000
    })
    .json({ success: true });
};
