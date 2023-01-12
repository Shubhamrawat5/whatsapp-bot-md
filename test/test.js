// const fs = require("fs");
// const util = require("util");

// const readdir = util.promisify(fs.readdir);
// const readFile = util.promisify(fs.readFile);

// let commandsAll = {};

// async function xyz() {
//   let path = "./commands/public/";
//   let filenames = await readdir(path);
//   filenames.forEach((file) => {
//     if (file.endsWith(".js")) {
//       let { command } = require(path + file);
//       let cmdinfo = command();
//       // console.log(cmdinfo.cmd);
//       commandsAll[cmdinfo.cmd] = cmdinfo.handler;
//     }
//   });

//   path = "./commands/group/members/";
//   filenames = await readdir(path);
//   filenames.forEach((file) => {
//     if (file.endsWith(".js")) {
//       let { command } = require(path + file);
//       let cmdinfo = command();
//       // console.log(cmdinfo.cmd);
//       commandsAll[cmdinfo.cmd] = cmdinfo.handler;
//     }
//   });

//   path = "./commands/group/admins/";
//   filenames = await readdir(path);
//   filenames.forEach((file) => {
//     if (file.endsWith(".js")) {
//       let { command } = require(path + file);
//       let cmdinfo = command();
//       // console.log(cmdinfo.cmd);
//       commandsAll[cmdinfo.cmd] = cmdinfo.handler;
//     }
//   });
//   console.log(commandsAll);
//   // commandsAll["help"]();
// }
// xyz();

// (chatid,{})
// let x = collection2.updateOne(
//   { _id: 1 },
//   { $set: { sessionAuth: "sessionDataAuth" } }
// );

// console.log(x);
// x.then((res) => {
//   console.log(res);
//   if (res.matchedCount) {
//     console.log("UPDATED");
//   } else {
//     collection2.insertOne({ _id: 1, sessionAuth: "sessionDataAuth" });
//     console.log("INSERTED");
//   }
// });

// delete auth
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
// });

// let Parser = require("rss-parser");
// let parser = new Parser();
// const rss = async () => {
//   // feed = await parser.parseURL(
//   //     "https://www.thehindu.com/news/national/feeder/default.rss"
//   //     );
//   // feed = await parser.parseURL(
//   //   "https://timesofindia.indiatimes.com/rssfeedmostrecent.cms"
//   // );
//   feed = await parser.parseURL(
//     "https://www.mid-day.com/Resources/midday/rss/india-news.xml"
//   );
//   let li = feed.items.map((item) => {
//     return { title: item.title, link: item.link };
//   });

//   console.log(li);
// };

// rss();

// const gis = require("g-i-s");
// console.log(2);
// gis("cats", logResults);

// function logResults(error, results) {
//   console.log(1);
//   if (error) {
//     console.log(error);
//   } else {
//     console.log(JSON.stringify(results, null, "  "));
//   }
// }

index = 1;
time = 0;

const main = async () => {
  try {
    const addNumber = async () => {
      const a = b / 2;
      return a;
    };

    const c = addNumber();
  } catch (error) {}
};
main();
