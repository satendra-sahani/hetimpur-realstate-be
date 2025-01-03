import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, default:"" },
  password: { type: String, required: true,},
  contact: { type: String, required: true ,unique:true},
  address: { type: String },
  role: { type: String, enum: ['admin', 'client', 'user'], default: 'user' },
  linkId: { type: String, default: "" },
  approved: { type: Boolean, default: false }, // For payment approval by admin
}, { timestamps: true });

export default model('User', userSchema);
