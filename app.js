const express = require("express");
const cors = require("cors");
const blogRoutes = require("./controllers/blogRoutes");
const userRoutes = require("./controllers/userRoutes");
const loginRoute = require("./controllers/loginRoute");
const testingRoute = require("./controllers/testingRoutes");
const User = require("./models/user");

const app = express();

const errorHandler = (err, req, res, next) => {
  if (err.code === 11000) {
    res.status(400).send({ error: "username exists" });
  } else if (err.name === "JsonWebTokenError") {
    res.status(400).send("invalid token");
  }
  next(err);
};
const tokenExtractor = (req, res, next) => {
  const auth = req.get("authorization");
  console.log(auth, "here again");
  if (
    auth &&
    auth.toLowerCase().startsWith("bearer") &&
    auth.substring(7).length > 10
  ) {
    req.token = auth.substring(7);
    console.log(req.token);
  } else {
    req.token = null;
  }
  next();
};

const userExtractor = (req, res, next) => {
  req.user = User.findById(req.token.id);
  next();
};

app.use(cors());
app.use(express.json());
app.use(express.static("build"));

app.use("/api/blogs/", tokenExtractor, blogRoutes);
app.use("/api/users/", tokenExtractor, userRoutes);
app.use("/api/login", loginRoute);
app.use("/api/testing/reset", testingRoute);
app.use(errorHandler);

module.exports = app;
