const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const { comments, users, posts } = require("../utils/mockData");

// @desc    Get all comments
// @route   GET /api/comments
// @access  Public
exports.getComments = asyncHandler(async (req, res, next) => {
  const results = comments.map((comment) => {
    const user = users.find((u) => u.id == comment.user_id);
    const post = posts.find((p) => p.id == comment.post_id);

    return {
      ...comment,
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

// @desc    Get single comment
// @route   GET /api/comments/:id
// @access  Public
exports.getComment = asyncHandler(async (req, res, next) => {
  const comment = comments.find((c) => c.id == req.params.id);

  if (!comment) {
    return next(
      new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: comment,
  });
});

// @desc    Create comment
// @route   POST /api/comments
// @access  Public
exports.createComment = asyncHandler(async (req, res, next) => {
  const { text, user_id, post_id } = req.body;

  const user = users.find((u) => u.id == user_id);
  const post = posts.find((p) => p.id == post_id);

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  if (!post) {
    return next(new ErrorResponse("Post not found", 404));
  }

  const newComment = {
    id: (comments.length + 1).toString(),
    text,
    user_id,
    post_id,
    created_at: new Date().toISOString().slice(0, 10),
  };

  comments.push(newComment);

  res.status(201).json({
    success: true,
    data: newComment,
  });
});

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Public
exports.updateComment = asyncHandler(async (req, res, next) => {
  const comment = comments.find((c) => c.id == req.params.id);

  if (!comment) {
    return next(
      new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404)
    );
  }

  const index = comments.findIndex((c) => c.id == req.params.id);

  comments[index] = {
    ...comment,
    ...req.body,
    id: comment.id,
  };

  res.status(200).json({
    success: true,
    data: comments[index],
  });
});

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Public
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const comment = comments.find((c) => c.id == req.params.id);

  if (!comment) {
    return next(
      new ErrorResponse(`Comment not found with id of ${req.params.id}`, 404)
    );
  }

  const index = comments.findIndex((c) => c.id == req.params.id);
  comments.splice(index, 1);

  res.status(200).json({
    success: true,
    data: {},
  });
});