const dataStore = require("../models");

// Get all users
exports.getAllUsers = (req, res) => {
  res.json(dataStore.users);
};

// Get user by ID
exports.getUserById = (req, res) => {
  const user = dataStore.users.find(u => u.id == req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// Create user
exports.createUser = (req, res) => {
  const newUser = {
    id: dataStore.nextIds.users++,
    ...req.body,
    followers: [],
    following: [],
    createdAt: new Date().toISOString()
  };

  dataStore.users.push(newUser);
  res.status(201).json(newUser);
};

// Delete user
exports.deleteUser = (req, res) => {
  const index = dataStore.users.findIndex(u => u.id == req.params.id);
  if (index === -1) return res.status(404).json({ message: "User not found" });

  dataStore.users.splice(index, 1);
  res.json({ message: "User deleted" });
};

// Get user videos
exports.getUserVideos = (req, res) => {
  const userVideos = dataStore.videos.filter(
    v => v.userId == req.params.id
  );
  res.json(userVideos);
};