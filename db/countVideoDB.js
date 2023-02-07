const pool = require("./pool");

//create createCountVideoTable table if not there
const createCountVideoTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS countvideo(memberjid text , groupjid text, count integer, PRIMARY KEY (memberjid, groupjid));"
  );
};

module.exports.getCountVideo = async (groupJid) => {
  try {
    let result = await pool.query(
      "SELECT cv.memberJid,cv.count,cmn.name FROM countvideo cv LEFT JOIN countmembername cmn ON cv.memberJid=cmn.memberJid WHERE groupJid=$1 ORDER BY count DESC;",
      [groupJid]
    );
    if (result.rowCount) {
      return result.rows;
    } else {
      return [];
    }
  } catch (err) {
    console.log(err);
    return [];
  }
};

module.exports.setCountVideo = async (memberJid, groupJid) => {
  if (!groupJid.endsWith("@g.us")) return;

  try {
    let res = await pool.query(
      "UPDATE countvideo SET count = count+1 WHERE memberjid=$1 AND groupjid=$2;",
      [memberJid, groupJid]
    );

    //not updated. time to insert
    if (res.rowCount === 0) {
      await pool.query("INSERT INTO countvideo VALUES($1,$2,$3);", [
        memberJid,
        groupJid,
        1,
      ]);
    }
  } catch (err) {
    console.log(err);
    await createCountVideoTable();
  }
};

// module.exports.setCountVideo = async (memberJid, groupJid) => {
//   if (!groupJid.endsWith("@g.us")) return;
//   let result;
//   try {
//     result = await pool.query(
//       "select * from countvideo WHERE memberjid=$1 AND groupjid=$2;",
//       [memberJid, groupJid]
//     );
//   } catch (err) {
//     await createCountVideoTable();
//     result = await pool.query(
//       "select * from countvideo WHERE memberjid=$1 AND groupjid=$2;",
//       [memberJid, groupJid]
//     );
//   }

//   //present
//   if (result.rows.length) {
//     let count = result.rows[0].count;

//     await pool.query(
//       "UPDATE countvideo SET count = count+1 WHERE memberjid=$1 AND groupjid=$2;",
//       [memberJid, groupJid]
//     );
//
//     return count + 1;
//   } else {
//     await pool.query("INSERT INTO countvideo VALUES($1,$2,$3);", [
//       memberJid,
//       groupJid,
//       1,
//     ]);
//
//     return 1;
//   }
// };
