const { check } = require("express-validator");

exports.userSignupValidator = [
  check("name").not().isEmpty().withMessage("Name is Required"),
  check("email").isEmail().withMessage("A valid email is required"),
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be a minimum of 8 characters Long"),
];
exports.userSigninValidator = [
  
  check("email").isEmail().withMessage("A valid email is required"),
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be a minimum of 8 characters Long"),
];
