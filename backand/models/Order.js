const mongoose=require("mongoose")

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        title: String,
        image: String,
        price: Number,
        quantity: Number,
        size: String,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "Processing",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);