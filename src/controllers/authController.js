const User = require('../models/user');
const bcrypt = require('bcrypt');

// Contrôleur pour l'inscription
exports.register = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ 
      username: req.body.username, 
      password: hashedPassword 
    });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to register user' });
  }
};

// Contrôleur pour la connexion
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.body.username } });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      res.cookie('session', user.id, { httpOnly: true, path: '/', sameSite: 'strict' });
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Login error' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('session', { path: '/' });
  res.status(200).json({ message: 'Logout successful' });
};
