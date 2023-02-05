const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const sendgridmail = require("@sendgrid/mail");
sendgridmail.setApiKey(process.env.SENDGRID_API_KEY);

exports.signup = (req, res) => {
  const { name, email, password } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({ error: "Email is already taken" });
    }
    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "10m" }
    );
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Account activation link",
      html: `<p>Please use account activation link to activate your grovyo account</p> ${process.env.CLIENT_URL}/auth/activate/${token}
      <hr/>
      <p>This email may contain sensitive information<p/>
      <p>${process.env.CLIENT_URL}<p/>`,
    };
    sendgridmail.send(emailData).then((sent) => {
      return res.json({ message: `Email has been sent to ${email}.` });
    });
  });
};

exports.accountActivation = (req, res) => {
  const { token } = req.body;
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_ACCOUNT_ACTIVATION,
      function (err, decoded) {
        if (err) {
          console.log("JWT VERIFY IN ACCOUNT ACTIVATION ERROR", err);
          return res.status(401)({
            error: "Expired Link. Signup again",
          });
        }
        const { name, email, password } = jwt.decode(token);

        const user = new User({ email, name, password });

        user.save((err, user) => {
          if (err) {
            console.log("SAVE USER IN ACCOUNT ACTIVATION ERROR", err);
            return res.status(401).json({
              error: "Error saving user in database. Try again",
            });
          }
          return res.json({
            message: "Signup success. Please Signin",
          });
        });
      }
    );
  } else {
    return res.json({
      message: "Something went wrong.Try again",
    });
  }
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.json(400).json({
        error: "User with that email does not exist Plase signup",
      });
    }
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email and Password do not match",
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const { _id, name, email, role } = user;
    return res.json({
      token,
      user: { _id, name, email, role },
    });
  });
};
