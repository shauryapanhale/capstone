const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Team = sequelize.define('Team', {
  teamName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false
  },
  member1: {
    type: DataTypes.STRING,
    allowNull: false
  },
  member2: {
    type: DataTypes.STRING,
    allowNull: false
  },
  member3: {
    type: DataTypes.STRING,
    allowNull: false
  },
  member4: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mentor1: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mentor2: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mentor3: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mentor4: {
    type: DataTypes.STRING,
    allowNull: false
  },
  idea1: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  idea2: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  idea3: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

module.exports = Team;