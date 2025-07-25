import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  "name" : {type : String , required : true},
  "username" : {type : String , required:true , unique : true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Watchlist is an array of stock symbol strings
  watchlist: { type: [String], default: [] }
});

export default mongoose.model("User", UserSchema);
