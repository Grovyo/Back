const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB Connected"))
  .catch((e) => console.log("DB CONNECTION ERROR:", e));

const authRoutes = require("./routes/authRoute");
app.use(morgan("dev"));
app.use(bodyParser.json());

if ((process.env.NODE_ENV = "development")) {
  app.use(cors({ origin: "http://localhost:3000" }));
}

//middleware
app.use("/api", authRoutes);

//app middlewares

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`API is running on ${PORT} in ${process.env.NODE_ENV} mode.`);
});
