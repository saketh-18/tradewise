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
import profileRoute from './routes/profile.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://tradewise-pi.vercel.app", 
    "https://tradewise-sakeths-projects-dbd1767a.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));


app.use("/api", authRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/price", priceRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/profile" , profileRoute);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
