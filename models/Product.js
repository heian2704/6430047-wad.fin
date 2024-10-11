import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: false },
  price: { type: Number, required: true },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "category" 
  },
});

const Product = mongoose.models.product || mongoose.model("product", productSchema);

export default Product;
