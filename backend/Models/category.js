const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
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

module.exports = mongoose.model("Category", categorySchema);
