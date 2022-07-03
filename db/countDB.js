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
const createCountTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS count(day DATE PRIMARY KEY, times integer);"
  );
};

module.exports.getcount = async () => {
  await createCountTable();
  let result = await pool.query(
    "SELECT to_char(day, 'DD/MM/YYYY'),day,times FROM count ORDER BY(day) DESC;"
  );
  if (result.rowCount) {
    return result.rows;
  } else {
    return [];
  }
};

module.exports.countToday = async () => {
  let todayDate = new Date().toLocaleDateString("en-GB", {
    timeZone: "Asia/kolkata",
  });
  let li = todayDate.split("/");
  let temp = li[0];
  li[0] = li[2];
  li[2] = temp;
  todayDate = li.join("/");

  await createCountTable();

  //check if today date is present in DB or not
  let result = await pool.query("select * from count where day=$1;", [
    todayDate,
  ]);

  //present
  if (result.rows.length) {
    let times = result.rows[0].times;

    await pool.query("UPDATE count SET times = times+1 WHERE day=$1;", [
      todayDate,
    ]);
    await pool.query("commit;");
    return times + 1;
  } else {
    await pool.query("INSERT INTO count VALUES($1,$2);", [todayDate, 1]);
    await pool.query("commit;");
    return 1;
  }
};
