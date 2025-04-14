const { Sequelize } = require('sequelize');
const path = require('path');

// For SQLite (simpler for development)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../data/database.sqlite'),
  logging: false // Set to console.log for debugging
});

// For MySQL/PostgreSQL in production
// const sequelize = new Sequelize('capstone_db', 'username', 'password', {
//   host: 'localhost',
//   dialect: 'mysql' // or 'postgres'
// });

module.exports = sequelize;