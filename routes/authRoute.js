const express = require("express");
const { signup } = require("../controllers/authController");

const router = express.Router();

//validators
const { userSignupValidator } = require("../validators/auth");
const { runValidation } = require("../validators");

router.post("/signup", userSignupValidator, runValidation, signup);

module.exports = router;
