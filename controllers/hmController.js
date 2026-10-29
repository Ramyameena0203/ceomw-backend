const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/studentRegistrationModel");
const Headmaster = require("../models/hmmodel")

// HM Registration API
const hmRegister = async (req, res) => {
  try {
    console.log("1. HM Registration Request:", {
      udiseCode: req.body.udiseCode,
      schoolName: req.body.schoolName,
      schoolType: req.body.schoolType,
      hmName: req.body.hmName,
      hmUserName: req.body.hmUserName,
    });

    // Step 1: Get data from Postman
    const {
      udiseCode,
      schoolName,
      schoolType,
      hmName,
      hmUserName,
      password,
    } = req.body;

    // Step 2: Validate all fields
    if (
      [udiseCode, schoolName, schoolType, hmName, hmUserName, password]
        .some(value => typeof value !== "string" || !value.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters",
      });
    }

    // Step 3: Check whether HM already exists
    const existingHM = await Headmaster.findOne({
      udiseCode: udiseCode.trim().toUpperCase(),
    });

    if (existingHM) {
      return res.status(409).json({
        success: false,
        message: "HM already registered for this school",
      });
    }

    // Step 4: Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Step 5: Create HM
    const newHM = await Headmaster.create({
      udiseCode: udiseCode.trim().toUpperCase(),
      schoolName: schoolName.trim(),
      schoolType: schoolType.trim(),
      hmName: hmName.trim(),
      hmUserName: hmUserName.trim().toLowerCase(),
      password: hashedPassword,
      role: "HM",
      isActive: true,
    });

    console.log("2. HM Created Successfully:", newHM._id);

    // Step 6: Send response
    return res.status(201).json({
      success: true,
      message: "HM registered successfully",
      hm: {
        id: newHM._id,
        udiseCode: newHM.udiseCode,
        schoolName: newHM.schoolName,
        schoolType: newHM.schoolType,
        hmName: newHM.hmName,
        hmUserName: newHM.hmUserName,
      },
    });

  } catch (error) {
    console.error("HM Registration Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "HM already registered for this school",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid HM registration details",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const hmLogin = async (req, res) => {
    try {
        console.log("1. HM Login request received");

        // 1. Get request data
        const {
            udiseCode,
            schoolName,
            schoolType,
            hmUserName,
            password
        } = req.body;

        // 2. Validate inputs
        if (
            [udiseCode, schoolName, schoolType, hmUserName, password]
                .some(value => typeof value !== "string" || !value.trim())
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // 3. Search HM
        const hm = await Headmaster.findOne({
            udiseCode: udiseCode.trim().toUpperCase(),
            hmUserName: hmUserName.trim().toLowerCase()
        }).select("+password");

        console.log("HM found:", !!hm);

        // 4. Check HM exists and is active
        if (!hm || hm.isActive !== true) {
            return res.status(401).json({
                success: false,
                message: "Invalid login credentials"
            });
        }

        // 5. Verify school details
        if (
            hm.schoolName?.trim().toLowerCase() !==
                schoolName.trim().toLowerCase() ||
            hm.schoolType?.trim().toLowerCase() !==
                schoolType.trim().toLowerCase()
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid login credentials"
            });
        }

        // 6. Verify password
        const isPasswordValid = await bcrypt.compare(
            password,
            hm.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid login credentials"
            });
        }

        // 7. Generate JWT
        const token = jwt.sign(
            {
                hmId: hm._id.toString(),
                role: hm.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h"
            }
        );

        // 8. Return response
        return res.status(200).json({
            success: true,
            message: "HM Login Successful",
            token,
            hm: {
                id: hm._id,
                hmName: hm.hmName,
                hmUserName: hm.hmUserName,
                udiseCode: hm.udiseCode,
                schoolName: hm.schoolName,
                schoolType: hm.schoolType,
                role: hm.role
            }
        });

    } catch (error) {
        console.error("HM Login Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const getHmLogin = async (req, res) => {
    try{
        const hm = req.hm;
        
        const students = await Student.find({
            udiseCode: hm.udiseCode,
        })
            .select("-__v")
            .sort({ createdAt: -1 })
            .lean();
        return res.status(200).json({
            success: true,
            count: students.length,
            students,
        });
    } catch(error){
        console.error("Get HM Students Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve students"
        });
    }
};

module.exports = {
    getHmLogin, hmLogin, hmRegister
}
