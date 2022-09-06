require("dotenv").config();
const { Pool } = require("pg");

const proConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

const pool = new Pool(proConfig);

const createDisableCommandTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS disablecommand(chat_id text PRIMARY KEY, disabled json);"
  );
};

module.exports.getDisableCommandData = async (chat_id) => {
  await createDisableCommandTable();

  //check if today date is present in DB or not
  let result = await pool.query(
    "select * from disablecommand where chat_id=$1;",
    [chat_id]
  );
  if (result.rowCount) {
    return result.rows[0];
  } else {
    return {};
  }
};

const updateDisableCommandData = async (chat_id, diabled) => {
  await pool.query("UPDATE disablecommand SET diabled=$1 WHERE chat_id=$2;", [
    diabled,
    chat_id,
  ]);
  await pool.query("commit;");
};

module.exports.setDisableCommandData = async (chat_id, diabled) => {
  await createDisableCommandTable();

  diabled = JSON.stringify(diabled);
  let result = await pool.query(
    "SELECT * FROM disablecommand WHERE chat_id=$1",
    [chat_id]
  );
  if (result.rows.length) {
    //already present
    await updateDisableCommandData(chat_id, diabled);
    return;
  }

  //insert new
  await pool.query("INSERT INTO disablecommand VALUES($1,$2);", [
    chat_id,
    diabled,
  ]);
  await pool.query("commit;");
};
