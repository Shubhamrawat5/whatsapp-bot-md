const pool = require("./pool");

module.exports.dropAuth = async () => {
  await pool.query("DROP table auth;");
  //await pool.query("commit;");
};
