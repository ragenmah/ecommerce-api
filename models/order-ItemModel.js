const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const orderitemSchema = new mongoose.Schema(
  {
    quantity: {
      type: Number,
      require: true,
    },
    product: {
      type: ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderItem", orderitemSchema);
