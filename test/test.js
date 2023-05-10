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

// {
//   'android-app-store-link': 'https://play.google.com/store/apps/details?id=com.snowcorp.stickerly.android',
//   'ios-app-store-link': 'https://itunes.apple.com/app/id1458740001?mt=8',
//   'sticker-pack-publisher': 'Sticker.ly * stickerly_indranil',
//   'sticker-pack-name': 'Cat',
//   'sticker-pack-id': '2dd046e4-919b-48e8-a9f2-f10987664d89.A250AA69-77E8-4DCE-8BC5-A9785E81C0AC'
//   }

// index = 1;
// time = 0;

// const main = async () => {
//   try {
//     const addNumber = async () => {
//       const a = b / 2;
//       return a;
//     };

//     const c = addNumber();
//   } catch (error) {}
// };
// main();

// const pool = require("../db/pool");
// const pvxsticker1 = "919557666582-1580308963@g.us";
// const pvxsticker2 = "919557666582-1621700558@g.us";
// const setCountMember = async (memberJid, groupJid, count) => {
//   try {
//     let res1 = await pool.query(
//       "UPDATE countmember SET count = count+$3 WHERE memberjid=$1 AND groupjid=$2;",
//       [memberJid, groupJid, count]
//     );

//     console.log(JSON.stringify(res1.rows));
//     //not updated. time to insert
//     if (res1.affectedRows) {
//       await pool.query(
//         "UPDATE countmember SET count = $3 WHERE memberjid=$1 AND groupjid=$2;",
//         [memberJid, groupJid, count]
//       );
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

// //pvxm: current group member stats
// const getCountGroupMembers = async (groupJid) => {
//   let result = await pool.query(
//     "SELECT cm.memberJid,cm.count,cmn.name FROM countmember cm INNER JOIN countmembername cmn ON cm.memberJid=cmn.memberJid WHERE groupJid=$1 ORDER BY count DESC;",
//     [groupJid]
//   );
//   if (result.rowCount) {
//     console.log(result.rows);
//     let time = 0;

//     result.rows.forEach((mem) => {
//       time += 500;
//       setTimeout(() => {
//         setCountMember(mem.memberjid, pvxsticker1, mem.count);
//         // console.log(mem.memberjid, pvxsticker1, mem.count);
//       }, time);
//     });
//   } else {
//     return [];
//   }
// };
// getCountGroupMembers(pvxsticker2);

// const { UltimateTextToImage } = require("ultimate-text-to-image");

// new UltimateTextToImage(`Checking the text to image`, {
//   width: 500,
//   height: 500,
//   fontFamily: "Comic Sans MS",
//   fontColor: "#ff0000",
//   fontSize: 40,
//   minFontSize: 10,
//   lineHeight: 40,
//   autoWrapLineHeightMultiplier: 1.2,
//   margin: 20,
//   marginBottom: 40,
//   align: "center",
//   valign: "middle",
// })
//   .render()
//   .toFile("image1.png");
// const google = require("googlethis");

// const options = {
//   page: 0,
//   safe: false, // Safe Search
//   parse_ads: false, // If set to true sponsored results will be parsed
//   additional_params: {
//     // add additional parameters here, see https://moz.com/blog/the-ultimate-guide-to-the-google-search-parameters and https://www.seoquake.com/blog/google-search-param/
//     hl: "en",
//   },
// };

// const main = async () => {
//   const response = await google.search("TWDG", options);
//   console.log(response.results[0]);
// };

// main();

console.log(process);
