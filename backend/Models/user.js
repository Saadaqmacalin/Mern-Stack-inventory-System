import { Schema, model } from "mongoose";
import { genSalt, hash, compare } from "bcrypt";
import jwt from 'jsonwebtoken';

const userSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 50,
      required: [true, "name must be provided"],
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, "email must be provided"],
      trim: true,
    },

    password: {
      type: String,
      minlength: 8,
      required: [true, "password must be provided"],
    },

    status: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },

    // One-to-One → Profile
    profile: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
    },

    // One-to-Many → Purchases
    purchases: [
      {
        type: Schema.Types.ObjectId,
        ref: "Purchase",
      },
    ],

    // One-to-Many → Sales
    sales: [
      {
        type: Schema.Types.ObjectId,
        ref: "Sale",
      },
    ],

    // One-to-Many → Orders
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],

    // One-to-Many → Reports
    reports: [
      {
        type: Schema.Types.ObjectId,
        ref: "Report",
      },
    ],

    // One-to-Many → Help Tickets
    helpRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: "Help",
      },
    ],

  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) { 
  if (!this.isModified("password")) return next();  // hash only when the password updated 
  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
});

// Compare password
userSchema.methods.comparePassword = async function (reqPassword) {
  return await compare(reqPassword, this.password);
};

// Create JWT
userSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      userId: this._id,
      name: this.name,
      status: this.status,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

export default model("Users", userSchema);
