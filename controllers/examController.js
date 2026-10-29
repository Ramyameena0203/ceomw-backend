const Exam = require("../models/examModel");
const Question = require("../models/questionModel");

// Get exams based on exam type
const getExamsByType = async (req, res) => {

  try {

    const { examType } = req.params;

    const exams = await Exam.find({
      examType: examType.toUpperCase(),
      status: "published"
    });

    res.status(200).json(exams);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching exams",
      error: error.message
    });

  }
};


// Get questions for selected exam
const getExamQuestions = async (req, res) => {

  try {

    const { examId } = req.params;

    const exam = await Exam.findOne({
      _id: examId,
      status: "published"
    });

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found"
      });
    }

    const questions = await Question.find({
      examId: exam._id
    })
      .select("-correctAnswer -__v")
      .sort({ questionNumber: 1 })
      .lean();

    res.status(200).json(questions);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching questions",
      error: error.message
    });

  }

};

module.exports = {
  getExamsByType,
  getExamQuestions
};