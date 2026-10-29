const express = require("express");

const router = express.Router();

const { registerStudent } = require("../controllers/studentRegistrationController");

// Register New Student
router.post("/register", registerStudent);

module.exports = router;