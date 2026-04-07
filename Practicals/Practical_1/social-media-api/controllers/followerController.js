const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const { followers, users } = require("../utils/mockData");

// @desc    Get all followers
// @route   GET /api/followers
// @access  Public
exports.getFollowers = asyncHandler(async (req, res, next) => {
  const results = followers.map((follow) => {
    const followerUser = users.find((u) => u.id == follow.follower_id);
    const followingUser = users.find((u) => u.id == follow.following_id);

    return {
      ...follow,
      follower: followerUser
        ? {
            id: followerUser.id,
            username: followerUser.username,
            full_name: followerUser.full_name,
          }
        : null,
      following: followingUser
        ? {
            id: followingUser.id,
            username: followingUser.username,
            full_name: followingUser.full_name,
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

// @desc    Get single follower relation
// @route   GET /api/followers/:id
// @access  Public
exports.getFollower = asyncHandler(async (req, res, next) => {
  const follow = followers.find((f) => f.id == req.params.id);

  if (!follow) {
    return next(
      new ErrorResponse(`Follower relation not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: follow,
  });
});

// @desc    Create follower relation
// @route   POST /api/followers
// @access  Public
exports.createFollower = asyncHandler(async (req, res, next) => {
  const { follower_id, following_id } = req.body;

  const followerUser = users.find((u) => u.id == follower_id);
  const followingUser = users.find((u) => u.id == following_id);

  if (!followerUser || !followingUser) {
    return next(new ErrorResponse("Follower user or following user not found", 404));
  }

  if (follower_id == following_id) {
    return next(new ErrorResponse("User cannot follow themselves", 400));
  }

  const alreadyFollowing = followers.find(
    (f) => f.follower_id == follower_id && f.following_id == following_id
  );

  if (alreadyFollowing) {
    return next(new ErrorResponse("Already following this user", 400));
  }

  const newFollower = {
    id: (followers.length + 1).toString(),
    follower_id,
    following_id,
    created_at: new Date().toISOString().slice(0, 10),
  };

  followers.push(newFollower);

  res.status(201).json({
    success: true,
    data: newFollower,
  });
});

// @desc    Update follower relation
// @route   PUT /api/followers/:id
// @access  Public
exports.updateFollower = asyncHandler(async (req, res, next) => {
  const follow = followers.find((f) => f.id == req.params.id);

  if (!follow) {
    return next(
      new ErrorResponse(`Follower relation not found with id of ${req.params.id}`, 404)
    );
  }

  const index = followers.findIndex((f) => f.id == req.params.id);

  followers[index] = {
    ...follow,
    ...req.body,
    id: follow.id,
  };

  res.status(200).json({
    success: true,
    data: followers[index],
  });
});

// @desc    Delete follower relation
// @route   DELETE /api/followers/:id
// @access  Public
exports.deleteFollower = asyncHandler(async (req, res, next) => {
  const follow = followers.find((f) => f.id == req.params.id);

  if (!follow) {
    return next(
      new ErrorResponse(`Follower relation not found with id of ${req.params.id}`, 404)
    );
  }

  const index = followers.findIndex((f) => f.id == req.params.id);
  followers.splice(index, 1);

  res.status(200).json({
    success: true,
    data: {},
  });
});