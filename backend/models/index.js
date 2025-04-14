const sequelize = require('../config/database');
const Team = require('./team');

// Add any model associations here
// (none needed for now)

// Initialize and export models
const models = {
  Team,
  sequelize
};

module.exports = models;