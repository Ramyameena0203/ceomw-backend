const jwt = require("jsonwebtoken");
const Headmaster = require("../models/hmmodel");

const protectHM = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing",
      });
    }

    // Verify token signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "HM" || !decoded.hmId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Confirm HM still exists and is active
    const hm = await Headmaster.findById(decoded.hmId);

    if (!hm || !hm.isActive || hm.role !== "HM") {
      return res.status(401).json({
        success: false,
        message: "HM account is unavailable",
      });
    }

    // Attach trusted HM information to the request
    req.hm = hm;

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    console.error("HM Authentication Error:", error);

    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

module.exports = protectHM;