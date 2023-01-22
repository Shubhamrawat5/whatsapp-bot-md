const pool = require("./pool");

//create count table if not there
const createMovieTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS moviesnews(news text PRIMARY KEY);"
  );
};

module.exports.storeNewsMovie = async (news) => {
  try {
    await createMovieTable();
    await pool.query("INSERT INTO moviesnews VALUES($1);", [news]);

    return true;
  } catch (err) {
    // console.log(err);
    return false;
  }
};
