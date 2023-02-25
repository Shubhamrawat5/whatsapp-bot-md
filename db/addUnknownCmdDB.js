const pool = require("./pool");

//create blacklist table if not there
// 25/02/23
const createUnknownCmdTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS unknowncmd(command text PRIMARY KEY, count integer);"
  );
};

module.exports.getUnknowCmdlist = async () => {
  await createUnknownCmdTable();
  let result = await pool.query("select * from unknowncmd order by count;");
  if (result.rowCount) {
    return result.rows;
  } else {
    return [];
  }
};

module.exports.addUnknownCmd = async (command) => {
  try {
    let res = await pool.query(
      "UPDATE unknowncmd SET count = count+1 WHERE command=$1;",
      [command]
    );

    //not updated. time to insert
    if (res.rowCount === 0) {
      await pool.query("INSERT INTO unknowncmd VALUES($1,$2);", [command, 1]);
    }
  } catch (err) {
    console.log(err);
    await createUnknownCmdTable();
  }
};
