require("dotenv").config();
const { Pool } = require("pg");

const proConfigHeroku = {
  connectionString: process.env.DATABASE_URL2,
  ssl: {
    rejectUnauthorized: false,
  },
};

const poolHeroku = new Pool(proConfigHeroku);

const proConfigElephant = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

const poolELephant = new Pool(proConfigElephant);

//NOTES:
//when stopped in between, put the index number same as the last index shown in terminal

const countmember = async () => {
  let time = 0;
  let index = 0;
  let result = await poolHeroku.query("SELECT * FROM countmember;");
  console.log("TOTAL:", result.rowCount);

  await poolELephant.query(
    "CREATE TABLE IF NOT EXISTS countmember(memberjid text , groupjid text, count integer, PRIMARY KEY (memberjid, groupjid));"
  );

  function perform(row, time, index) {
    setTimeout(async () => {
      console.log(index);
      await poolELephant.query("INSERT INTO countmember VALUES($1,$2,$3);", [
        row.memberjid,
        row.groupjid,
        row.count,
      ]);
    }, time);
  }

  result.rows.splice(index).forEach(async (row) => {
    time += 300;
    index += 1;
    perform(row, time, index);
  });
};

const countmembername = async () => {
  let time = 0;
  let index = 0;
  let result = await poolHeroku.query("SELECT * FROM countmembername;");
  console.log("TOTAL:", result.rowCount);

  await poolELephant.query(
    "CREATE TABLE IF NOT EXISTS countmembername(memberjid text PRIMARY KEY, name text);"
  );

  function perform(row, time, index) {
    setTimeout(async () => {
      console.log(index);
      await poolELephant.query("INSERT INTO countmembername VALUES($1,$2);", [
        row.memberjid,
        row.name,
      ]);
    }, time);
  }
  result.rows.forEach(async (row) => {
    time += 300;
    index += 1;
    perform(row, time, index);
  });
};

const countvideo = async () => {
  let time = 0;
  let index = 0;
  let result = await poolHeroku.query("SELECT * FROM countvideo;");
  console.log("TOTAL:", result.rowCount);

  await poolELephant.query(
    "CREATE TABLE IF NOT EXISTS countvideo(memberjid text , groupjid text, count integer, PRIMARY KEY (memberjid, groupjid));"
  );

  function perform(row, time, index) {
    setTimeout(async () => {
      console.log(index);
      await poolELephant.query("INSERT INTO countvideo VALUES($1,$2,$3);", [
        row.memberjid,
        row.groupjid,
        row.count,
      ]);
    }, time);
  }

  result.rows.forEach(async (row) => {
    time += 300;
    index += 1;
    perform(row, time, index);
  });
};

const donation = async () => {
  let time = 0;
  let index = 0;
  let result = await poolHeroku.query("SELECT * FROM donation;");
  console.log("TOTAL:", result.rowCount);

  await poolELephant.query(
    "CREATE TABLE IF NOT EXISTS donation(name text PRIMARY KEY, amount integer);"
  );

  function perform(row, time, index) {
    setTimeout(async () => {
      console.log(index);
      await poolELephant.query("INSERT INTO donation VALUES($1,$2);", [
        row.name,
        row.amount,
      ]);
    }, time);
  }

  result.rows.forEach(async (row) => {
    time += 300;
    index += 1;
    perform(row, time, index);
  });
};

const blacklist = async () => {
  let time = 0;
  let index = 0;
  let result = await poolHeroku.query("SELECT * FROM blacklist;");
  console.log("TOTAL:", result.rowCount);

  await poolELephant.query(
    "CREATE TABLE IF NOT EXISTS blacklist(number text PRIMARY KEY);"
  );

  function perform(row, time, index) {
    setTimeout(async () => {
      console.log(index);
      await poolELephant.query("INSERT INTO blacklist VALUES($1);", [
        row.number,
      ]);
    }, time);
  }

  result.rows.forEach(async (row) => {
    time += 300;
    index += 1;
    perform(row, time, index);
  });
};

const countwarning = async () => {
  let time = 0;
  let index = 0;
  let result = await poolHeroku.query("SELECT * FROM countwarning;");
  console.log("TOTAL:", result.rowCount);

  await poolELephant.query(
    "CREATE TABLE IF NOT EXISTS countwarning(memberjid text , groupjid text, count integer, PRIMARY KEY (memberjid, groupjid));"
  );

  function perform(row, time, index) {
    setTimeout(async () => {
      console.log(index);
      await poolELephant.query("INSERT INTO countwarning VALUES($1,$2,$3);", [
        row.memberjid,
        row.groupjid,
        row.count,
      ]);
    }, time);
  }

  result.rows.forEach(async (row) => {
    time += 300;
    index += 1;
    perform(row, time, index);
  });
};

const groupname = async () => {
  let time = 0;
  let index = 0;
  let result = await poolHeroku.query("SELECT * FROM groupname;");
  console.log("TOTAL:", result.rowCount);

  await poolELephant.query(
    "CREATE TABLE IF NOT EXISTS groupname(groupjid text PRIMARY KEY, gname text);"
  );

  function perform(row, time, index) {
    setTimeout(async () => {
      console.log(index);
      await poolELephant.query("INSERT INTO groupname VALUES($1,$2);", [
        row.groupjid,
        row.gname,
      ]);
    }, time);
  }

  result.rows.forEach(async (row) => {
    time += 200;
    index += 1;
    perform(row, time, index);
  });
};

const check = async () => {
  let result = await poolELephant.query("SELECT * FROM countwarning;");
  console.log(result.rowCount);

  let result2 = await poolHeroku.query("SELECT * FROM countwarning;");
  console.log(result2.rowCount);
};

countmember(); //
// countmembername(); //
// countvideo(); //
// donation(); //YES
// blacklist(); //YES
// countwarning(); //YES
// groupname(); //YES
// check();
