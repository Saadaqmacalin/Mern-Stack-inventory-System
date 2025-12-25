import { Schema, model } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 30,
      required: [true, "category name must be provided"],
    },
    description: {
      type: String,
      minlength: 15,
      required: [true, "category description must be provided"],
    },
  },
  {
    timestamps: true,
  }
);

export default model("Category", categorySchema);
