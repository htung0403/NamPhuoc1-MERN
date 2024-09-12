const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.MYSQL_DB, process.env.MYSQL_USER, 'gianchun12@', {
  host: process.env.MYSQL_HOST,
  // port: process.env.MYSQL_PORT,
  dialect:'mysql',
});

module.exports = sequelize;