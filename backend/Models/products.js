import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",

      required: [true, "category Id must be provided "],
    },

    supplierId: {
      type: Schema.Types.ObjectId,
      ref: "Supplier",
      required: [true, "supplier Id must be provided "],
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

export default model("Product", productSchema);
