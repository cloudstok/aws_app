// get the client
const {createPool} =require('mysql2/promise');
require('dotenv').config()

// create the read connection to database
const readPool = createPool({
  host: process.env.DB_READ_HOST,
  user: process.env.DB_USERNAME,
  password:process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0,
  multipleStatements:true
});

// create the write connection to database
const writePool = createPool({
  host: process.env.DB_WRITE_HOST,
  user: process.env.DB_USERNAME,
  password:process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements:true
});

module.exports = {
  read:readPool,
  write:writePool

};