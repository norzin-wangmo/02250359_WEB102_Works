const dataStore = require('../models');

// GET all users
const getAllUsers = (req, res) => {
  res.status(200).json(dataStore.users);
};

// GET user by ID
const getUserById = (req, res) => {
  const userId = parseInt(req.params.id);
  const user = dataStore.users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.status(200).json(user);
};

// POST create a new user
const createUser = (req, res) => {
  const { username, email, name } = req.body;

  if (!username || !email) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  const usernameExists = dataStore.users.some(user => user.username === username);
  const emailExists = dataStore.users.some(user => user.email === email);

  if (usernameExists) {
    return res.status(409).json({ error: 'Username already taken' });
  }

  if (emailExists) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const newUser = {
    id: dataStore.nextIds.users++,
    username,
    email,
    name: name || username,
    followers: [],
    following: [],
    createdAt: new Date().toISOString()
  };

  dataStore.users.push(newUser);

  res.status(201).json(newUser);
};

// PUT update a user
const updateUser = (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = dataStore.users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { name, email } = req.body;
  const user = dataStore.users[userIndex];

  if (name !== undefined) user.name = name;

  if (email !== undefined) {
    const emailExists = dataStore.users.some(
      u => u.email === email && u.id !== userId
    );

    if (emailExists) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    user.email = email;
  }

  user.updatedAt = new Date().toISOString();

  res.status(200).json(user);
};

// DELETE user
const deleteUser = (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = dataStore.users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  dataStore.users.splice(userIndex, 1);

  // Remove user's videos and comments
  dataStore.videos = dataStore.videos.filter(video => video.userId !== userId);
  dataStore.comments = dataStore.comments.filter(comment => comment.userId !== userId);

  res.status(204).end();