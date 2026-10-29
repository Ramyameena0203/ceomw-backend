const mongoose = require("mongoose");

const studentRegistratioSchema = new mongoose.Schema(
    {
        studentType: {
            type: String,
            required: true,
            // trim: true,
        },
        schoolName: {
            type: String,
            required: true,
        },
        examinationName: {
            type: String,
            required: true,
        },
        studentName: {
            type: String,
            required: true,
            trim: true,
        },
        className: {
            type: String,
            required: true,
        },
        fatherName: {
            type: String,
            required: true,
        },
        emisNo: {
            type: String,
            required: true,
        },
        dateOfBirth: {
            type: Date,
            required: true,
        },
        gender: {
            type: String,
            required: true,
            enum: ["Male", "Female", "Other"],
        },
        mobileNumber: {
            type: String,
            required: true,
            match: /^[6-9]\d{9}$/,
        },
        udiseCode: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
    },
    {
    timestamps: true,
    }
);

module.exports = mongoose.model("StudentRegistration", studentRegistratioSchema);
