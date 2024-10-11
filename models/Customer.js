import mongoose from "mongoose";

// Define the schema for Customer
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  memberNumber: {
    type: Number,
    required: true
  },
  interests: {
    type: [String], // Array of strings for storing multiple interests
    required: true
  }
});

// Check if the Customer model already exists (to avoid model overwrite during hot reload in development)
const Customer = mongoose.models.Customer || mongoose.model("Customer", customerSchema);

export default Customer;
