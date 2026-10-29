const express = require("express");

const router = express.Router();

const {
  getExamsByType,
  getExamQuestions
} = require("../controllers/examController");

router.get("/type/:examType", getExamsByType);

router.get("/:examId/questions", getExamQuestions);

module.exports = router;