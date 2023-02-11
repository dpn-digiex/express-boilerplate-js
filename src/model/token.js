import mongoose from "mongoose";

const schema = new mongoose.Schema({
  token: String,
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
});

export const TokenModel = mongoose.model('Token', schema);
