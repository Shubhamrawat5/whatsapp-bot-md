require("dotenv").config();
const { Pool } = require("pg");

const proConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

const pool = new Pool(proConfig);

//create createCountVideoTable table if not there
const createCountVideoTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS countvideo(memberjid text , groupjid text, count integer);"
  );
};

module.exports.getCountVideo = async (groupJid) => {
  await createCountVideoTable();
  let result = await pool.query(
    "SELECT cv.memberJid,cv.count,cmn.name FROM countvideo cv INNER JOIN countmembername cmn ON cv.memberJid=cmn.memberJid WHERE groupJid=$1 ORDER BY count DESC;",
    [groupJid]
  );
  if (result.rowCount) {
    return result.rows;
  } else {
    return [];
  }
};

module.exports.setCountVideo = async (memberJid, groupJid) => {
  if (!groupJid.endsWith("@g.us")) return;
  let result;
  try {
    result = await pool.query(
      "select * from countvideo WHERE memberjid=$1 AND groupjid=$2;",
      [memberJid, groupJid]
    );
  } catch (err) {
    await createCountVideoTable();
    result = await pool.query(
      "select * from countvideo WHERE memberjid=$1 AND groupjid=$2;",
      [memberJid, groupJid]
    );
  }

  //present
  if (result.rows.length) {
    let count = result.rows[0].count;

    await pool.query(
      "UPDATE countvideo SET count = count+1 WHERE memberjid=$1 AND groupjid=$2;",
      [memberJid, groupJid]
    );
    await pool.query("commit;");
    return count + 1;
  } else {
    await pool.query("INSERT INTO countvideo VALUES($1,$2,$3);", [
      memberJid,
      groupJid,
      1,
    ]);
    await pool.query("commit;");
    return 1;
  }
};
