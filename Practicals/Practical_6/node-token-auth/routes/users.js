const express = require('express');
const users = require('../data/users');

const router = express.Router();

router.get('/users', (req, res) => {
  const publicUsers = users.map(({ id, email, name }) => ({ id, email, name }));
  res.json({ users: publicUsers });
});

module.exports = router;
