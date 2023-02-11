import mongoose from "mongoose";

const schema = new mongoose.Schema({
  code: { type: String, unique: true },
  email: { type: String, unique: true },
}, {
  timestamps: true,
  expireAfterSeconds: 180
});

export const CodeModel = mongoose.model('Code', schema);