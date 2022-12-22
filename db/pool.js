require("dotenv").config();
const { Pool } = require("pg");

const proConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 4, //max connection limit
};

const pool = new Pool(proConfig);
module.exports = pool;
