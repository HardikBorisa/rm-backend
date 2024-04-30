const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'aayush',
  database: 'restro'
});

module.exports = db;