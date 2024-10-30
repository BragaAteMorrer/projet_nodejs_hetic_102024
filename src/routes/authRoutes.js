const { register, login } = require('../controllers/authController');

function authRoutes(req, res) {
  if (req.url === '/auth/register' && req.method === 'POST') {
    register(req, res);
  } else if (req.url === '/auth/login' && req.method === 'POST') {
    login(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
}

module.exports = authRoutes;
