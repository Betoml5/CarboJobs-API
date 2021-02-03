const mysql = require("mysql");
const { config } = require("../config");

const connection = mysql.createConnection({
  host: config.dbHost,
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
});

connection.connect();

module.exports = connection;