const pool = require("./pool");

//create count table if not there
const createSportTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS sportsnews(news text PRIMARY KEY);"
  );
};

module.exports.storeNewsSport = async (news) => {
  try {
    await createSportTable();
    await pool.query("INSERT INTO sportsnews VALUES($1);", [news]);

    return true;
  } catch (err) {
    // console.log(err);
    return false;
  }
};
