const dataStore = require('../models');

const getAllUsers = (req, res) => {
  res.json(dataStore.users);
};

const getUserById = (req, res) => {
  const user = dataStore.users.find(u => u.id == req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
};

const createUser = (req, res) => {
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

const updateUser = (req, res) => {
  const user = dataStore.users.find(u => u.id == req.params.id);
  Object.assign(user, req.body);
  res.json(user);
};

const deleteUser = (req, res) => {
  dataStore.users = dataStore.users.filter(u => u.id != req.params.id);
  res.json({ message: 'Deleted' });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};