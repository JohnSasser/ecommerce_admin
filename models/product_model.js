import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  price: { type: Number, required: true },
  images: { type: Array },
  category: {
    type: mongoose.Types.ObjectId,
    ref: 'Category',
    required: false,
  },
  properties: {
    type: Object,
  },
});

export const Product = models.Product || model('Product', ProductSchema);
