import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';  
import authRoutes from './routes/auth.js';
import User from './models/User.js';
import tradeRoutes from './routes/trades.js';
import priceRoutes from './routes/price.js';
import { authenticateToken } from './middleware/auth.js';
import portfolioRoutes from './routes/portfolio.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));


app.use("/api", authRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/price", priceRoutes);
app.use("/api/portfolio", portfolioRoutes);

app.get("/profile" , authenticateToken ,async (req , res) => {
  const {email} = req.query; 
  try {
    const profile = await User.findOne({email}); 
    if(!profile) res.status(404).json({message : "user not found"});

    res.json({username : profile.username , email : email, name : profile.name});
  } catch(err) {
    console.log("error while fetching profile" , err);
    res.status(500).json({message : "server error"});
  }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
