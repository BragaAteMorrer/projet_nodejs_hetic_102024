const pool = require('../config/database');

async function createUser(username, email) {
  const query = 'INSERT INTO users (username, email, quota_used) VALUES (?, ?, ?)';
  await pool.query(query, [username, email, 0]);
}

async function getUser(userId) {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
  return rows[0];
}

module.exports = { createUser, getUser };
