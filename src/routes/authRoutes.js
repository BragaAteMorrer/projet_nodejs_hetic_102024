const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.get('/check', (req, res) => {
  if (req.cookies && req.cookies.session) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
