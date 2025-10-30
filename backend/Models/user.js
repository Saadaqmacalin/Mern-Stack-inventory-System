const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: [true, "name must be provided"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "emali must be provided"],
  },
  password: {
    type: String,
    minlength: 8,
    required: [true, "password must be provided"],
  },
  Status: {
    type: String, 
    enum: ["ADMIN", "USER"], 
    default: "USER", 
  },
});

userSchema.pre("save", async function () {
  const salr = await bcrypt.genSalt(15);
  this.password = await bcrypt.hash(this.password, salr);
});

userSchema.methods.comparePassword = async function (reqPassword) {
  const isMatch = await bcrypt.compare(this.password, reqPassword);
  return isMatch;
};

userSchema.methods.createJWT = function () {
  jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = mongoose.model("Usee", userSchema);
