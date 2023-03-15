const pool = require("./pool");

//create createCountVideoTable table if not there
//15/03/23
const createGroupParticipantTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS groupparticipant(memberjid text , groupjid text, action text, date timestamp);"
  );
};

// module.exports.getGroupParticipant = async (groupJid) => {
//   try {
//     let result = await pool.query(
//       "SELECT cv.memberJid,cv.count,cmn.name FROM countvideo cv LEFT JOIN countmembername cmn ON cv.memberJid=cmn.memberJid WHERE groupJid=$1 ORDER BY count DESC;",
//       [groupJid]
//     );
//     if (result.rowCount) {
//       return result.rows;
//     } else {
//       return [];
//     }
//   } catch (err) {
//     console.log(err);
//     return [];
//   }
// };

module.exports.setGroupParticipant = async (memberJid, groupJid, action) => {
  let today = new Date();
  let localeDate = today.toLocaleDateString("en-GB", {
    timeZone: "Asia/kolkata",
  });
  localeDateList = localeDate.split("/");
  let temp = localeDateList[0];
  localeDateList[0] = localeDateList[2];
  localeDateList[2] = temp;
  localeDate = localeDateList.join("/");

  let localeTime = today.toLocaleTimeString("en-GB", {
    timeZone: "Asia/kolkata",
  });

  today = localeDate + " " + localeTime;
  console.log(today);

  try {
    await pool.query("INSERT INTO groupparticipant VALUES($1,$2,$3,$4);", [
      memberJid,
      groupJid,
      action,
      today,
    ]);
  } catch (err) {
    console.log(err);
    await createGroupParticipantTable();
  }
};
