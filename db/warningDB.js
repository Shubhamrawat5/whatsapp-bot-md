const pool = require("./pool");

//create createCountWarningTable table if not there
const createCountWarningTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS countwarning(memberjid text , groupjid text, count integer, PRIMARY KEY (memberjid, groupjid), check(count BETWEEN 1 and 3));"
  );
};

module.exports.getCountWarning = async (memberjid, groupJid) => {
  await createCountWarningTable();
  let result = await pool.query(
    "SELECT count FROM countwarning WHERE memberjid=$1 AND groupJid=$2;",
    [memberjid, groupJid]
  );
  if (result.rowCount) {
    return result.rows[0].count;
  } else {
    return 0;
  }
};

module.exports.getCountWarningAllGroup = async () => {
  await createCountWarningTable();
  let result = await pool.query(
    "SELECT cw.memberjid,sum(cw.count) as count,cmn.name FROM countwarning cw INNER JOIN countmembername cmn ON cw.memberjid=cmn.memberjid group by cw.memberjid,cmn.name ORDER BY count DESC;"
  );
  if (result.rowCount) {
    return result.rows;
  } else {
    return [];
  }
};

module.exports.getCountWarningAll = async (groupJid) => {
  await createCountWarningTable();
  let result = await pool.query(
    "SELECT cw.memberjid,cw.count,cmn.name FROM countwarning cw INNER JOIN countmembername cmn ON cw.memberjid=cmn.memberjid WHERE groupjid=$1 ORDER BY count DESC;",
    [groupJid]
  );
  if (result.rowCount) {
    return result.rows;
  } else {
    return [];
  }
};

module.exports.setCountWarning = async (memberJid, groupJid) => {
  if (!groupJid.endsWith("@g.us")) return;
  await createCountWarningTable();

  //check if groupjid is present in DB or not
  let result = await pool.query(
    "select * from countwarning WHERE memberjid=$1 AND groupjid=$2;",
    [memberJid, groupJid]
  );

  //present
  if (result.rows.length) {
    let count = result.rows[0].count;

    await pool.query(
      "UPDATE countwarning SET count = count+1 WHERE memberjid=$1 AND groupjid=$2;",
      [memberJid, groupJid]
    );

    return count + 1;
  } else {
    await pool.query("INSERT INTO countwarning VALUES($1,$2,$3);", [
      memberJid,
      groupJid,
      1,
    ]);

    return 1;
  }
};

module.exports.reduceCountWarning = async (memberJid, groupJid) => {
  if (!groupJid.endsWith("@g.us")) return;
  await createCountWarningTable();

  //check if groupjid is present in DB or not
  let result = await pool.query(
    "select * from countwarning WHERE memberjid=$1 AND groupjid=$2;",
    [memberJid, groupJid]
  );

  //present
  if (result.rows.length) {
    let count = result.rows[0].count;

    await pool.query(
      "UPDATE countwarning SET count = count-1 WHERE memberjid=$1 AND groupjid=$2;",
      [memberJid, groupJid]
    );
    return count - 1;
  } else {
    await pool.query("INSERT INTO countwarning VALUES($1,$2,$3);", [
      memberJid,
      groupJid,
      1,
    ]);
    return 1;
  }
};

module.exports.clearCountWarning = async (memberJid, groupJid) => {
  if (!groupJid.endsWith("@g.us")) return;
  await createCountWarningTable();

  //check if groupjid is present in DB or not
  let result = await pool.query(
    "select * from countwarning WHERE memberjid=$1 AND groupjid=$2;",
    [memberJid, groupJid]
  );

  //present
  if (result.rows.length) {
    let count = result.rows[0].count;

    await pool.query(
      "delete from countwarning WHERE memberjid=$1 AND groupjid=$2;",
      [memberJid, groupJid]
    );
    return 1;
  } else {
    return 0;
  }
};
