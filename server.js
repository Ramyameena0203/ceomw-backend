const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const examRoutes = require("./routes/examRoutes");

// Import Routes
const studentRoutes = require("./routes/studentRegistrationRoutes");
const hmRoutes = require("./routes/hmRoutes");

dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

// Test API
app.get("/", (req, res) => {
  res.send("Examination Backend Running Successfully");
});


//routes
app.use("/api/students", studentRoutes);
app.use("/api/hm", hmRoutes);

//admin routes
app.use("/api/exams", examRoutes);


// Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Start server only after successful connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Backend startup failed:", error.message);
    process.exit(1);
  }
};

startServer();