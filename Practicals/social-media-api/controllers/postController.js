const { posts } = require("../utils/mockData");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

// GET POSTS
exports.getPosts = asyncHandler(async (req, res) => {
  res.formatResponse({
    success: true,
    count: posts.length,
    data: posts
  });
});

// GET POST
exports.getPost = asyncHandler(async (req, res, next) => {
  const post = posts.find(p => p.id == req.params.id);

  if (!post) return next(new ErrorResponse("Post not found", 404));

  res.formatResponse({ success: true, data: post });
});

// CREATE POST
exports.createPost = asyncHandler(async (req, res) => {
  const newPost = {
    id: posts.length + 1,
    ...req.body,
    created_at: new Date()
  };

  posts.push(newPost);

  res.status(201).formatResponse({
    success: true,
    data: newPost
  });
});

// UPDATE POST
exports.updatePost = asyncHandler(async (req, res, next) => {
  const post = posts.find(p => p.id == req.params.id);

  if (!post) return next(new ErrorResponse("Post not found", 404));

  Object.assign(post, req.body);

  res.formatResponse({ success: true, data: post });
});

// DELETE POST
exports.deletePost = asyncHandler(async (req, res, next) => {
  const index = posts.findIndex(p => p.id == req.params.id);

  if (index === -1) return next(new ErrorResponse("Post not found", 404));

  posts.splice(index, 1);

  res.formatResponse({ success: true, message: "Post deleted" });
});