const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  usedQuota: { type: DataTypes.BIGINT, defaultValue: 0 },
  maxQuota: { type: DataTypes.BIGINT, defaultValue: 2 * 1024 * 1024 * 1024 },
}, {
  timestamps: true,
});

module.exports = User;
