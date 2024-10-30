const http = require('http');
const sequelize = require('./config');
const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');

const PORT = 3000;

// Fonction pour analyser le JSON
function parseJSON(req, res, callback) {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });
  req.on('end', () => {
    try {
      req.body = JSON.parse(body);
      callback();
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
  });
}

// Gestionnaire de routes
function router(req, res) {
  if (req.url.startsWith('/auth')) {
    return authRoutes(req, res);
  } else if (req.url.startsWith('/files')) {
    return fileRoutes(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
}

// Crée le serveur HTTP
const server = http.createServer((req, res) => {
  if (req.method === 'POST' || req.method === 'DELETE' || req.method === 'GET') {
    parseJSON(req, res, () => {
      router(req, res);
    });
  } else {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
  }
});

// Synchronise la base de données et lance le serveur
sequelize.sync().then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error('Database connection failed:', err));
