const File = require('../models/file');
const User = require('../models/user');
const path = require('path');
const fs = require('fs');
const generateTemporaryLink = require('../utilis/generatelink');

// Gestion de l'upload de fichiers avec quota
exports.uploadFile = async (req, res) => {
  try {
    const user = await User.findByPk(req.body.userId);
    const fileSize = parseInt(req.headers['content-length']);

    if (user.usedQuota + fileSize > user.maxQuota) {
      return res.writeHead(400, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'Quota exceeded' }));
    }

    const filePath = path.join(__dirname, '../uploads', req.body.filename);
    fs.writeFileSync(filePath, req.body.fileData);  // Écrire le fichier

    const file = await File.create({ filename: req.body.filename, path: filePath, size: fileSize, userId: user.id });
    user.usedQuota += fileSize;
    await user.save();

    res.writeHead(201, { 'Content-Type': 'application/json' }).end(JSON.stringify({ message: 'File uploaded', file }));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'File upload failed' }));
  }
};

// Suppression de fichier
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (file) {
      fs.unlinkSync(file.path);
      await file.destroy();

      const user = await User.findByPk(file.userId);
      user.usedQuota -= file.size;
      await user.save();

      res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ message: 'File deleted' }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'File not found' }));
    }
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'Failed to delete file' }));
  }
};

// Récupération des fichiers de l'utilisateur
exports.getFiles = async (req, res) => {
  try {
    const files = await File.findAll({ where: { userId: req.body.userId } });
    res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(files));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'Failed to retrieve files' }));
  }
};

// Génération de lien de partage temporaire
exports.generateShareLink = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file) {
      return res.writeHead(404, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'File not found' }));
    }

    const { token, expiration } = generateTemporaryLink(file.id);
    file.expirationDate = new Date(expiration);
    await file.save();

    res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ link: `/files/${file.id}/download?token=${token}` }));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'Failed to generate share link' }));
  }
};