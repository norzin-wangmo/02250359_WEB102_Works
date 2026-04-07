const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const { likes, users, posts } = require("../utils/mockData");

// @desc    Get all likes
// @route   GET /api/likes
// @access  Public
exports.getLikes = asyncHandler(async (req, res, next) => {
  const results = likes.map((like) => {
    const user = users.find((u) => u.id == like.user_id);
    const post = posts.find((p) => p.id == like.post_id);

    return {
      ...like,
      user: user
        ? {
            id: user.id,
            username: user.username,
            full_name: user.full_name,
          }
        : null,
      post: post
        ? {
            id: post.id,
            caption: post.caption,
          }
        : null,
    };
  });

  res.status(200).json({
    success: true,
    count: results.length,
    data: results,
  });
});

// @desc    Get single like
// @route   GET /api/likes/:id
// @access  Public
exports.getLike = asyncHandler(async (req, res, next) => {
  const like = likes.find((l) => l.id == req.params.id);

  if (!like) {
    return next(new ErrorResponse(`Like not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: like,
  });
});

// @desc    Create like
// @route   POST /api/likes
// @access  Public
exports.createLike = asyncHandler(async (req, res, next) => {
  const { user_id, post_id } = req.body;

  const user = users.find((u) => u.id == user_id);
  const post = posts.find((p) => p.id == post_id);

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  if (!post) {
    return next(new ErrorResponse("Post not found", 404));
  }

  const alreadyLiked = likes.find(
    (l) => l.user_id == user_id && l.post_id == post_id
  );

  if (alreadyLiked) {
    return next(new ErrorResponse("User already liked this post", 400));
  }

  const newLike = {
    id: (likes.length + 1).toString(),
    user_id,
    post_id,
    created_at: new Date().toISOString().slice(0, 10),
  };

  likes.push(newLike);

  res.status(201).json({
    success: true,
    data: newLike,
  });
});

// @desc    Update like
// @route   PUT /api/likes/:id
// @access  Public
exports.updateLike = asyncHandler(async (req, res, next) => {
  const like = likes.find((l) => l.id == req.params.id);

  if (!like) {
    return next(new ErrorResponse(`Like not found with id of ${req.params.id}`, 404));
  }

  const index = likes.findIndex((l) => l.id == req.params.id);

  likes[index] = {
    ...like,
    ...req.body,
    id: like.id,
  };

  res.status(200).json({
    success: true,
    data: likes[index],
  });
});

// @desc    Delete like
// @route   DELETE /api/likes/:id
// @access  Public
exports.deleteLike = asyncHandler(async (req, res, next) => {
  const like = likes.find((l) => l.id == req.params.id);

  if (!like) {
    return next(new ErrorResponse(`Like not found with id of ${req.params.id}`, 404));
  }

  const index = likes.findIndex((l) => l.id == req.params.id);
  likes.splice(index, 1);

  res.status(200).json({
    success: true,
    data: {},
  });
});