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
const createTechTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS technews(news text PRIMARY KEY);"
  );
};

module.exports.storeNewsTech = async (news) => {
  try {
    await createTechTable();
    await pool.query("INSERT INTO technews VALUES($1);", [news]);
    await pool.query("commit;");
    return true;
  } catch (err) {
    // console.log(err);
    return false;
  }
};
