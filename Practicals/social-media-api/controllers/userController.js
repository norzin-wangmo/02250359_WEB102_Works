const { users } = require("../utils/mockData");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

// GET USERS
exports.getUsers = asyncHandler(async (req, res) => {
  res.formatResponse({
    success: true,
    count: users.length,
    data: users
  });
});

// GET SINGLE USER
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = users.find(u => u.id == req.params.id);

  if (!user) return next(new ErrorResponse("User not found", 404));

  res.formatResponse({ success: true, data: user });
});

// CREATE USER
exports.createUser = asyncHandler(async (req, res) => {
  const newUser = {
    id: users.length + 1,
    ...req.body,
    created_at: new Date()
  };

  users.push(newUser);

  res.status(201).formatResponse({
    success: true,
    data: newUser
  });
});

// UPDATE USER
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = users.find(u => u.id == req.params.id);

  if (!user) return next(new ErrorResponse("User not found", 404));

  Object.assign(user, req.body);

  res.formatResponse({ success: true, data: user });
});

// DELETE USER
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const index = users.findIndex(u => u.id == req.params.id);

  if (index === -1) return next(new ErrorResponse("User not found", 404));

  users.splice(index, 1);

  res.formatResponse({ success: true, message: "User deleted" });
});