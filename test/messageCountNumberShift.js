const pool = require("../db/pool");
const oldNum = "91904577@s.whatsapp.net";
const newNum = "91706073@s.whatsapp.net";
const setCountMember = async (memberJid, groupJid, count) => {
  try {
    console.log(memberJid, groupJid, count);
    let res1 = await pool.query(
      "UPDATE countmember SET count = count+$3 WHERE memberjid=$1 AND groupjid=$2;",
      [memberJid, groupJid, count]
    );

    //not updated. time to insert
    if (res1.affectedRows) {
      await pool.query(
        "UPDATE countmember SET count = $3 WHERE memberjid=$1 AND groupjid=$2;",
        [memberJid, groupJid, count]
      );
    }
  } catch (err) {
    console.log(err);
  }
};

//count: user all group (with group wise) message count
const getCountIndividualAllGroupWithName = async (memberJid) => {
  let result = await pool.query(
    "SELECT cm.memberjid,gn.groupjid,cm.count FROM countmember cm INNER JOIN groupname gn ON gn.groupJid=cm.groupJid WHERE cm.memberJid=$1 ORDER BY count DESC;",
    [memberJid]
  );
  console.log(result.rows);
  if (result.rowCount) {
    console.log(result.rows);
    let time = 0;

    result.rows.forEach((res) => {
      time += 500;
      setTimeout(() => {
        setCountMember(newNum, res.groupjid, res.count);
        // console.log(res.memberjid, res.groupjid, res.count);
      }, time);
    });
  } else {
    return [];
  }
};

getCountIndividualAllGroupWithName(oldNum);
