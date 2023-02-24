const pool = require("./pool");

//create blacklist table if not there
const createBlacklistTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS blacklist(number text PRIMARY KEY, reason text);"
  );
};

module.exports.getBlacklist = async (number) => {
  await createBlacklistTable();
  let result;
  if (number) {
    result = await pool.query("select * from blacklist where number=$1;", [
      number,
    ]);
  } else {
    result = await pool.query("select * from blacklist order by number;");
  }
  if (result.rowCount) {
    return result.rows;
  } else {
    return [];
  }
};
module.exports.addBlacklist = async (number, reason) => {
  try {
    await pool.query("INSERT INTO blacklist VALUES($1,$2);", [number, reason]);

    return true;
  } catch (err) {
    console.log(err);
    await createBlacklistTable();
    return false;
  }
};
module.exports.removeBlacklist = async (number) => {
  try {
    await pool.query("DELETE FROM blacklist WHERE number=$1;", [number]);

    return true;
  } catch (err) {
    console.log(err);
    await createBlacklistTable();
    return false;
  }
};
