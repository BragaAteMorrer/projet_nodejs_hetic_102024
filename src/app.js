const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const sequelize = require('./config');
const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');

const app = express();
const PORT = 3000;

// Middleware pour parser le JSON et les cookies
app.use(express.json());
app.use(cookieParser());

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../public')));

function checkAuth(req) {
  console.log("Cookies reçus:", req.cookies); // Pour vérifier les cookies
  return req.cookies && req.cookies.session;
}


// Middleware pour vérifier si l'utilisateur est authentifié
function requireAuth(req, res, next) {
  if (checkAuth(req)) {
    next(); // Si l'utilisateur est authentifié, passer à la route suivante
  } else {
    res.redirect('/login.html'); // Rediriger vers la page de connexion si non authentifié
  }
}

// Route pour la page d'accueil avec vérification d'authentification
app.get('/accueil.html', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'accueil.html'));
});

// Intégration des routes d'authentification et de fichiers avec Express
app.use('/auth', authRoutes);
app.use('/files', fileRoutes);

// Serveur de fichiers statiques si la requête correspond à un fichier HTML ou CSS
function serveStaticFile(filePath, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 Not Found</h1>');
    } else {
      res.writeHead(200, { 'Content-Type': path.extname(filePath) === '.css' ? 'text/css' : 'text/html' });
      res.end(data);
    }
  });
}

// Fonction router pour gérer les autres routes avec le serveur HTTP existant
function router(req, res) {
  if (req.url === '/' || req.url === '/login.html') {
    serveStaticFile(path.join(__dirname, '../public', 'login.html'), res);
  } else if (req.url === '/register.html') {
    serveStaticFile(path.join(__dirname, '../public', 'register.html'), res);
  } else if (req.url === '/styles.css') {
    serveStaticFile(path.join(__dirname, '../public', 'styles.css'), res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
}

// Création du serveur HTTP
const server = http.createServer((req, res) => {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        req.body = JSON.parse(body);
        router(req, res);
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else {
    router(req, res);
  }
});

// Démarrage du serveur Express et synchronisation avec la base de données
sequelize.sync({ force: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Express server running on http://localhost:${PORT}`));
    server.listen(PORT + 1, () => console.log(`HTTP server running on http://localhost:${PORT + 1}`));
  })
  .catch(err => console.error('Database connection failed:', err));
