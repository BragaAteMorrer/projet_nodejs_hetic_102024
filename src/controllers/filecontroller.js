const fs = require('fs');
const path = require('path');
const multer = require('multer');
const File = require('../models/file');
const User = require('../models/user');
const generateTemporaryLink = require('../utilis/generatelink');

const MAX_SIZE = 100 * 1024 * 1024;
const uploadsDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `upload_${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_SIZE }
});

exports.uploadFile = upload.single('file');

exports.saveFile = async (req, res) => {
  const userId = 1;

  try {
    const filePath = req.file.path;
    const fileSize = req.file.size;
    const filename = req.file.filename;

    const user = await User.findByPk(userId);

    if (!user) return res.status(400).json({ error: 'Utilisateur invalide' });
    if (user.usedQuota + fileSize > user.maxQuota) return res.status(400).json({ error: 'Quota dépassé' });

    const expiration = new Date(Date.now() + 3600 * 1000);
    const file = await File.create({
      filename,
      path: filePath,
      size: fileSize,
      userId: 1,
      expirationDate: expiration
    });

    user.usedQuota += fileSize;
    await user.save();

    const { token } = generateTemporaryLink(file.id);
    res.status(201).json({
      message: 'Fichier uploadé',
      link: `/files/${file.id}/download?token=${token}`,
      expires: expiration
    });
  } catch (error) {
    res.status(500).json({ error: 'Échec de l\'upload du fichier' });
  }
};

exports.downloadFile = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);

    if (!file) {
      return res.status(404).json({ error: 'Fichier non trouvé dans la base de données' });
    }

    const filePath = file.path;

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Fichier non trouvé sur le serveur' });
    }

    res.download(filePath, file.filename, (err) => {
      if (err) {
        console.error('Erreur lors du téléchargement du fichier :', err);
        res.status(500).json({ error: 'Échec du téléchargement du fichier' });
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du fichier :', error);
    res.status(500).json({ error: 'Une erreur est survenue lors du téléchargement du fichier' });
  }
};

exports.getUserFiles = async (req, res) => {
  const userId = req.cookies.session;

  if (!userId) {
    return res.status(401).json({ error: 'Utilisateur non authentifié' });
  }

  try {
    const files = await File.findAll({
      where: { userId },
      attributes: ['id', 'filename', 'expirationDate']
    });

    const fileLinks = files.map(file => ({
      id: file.id,
      filename: file.filename,
      link: `/files/${file.id}/download`,
      expires: file.expirationDate
    }));

    res.status(200).json(fileLinks);
  } catch (error) {
    console.error('Erreur lors de la récupération des fichiers:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des fichiers' });
  }
};