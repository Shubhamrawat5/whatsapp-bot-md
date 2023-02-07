const pool = require("./pool");

//create createCountVideoTable table if not there
const createMilestoneTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS milestone(memberjid text PRIMARY KEY, achieved json);"
  );
};

module.exports.getMilestone = async (memberJid) => {
  try {
    let result = await pool.query(
      "SELECT m.memberJid,m.achieved,cmn.name FROM milestone m INNER JOIN countmembername cmn ON m.memberJid=cmn.memberJid WHERE m.memberJid=$1;",
      [memberJid]
    );
    if (result.rowCount) {
      console.log(result.rows);
      return result.rows;
    } else {
      return [];
    }
  } catch (err) {
    console.log(err);
    return [];
  }
};

module.exports.setMilestone = async (memberJid, achieved) => {
  console.log(achieved);
  achieved = JSON.stringify(achieved);
  console.log(achieved);

  try {
    let res = await pool.query(
      "UPDATE milestone SET achieved=$2 WHERE memberjid=$1;",
      [memberJid, achieved]
    );

    //not updated. time to insert
    if (res.rowCount === 0) {
      await pool.query("INSERT INTO milestone VALUES($1,$2);", [
        memberJid,
        achieved,
      ]);
    }
    return true;
  } catch (err) {
    console.log(err);
    await createMilestoneTable();
    return false;
  }
};
