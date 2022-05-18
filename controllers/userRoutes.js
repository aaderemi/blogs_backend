const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRouter = require("express").Router();

userRouter.post("/", async (req, res, next) => {
  const body = req.body;
  if (!body.password || body.password.length < 3) {
    return res
      .status(400)
      .send({ error: "include password or password too short" });
  }
  const pwHash = await bcrypt.hash(body.password, 10);
  const newUser = new User({
    username: body.username,
    name: body.name,
    passwordHash: pwHash,
  });

  try {
    const result = await newUser.save();
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/", async (req, res) => {
  let userId;
  //console.log(req.token)
  if (req.token) {
    const user = jwt.verify(req.token, process.env.SECRET);
    userId = user.id;
  } else {
    return res.status(400).json({ message: "Please log in" });
  }
  console.log("here", userId);
  const result = await User.findById(userId).populate("blogs", { owner: 0 });
  res.status(200).json(result);
});

module.exports = userRouter;
