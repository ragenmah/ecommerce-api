const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema({
  orderItems: [
    {
      type: ObjectId,
      ref: "OrderItem",
      required: true,
    },
  ],
  shoppingAddress1: {
    type: String,
  },
  shoppingAddress2: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  zip: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentInfo:{
    id:{
      type:String
    },
    status:{
      type:String
    }
  },    
  user: {
    type: ObjectId,
    ref: "Auth",
    required: true,
  },
  dateOrdered: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Order", orderSchema);
