const { DataTypes } = require('sequelize');
const sequelize = require('../config');
const User = require('./user');

const File = sequelize.define('File', {
  filename: { type: DataTypes.STRING, allowNull: false },
  path: { type: DataTypes.STRING, allowNull: false },
  size: { type: DataTypes.BIGINT, allowNull: false },
  expirationDate: { type: DataTypes.DATE },  // Pour les liens temporaires
}, {
  timestamps: true,
});

File.belongsTo(User, { foreignKey: 'userId' });

module.exports = File;
