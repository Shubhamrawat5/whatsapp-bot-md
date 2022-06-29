// require("dotenv").config();

// const { MongoClient, ServerApiVersion } = require("mongodb");

// const uri = process.env.uri;

// const mdClient = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverApi: ServerApiVersion.v1,
// });
// mdClient.connect();

// let collection2 = mdClient.db("bot").collection("auth");

// let x = collection2.deleteOne({ _id: 1 });

// console.log(x);
// x.then((res) => {
//   console.log(res);
//   process.exit(1);
// });

require("dotenv").config();
const { Pool } = require("pg");

const proConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

const pool = new Pool(proConfig);

const x = pool.query("DROP table auth;");
console.log(x);

x.then((res) => {
  console.log(res);
  process.exit(1);
});
