import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get("/", (req, res) => { 
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log(err);
    })
})