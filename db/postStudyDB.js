const pool = require("./pool");

//create count table if not there
const createStudyTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS studynews(news text PRIMARY KEY);"
  );
};

module.exports.storeNewsStudy = async (news) => {
  try {
    await createStudyTable();
    await pool.query("INSERT INTO studynews VALUES($1);", [news]);

    return true;
  } catch (err) {
    // console.log(err);
    return false;
  }
};
