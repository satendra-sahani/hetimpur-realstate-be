import { Schema, model, Types } from 'mongoose';

const landSchema = new Schema({
  client: { type: Types.ObjectId, ref: 'User', required: true },
  image: { type: String, required: true }, // Store image path
  address: { type: String, required: true },
  status: { type: String, enum: ['available', 'sold'], default: 'available' },
}, { timestamps: true });

export default model('Land', landSchema);