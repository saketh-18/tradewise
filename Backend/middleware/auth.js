// middleware/auth.js
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  // console.log("Cookies:", req.cookies);
  // console.log("Decoded User:", req.user);
  if (!token) return res.status(401).json({ message: "Access denied. No token." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // console.log("Decoded payload:", decoded); 
    req.user = decoded;
    next();
  } catch (err) {
    // console.error("JWT verify failed:", err.message);
    res.status(401).json({ message: "Invalid token." });
  }
};

export default authenticateToken; 
