import mongoose from "mongoose";

const TradeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  symbol: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }, // price at time of trade
  type: { type: String, enum: ["buy", "sell"], required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Trade", TradeSchema);
    