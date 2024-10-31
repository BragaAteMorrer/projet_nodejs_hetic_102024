const http = require('http');
const fs = require('fs');
const path = require('path');
const sequelize = require('./config');
const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');

const User = require('./models/user');
const File = require('./models/file');

const PORT = 3000;

function parseJSON(req, res, callback) {
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
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else {
    callback();
  }
}

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

function router(req, res) {
  if (req.url === '/' || req.url === '/login.html') {
    serveStaticFile(path.join(__dirname, '../public', 'login.html'), res);
  } else if (req.url === '/register.html') {
    serveStaticFile(path.join(__dirname, '../public', 'register.html'), res);
  } else if (req.url === '/styles.css') {
    serveStaticFile(path.join(__dirname, '../public', 'styles.css'), res);
  } else if (req.url.startsWith('/auth')) {
    return authRoutes(req, res);
  } else if (req.url.startsWith('/files')) {
    return fileRoutes(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
}

const server = http.createServer((req, res) => {
  parseJSON(req, res, () => {
    router(req, res);
  });
});

sequelize.sync({ force: true })
  .then(() => {
    server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => console.error('Database connection failed:', err));