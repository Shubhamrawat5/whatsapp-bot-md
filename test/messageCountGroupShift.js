const pool = require("../db/pool");
const pvxsticker1 = "919557666582-1580308963@g.us";
const pvxsticker2 = "919557666582-1621700558@g.us";
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

//pvxm: current group member stats
const getCountGroupMembers = async (groupJid) => {
  let result = await pool.query(
    "SELECT cm.memberJid,cm.count,cmn.name FROM countmember cm INNER JOIN countmembername cmn ON cm.memberJid=cmn.memberJid WHERE groupJid=$1 ORDER BY count DESC;",
    [groupJid]
  );
  if (result.rowCount) {
    console.log(result.rows);
    let time = 0;

    result.rows.forEach((mem) => {
      time += 500;
      setTimeout(() => {
        setCountMember(mem.memberjid, pvxsticker1, mem.count);
        // console.log(mem.memberjid, pvxsticker1, mem.count);
      }, time);
    });
  } else {
    return [];
  }
};
getCountGroupMembers(pvxsticker2);
