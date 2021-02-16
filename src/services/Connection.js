const mysql = require("mysql");
const { config } = require("../config");

const isDev = config.dev;


const connection = mysql.createConnection({
  host: config.dbHost,
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
});

connection.connect((err) => {
  if (err) {
    console.log(err)
  }

   isDev && console.log(`Connected with DB ${connection.threadId}`)
})

module.exports = connection;