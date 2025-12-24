const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },

    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.costPrice;
        },
        message: "price must be greater than cost price",
      },
    },

    costPrice: {
      type: Number,
      required: true,
      min: [0.01, "the price must be greaterthan zero "],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
