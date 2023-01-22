const pool = require("./pool");

//create count table if not there
const createTechTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS technews(news text PRIMARY KEY);"
  );
};

module.exports.storeNewsTech = async (news) => {
  try {
    await createTechTable();
    await pool.query("INSERT INTO technews VALUES($1);", [news]);

    return true;
  } catch (err) {
    // console.log(err);
    return false;
  }
};
