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
    const res = await pool.query("INSERT INTO blacklist VALUES($1,$2);", [
      number,
      reason,
    ]);

    if (res.rowCount === 0) return false;
    else return "✔️ Added to blacklist!";
  } catch (err) {
    if (err.code == 23505) {
      return "Number already blacklisted!";
    }

    await createBlacklistTable();
    return err.toString();
  }
};

module.exports.removeBlacklist = async (number) => {
  try {
    const res = await pool.query("DELETE FROM blacklist WHERE number=$1;", [
      number,
    ]);

    if (res.rowCount === 0) return false;
    else return "✔️ Removed from blacklist!";
  } catch (err) {
    console.log(err);
    await createBlacklistTable();
    return err.toString();
  }
};
