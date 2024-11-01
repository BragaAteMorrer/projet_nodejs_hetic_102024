const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register); // Route pour l'inscription
router.post('/login', login);       // Route pour la connexion
router.post('/logout', logout);     // Route pour la déconnexion

// Nouvelle route pour vérifier si l'utilisateur est authentifié
router.get('/check', (req, res) => {
  if (req.cookies && req.cookies.session) {
    res.sendStatus(200); // Utilisateur authentifié
  } else {
    res.sendStatus(401); // Utilisateur non authentifié
  }
});

module.exports = router;
