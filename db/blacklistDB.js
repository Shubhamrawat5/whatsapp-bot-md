require("dotenv").config();
const { Pool } = require("pg");

const proConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

const pool = new Pool(proConfig);

//create blacklist table if not there
const createBlacklistTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS blacklist(number text PRIMARY KEY);"
  );
};

module.exports.getBlacklist = async () => {
  await createBlacklistTable();
  let result = await pool.query("select * from blacklist;");
  if (result.rowCount) {
    return result.rows;
  } else {
    return [];
  }
};
module.exports.addBlacklist = async (number) => {
  try {
    await createBlacklistTable();

    await pool.query("INSERT INTO blacklist VALUES($1);", [number]);
    await pool.query("commit;");
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
module.exports.removeBlacklist = async (number) => {
  try {
    await createBlacklistTable();

    await pool.query("DELETE FROM blacklist WHERE number=$1;", [number]);
    await pool.query("commit;");
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
