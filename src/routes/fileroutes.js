const { uploadFile, deleteFile, getFiles, generateShareLink } = require('../controllers/fileController');

function fileRoutes(req, res) {
  if (req.url === '/files/upload' && req.method === 'POST') {
    uploadFile(req, res);
  } else if (req.url.startsWith('/files/') && req.method === 'DELETE') {
    const id = req.url.split('/')[2];
    req.params = { id };
    deleteFile(req, res);
  } else if (req.url === '/files' && req.method === 'GET') {
    getFiles(req, res);
  } else if (req.url.startsWith('/files/') && req.url.endsWith('/share') && req.method === 'GET') {
    const id = req.url.split('/')[2];
    req.params = { id };
    generateShareLink(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
}

module.exports = fileRoutes;
