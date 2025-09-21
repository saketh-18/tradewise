// middleware/auth.js
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log("Auth middleware - Cookies:", req.cookies);
  console.log("Auth middleware - Token:", token ? "Present" : "Missing");
  
  if (!token) {
    console.log("No token found in cookies");
    return res.status(401).json({ message: "Access denied. No token." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Auth middleware - Decoded payload:", decoded); 
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verify failed:", err.message);
    res.status(401).json({ message: "Invalid token." });
  }
};

export default authenticateToken; 
