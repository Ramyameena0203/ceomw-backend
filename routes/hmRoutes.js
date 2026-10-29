const express = require("express");
const router = express.Router();

const{ getHmLogin } = require("../controllers/hmController");
const{ hmLogin } = require("../controllers/hmController")
const{ hmRegister } = require("../controllers/hmController")

router.post("/register", hmRegister);

router.get("/students", getHmLogin);
router.post("/login", hmLogin)

module.exports = router;