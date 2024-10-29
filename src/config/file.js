const pool = require('../config/database');

async function uploadFile(userId, fileName, fileSize) {
  const query = 'INSERT INTO files (user_id, name, size) VALUES (?, ?, ?)';
  await pool.query(query, [userId, fileName, fileSize]);
}

async function getUserFiles(userId) {
  const [rows] = await pool.query('SELECT * FROM files WHERE user_id = ?', [userId]);
  return rows;
}

module.exports = { uploadFile, getUserFiles };
