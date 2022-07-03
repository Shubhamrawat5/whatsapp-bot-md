require("dotenv").config();
const { Pool } = require("pg");

const proConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

const pool = new Pool(proConfig);

//create count table if not there
const createMovieTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS moviesnews(news text PRIMARY KEY);"
  );
};

module.exports.storeNewsMovie = async (news) => {
  try {
    await createMovieTable();
    await pool.query("INSERT INTO moviesnews VALUES($1);", [news]);
    await pool.query("commit;");
    return true;
  } catch (err) {
    // console.log(err);
    return false;
  }
};
