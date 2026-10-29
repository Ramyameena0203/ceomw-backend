require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Headmaster = require("../models/Headmaster");

const createHM = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const username = "hm001";
    const password = "ChangeThisPassword123!";

    const existingHM = await Headmaster.findOne({ username });

    if (existingHM) {
      console.log("HM account already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await Headmaster.create({
      name: "Test Headmaster",
      hmUsername,
      password: hashedPassword,
      schoolName: "ABC Higher Secondary School",
      schoolCode: "SCH001",
      role: "HM",
    });

    console.log("HM account created successfully");
    console.log("Username:", username);
    console.log("Password:", password);
  } catch (error) {
    console.error("Failed to create HM:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

createHM();