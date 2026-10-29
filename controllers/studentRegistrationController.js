const Student = require("../models/studentRegistrationModel");

// Register New Student
const registerStudent = async (req, res) => {
  try {
    console.log("1. Registration API called");
    console.log("2. Received data:", req.body);
    const {
      studentType,
      schoolName,
      examinationName,
      studentName,
      className,
      fatherName,
      emisNo,
      dateOfBirth,
      gender,
      mobileNumber,
    } = req.body;

    // Validate required fields
    if (
      !studentType ||
      !schoolName ||
      !examinationName||
      !studentName ||
      !className ||
      !fatherName ||
      !emisNo ||
      !dateOfBirth ||
      !gender ||
      !mobileNumber
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }
console.log("3. Creating student document");
    // Save student in MongoDB
    const student = await Student.create({
      studentType,
      schoolName,
      examinationName,
      studentName,
      className,
      fatherName,
      emisNo,
      dateOfBirth,
      gender,
      mobileNumber,
    });
console.log("4. Student saved successfully");
    return res.status(201).json({
      success: true,
      message: "Student registered successfully",
      studentId: student._id,
    });
  } catch (error) {
    console.error("Registration Error:", error);

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid student registration details",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { registerStudent };