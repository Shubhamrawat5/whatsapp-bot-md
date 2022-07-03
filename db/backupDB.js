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
const createGroupbackupTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS groupbackup(date text PRIMARY KEY, group_name text, group_desc text, members_count integer, data json);"
  );
};

module.exports.takeGroupbackup = async (groupName, groupDesc, groupData) => {
  try {
    await createGroupbackupTable();

    let date = new Date().toLocaleString("en-GB", { timeZone: "Asia/kolkata" });
    let membersCount = groupData.length;
    groupData = JSON.stringify(groupData);

    //insert new
    await pool.query("INSERT INTO groupbackup VALUES($1,$2,$3,$4,$5);", [
      date,
      groupName,
      groupDesc,
      membersCount,
      groupData,
    ]);
    await pool.query("commit;");
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
