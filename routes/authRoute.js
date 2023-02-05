const express = require("express");
const {
  signup,
  accountActivation,
  signin,
} = require("../controllers/authController");

const router = express.Router();

//validators
const {
  userSignupValidator,
  userSigninValidator,
} = require("../validators/auth");
const { runValidation } = require("../validators");

router.post("/signup", userSignupValidator, runValidation, signup);
router.post("/activation", accountActivation);
router.post("/signin", userSigninValidator, runValidation, signin);

module.exports = router;
