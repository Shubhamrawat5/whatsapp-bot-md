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

const pool = require("./pool");

const x = pool.query("DROP table auth;");
console.log(x);

x.then((res) => {
  console.log(res);
  process.exit(1);
});
