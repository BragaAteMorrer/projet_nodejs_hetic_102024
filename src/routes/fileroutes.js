const express = require('express');
const { upload, getFiles } = require('../controllers/filecontroller');
const router = express.Router();

router.post('/upload', upload);
router.get('/', getFiles);

module.exports = router;
