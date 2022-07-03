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
const createStudyTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS studynews(news text PRIMARY KEY);"
  );
};

module.exports.storeNewsStudy = async (news) => {
  try {
    await createStudyTable();
    await pool.query("INSERT INTO studynews VALUES($1);", [news]);
    await pool.query("commit;");
    return true;
  } catch (err) {
    // console.log(err);
    return false;
  }
};
