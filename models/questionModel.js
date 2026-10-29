const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true
    },

    questionNumber: {
      type: Number,
      required: true
    },

    questionText: {
      type: String,
      required: true
    },

    options: [
      {
        key: String,
        text: String
      }
    ],

    correctAnswer: {
      type: String,
      required: true
    },

    marks: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);