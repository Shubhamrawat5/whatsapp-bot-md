require('dotenv').config()
const { Pool } = require("pg");
// LOAD pool CONNECTION

const proConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

const pool = new Pool(proConfig);

let auth_row_count;
let auth_obj;

const fetchauth = async () => {
  try {
    let auth_result = await pool.query("select * from auth;"); //if auth table is not there, error will be throw
    console.log("Fetching login data...");
    auth_row_count = await auth_result.rowCount;
    //if auth table is there but no row is there
    if (auth_row_count == 0) {
      console.log("No login data found!");
    } else {
      console.log("Login data found!");
      auth_obj = {
        clientID: auth_result.rows[0].clientid,
        serverToken: auth_result.rows[0].servertoken,
        clientToken: auth_result.rows[0].clienttoken,
        encKey: auth_result.rows[0].enckey,
        macKey: auth_result.rows[0].mackey,
      };
    }
  } catch {
    console.log("Creating database AUTH...");
    await pool.query(
      "CREATE TABLE auth(clientID text, serverToken text, clientToken text, encKey text, macKey text);"
    );
    await fetchauth();
  }
};

module.exports.connectToWA = async (WAConnection) => {
  // LOADING SESSION
  const conn = new WAConnection();
  // conn.version = [3, 3234, 9];
  conn.logger.level = "warn";
  conn.on("qr", () => {
    console.log("SCAN THE ABOVE QR CODE TO LOGIN!");
  });
  await fetchauth(); //GET LOGIN DATA
  if (auth_row_count == 1) {
    conn.loadAuthInfo(auth_obj);
  }
  conn.on("connecting", () => {
    console.log("Connecting...");
  });
  conn.on("open", () => {
    console.clear();
    console.log("Connected!");
  });
  await conn.connect({ timeoutMs: 30 * 1000 });
  const authInfo = conn.base64EncodedAuthInfo(); // UPDATED LOGIN DATA
  load_clientID = authInfo.clientID;
  load_serverToken = authInfo.serverToken;
  load_clientToken = authInfo.clientToken;
  load_encKey = authInfo.encKey;
  load_macKey = authInfo.macKey;
  // INSERT / UPDATE LOGIN DATA
  if (auth_row_count == 0) {
    console.log("Inserting login data...");
    pool.query("INSERT INTO auth VALUES($1,$2,$3,$4,$5);", [
      load_clientID,
      load_serverToken,
      load_clientToken,
      load_encKey,
      load_macKey,
    ]);
    pool.query("commit;");
    console.log("New login data inserted!");
  } else {
    console.log("Updating login data....");
    pool.query(
      "UPDATE auth SET clientid = $1, servertoken = $2, clienttoken = $3, enckey = $4, mackey = $5;",
      [
        load_clientID,
        load_serverToken,
        load_clientToken,
        load_encKey,
        load_macKey,
      ]
    );
    pool.query("commit;");
    console.log("Login data updated!");
  }

  return conn;
};
