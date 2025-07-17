import jwt from 'jsonwebtoken';

const authuser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.json({ success: false, message: "Not authorized, login again" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const tokendecode = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = tokendecode;
    
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authuser;
