require("dotenv").config();
const { Pool } = require("pg");

const proConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

const pool = new Pool(proConfig);

//create groupname table if not there
const createGroupNameTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS groupname(groupjid text PRIMARY KEY, gname text);"
  );
};

// module.exports.getCountGroup = async () => {
//   await createGroupNameTable();
//   let result = await pool.query("SELECT * FROM groupname;");
//   if (result.rowCount) {
//     return result.rows;
//   } else {
//     return [];
//   }
// };

module.exports.setGroupName = async (groupJid, gname) => {
  if (!groupJid.endsWith("@g.us")) return;
  await createGroupNameTable();

  //check if groupjid is present in DB or not
  let result = await pool.query("select * from groupname where groupjid=$1;", [
    groupJid,
  ]);

  //present
  if (result.rows.length) {
    let count = result.rows[0].count;

    await pool.query("UPDATE groupname SET gname = $1 WHERE groupjid=$2;", [
      gname,
      groupJid,
    ]);
    await pool.query("commit;");
  } else {
    await pool.query("INSERT INTO groupname VALUES($1,$2);", [groupJid, gname]);
    await pool.query("commit;");
  }
};
