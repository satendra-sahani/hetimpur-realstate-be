import { Schema, model, Types } from 'mongoose';

const landSchema = new Schema({
  client: { type: Types.ObjectId, ref: 'User', required: true },
  image: { type: String, default:"https://img.freepik.com/free-photo/beautiful-landscape-with-red-pin_23-2149721828.jpg" }, // Store image path
  state: { type: String, default: "" },
  city: { type: String, default: "" },
  number: { type: String, default: "" },
  price: { type: String, default: "" },
  status: { type: String, enum: ['available', 'sold'], default: 'available' },
  paymentStatus: { type: Boolean, default: false }
}, { timestamps: true });

export default model('Land', landSchema);