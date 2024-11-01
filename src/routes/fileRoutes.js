const express = require('express');
const { uploadFile, saveFile, downloadFile, getUserFiles } = require('../controllers/fileController');

const router = express.Router();

router.post('/upload', uploadFile, saveFile);
router.get('/:id/download', downloadFile);
router.get('/', getUserFiles);

module.exports = router;
