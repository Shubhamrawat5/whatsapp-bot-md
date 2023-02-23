const pool = require("./pool");

//create group links table if not there
const createGroupLinksEnabledTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS grouplinksenabled(enabled integer PRIMARY KEY);"
  );
};

module.exports.setGroupLinkEnabled = async (enabled) => {
  try {
    let res = await pool.query("UPDATE grouplinksenabled SET enabled = $1;", [
      enabled,
    ]);
    //not updated. time to insert
    if (res.rowCount === 0) {
      await pool.query("INSERT INTO grouplinksenabled VALUES($1);", [enabled]);
    }
    return true;
  } catch (err) {
    console.log(err);
    await createGroupLinksEnabledTable();
    return false;
  }
};

//create group links table if not there
const createGroupLinksTable = async () => {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS grouplinks(groupjid text PRIMARY KEY, link text);"
  );
};

module.exports.setGroupLink = async (groupJid, link) => {
  try {
    let res = await pool.query(
      "UPDATE grouplinks SET link = $1 WHERE groupjid=$2;",
      [link, groupJid]
    );
    //not updated. time to insert
    if (res.rowCount === 0) {
      await pool.query("INSERT INTO grouplinks VALUES($1,$2);", [
        groupJid,
        link,
      ]);
    }
    return true;
  } catch (err) {
    console.log(err);
    await createGroupLinksTable();
    return false;
  }
};

module.exports.getGroupLink = async () => {
  try {
    let res = await pool.query(
      "SELECT gl.groupjid,gl.link,gn.gname FROM grouplinks gl LEFT JOIN groupname gn ON gl.groupjid=gn.groupjid;"
    );
    //not updated. time to insert
    if (res.rowCount) {
      return res.rows;
    } else {
      return [];
    }
  } catch (err) {
    console.log(err);
    await createGroupLinksTable();
  }
};
