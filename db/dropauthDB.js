require("dotenv").config();
const { Pool } = require("pg");
// LOAD pool CONNECTION

const proConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

const pool = new Pool(proConfig);

module.exports.dropAuth = async () => {
  await pool.query("DROP table auth;");
  pool.query("commit;");
};
