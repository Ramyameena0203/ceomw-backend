const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    examType: {
      type: String,
      enum: ["NEET", "JEE", "TANCET", "GRE"],
      required: true
    },

    examName: {
      type: String,
      required: true
    },

    questionPaper: {
      type: String
    },

    duration: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", examSchema);