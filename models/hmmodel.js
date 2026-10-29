const mongoose = require("mongoose");

const headmasterSchema = new mongoose.Schema(
  {
    hmName: {
      type: String,
      required: true,
      trim: true,
    },

    hmUserName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    schoolName: {
      type: String,
      required: true,
      trim: true,
    },

    schoolType: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    udiseCode: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    role: {
      type: String,
      default: "HM",
      enum: ["HM"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Headmaster", headmasterSchema);