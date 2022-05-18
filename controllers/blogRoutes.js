const { isUndefined } = require("lodash");
const Blog = require("../models/blog");
const User = require("../models/user");
const router = require("express").Router();
const jwt = require("jsonwebtoken");

router.get("/", async (req, res, next) => {
  /*
    let userId
    //console.log(req.token)
    
    //console.log(req.token, 'blog get')*/
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    const blogs = await Blog.find({}).populate("owner", {
      username: 1,
      name: 1,
      id: 1,
    });
    //console.log(blogs)
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const token = req.token;
  //console.log(token)
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (!token || !decodedToken) {
      return res
        .status(401)
        .json({ error: "no authorisation or incorrect token" });
    }

    if (!req.body.likes) {
      req.body.likes = 0;
    }
    const body = req.body;
    const blogOwner = await User.findById(decodedToken.id);
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      owner: blogOwner._id,
    });
    const result = await blog.save();
    blogOwner.blogs.push(result._id);
    await blogOwner.save();
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const token = req.token;
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!token || !decodedToken) {
      return res
        .status(401)
        .json({ error: "no authorisation or incorrect token" });
    }

    const id = req.params.id;
    const body = req.body;
    const newBlog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
    };
    const result = await Blog.findByIdAndUpdate(id, newBlog, { new: true });
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const token = req.token;
    const decodedToken = jwt.verify(token, process.env.SECRET);
    //console.log(token)
    if (!token || !decodedToken) {
      return res
        .status(401)
        .json({ error: "no authorisation or incorrect token" });
    }

    const id = req.params.id;
    await Blog.findByIdAndRemove(id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

router.post("/:id/comments", async (req, res, next) => {
  const token = req.token;
  //console.log(token)
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (!token || !decodedToken) {
      return res
        .status(401)
        .json({ error: "no authorisation or incorrect token" });
    }

    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    const comment = req.body.comment;
    blog.comments.push({ comment: comment });
    await blog.save();
    res.status(201).json(blog);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
