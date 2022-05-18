const mongoose = require("mongoose");
const logger = require("../utils/logger");
const config = require("../utils/config");

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl).then(() => {
  logger.info("connected to db!");
  logger.info(mongoUrl);
});

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  comments: [{ comment: String }],
});

blogSchema.set("toJSON", {
  transform: (doc, retObj) => {
    retObj.id = retObj._id.toString();
    delete retObj._id;
    delete retObj.__v;
  },
});

module.exports = mongoose.model("Blog", blogSchema);
