const { uploadFile, getUserFiles } = require('../models/File');
const { getUser } = require('../models/User');

async function upload(req, res) {
  const userId = req.user.id;
  const { fileName, fileSize } = req.body;

  const user = await getUser(userId);
  if (user.quota_used + fileSize > 2 * 1024 * 1024 * 1024) {
    return res.status(400).send("Quota exceeded");
  }

  await uploadFile(userId, fileName, fileSize);
  res.status(201).send("File uploaded successfully");
}

async function getFiles(req, res) {
  const userId = req.user.id;
  const files = await getUserFiles(userId);
  res.status(200).json(files);
}

module.exports = { upload, getFiles };
