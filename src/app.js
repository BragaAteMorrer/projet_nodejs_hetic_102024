// app.js
const http = require('http');
const sequelize = require('./config');
const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');

// Importation des modèles pour initialiser les tables
const User = require('./models/user');
const File = require('./models/file');

const PORT = 3000;

// Fonction pour analyser le JSON uniquement pour les requêtes pertinentes
function parseJSON(req, res, callback) {
  // Vérifie si la méthode est POST, PUT ou DELETE et qu'il y a un corps de requête
  if ((req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') && req.headers['content-length'] > 0) {
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
        res.end(JSON.stringify({ error: 'YOU ARE GAY' }));
      }
    });
  } else {
    // Si la méthode ne nécessite pas de parsing JSON ou qu'il n'y a pas de corps, passe directement au callback
    callback();
  }
}

// Gestionnaire de routes
function router(req, res) {
  if (req.url === '/') {
    // Route d'accueil
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Accueil du Serveur de Fichiers</title>
      </head>
      <body>
        <h1>Bienvenue sur le serveur de fichiers</h1>
        <p>Utilisez les endpoints <code>/auth</code> et <code>/files</code> pour interagir avec l'API.</p>
      </body>
      </html>
    `);
  } else if (req.url.startsWith('/auth')) {
    return authRoutes(req, res);
  } else if (req.url.startsWith('/files')) {
    return fileRoutes(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'TROUVE PAS PD' }));
  }
}

// Crée le serveur HTTP
const server = http.createServer((req, res) => {
  parseJSON(req, res, () => {
    router(req, res);
  });
});

// Synchronise la base de données et lance le serveur
sequelize.sync({ force: true }) // Utilisez force: true pour réinitialiser la base de données à chaque lancement
  .then(() => {
    server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => console.error('Database connection failed:', err));
