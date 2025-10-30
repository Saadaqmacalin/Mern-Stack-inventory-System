const mongoose = require("mongoose");

const connectDB = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("mongoDB connected successfully");
  } catch (error) {
    console.error("error ocured while connecting to the database", error);
    process.exit(1);
  }
};
module.exports = connectDB ;