/* --------------------------------- SERVER --------------------------------- */
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 8080;
app.get("/", (req, res) => {
  res.send("Bot is running fine... no tension :)");
});

/* -------------------------- delete auth from url -------------------------- */
const authHiddenPath = process.env.authHiddenPath; //to have a hidden path for auth db deletion
const { dropAuth } = require("./db/dropauthDB");
app.get("/" + authHiddenPath, async (req, res) => {
  let response = await dropAuth();
  if (response) res.send("Auth DB deleted!");
  else res.send("There is some error!");
});

app.listen(port, () => {
  // console.clear();
  console.log("\nWeb-server running!\n");
});

const {
  default: makeWASocket,
  DisconnectReason,
  AnyMessageContent,
  delay,
  useSingleFileAuthState,
  makeInMemoryStore,
  fetchLatestBaileysVersion,
  downloadContentFromMessage,
} = require("@adiwajshing/baileys");
const { Boom } = require("@hapi/boom");
const P = require("pino");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");

//----------------------------------------------------------------------------//

let MAIN_LOGGER = P({ timestamp: () => `,"time":"${new Date().toJSON()}"` });
const logger = MAIN_LOGGER.child({});
logger.level = "warn";

//--------------------------------------AUTH-FILE--------------------------------//
const fs = require("fs");
// const mdClient = require("./db/dbConnection.js");
const store = makeInMemoryStore({
  logger: P().child({ level: "debug", stream: "store" }),
});
let startCount = 1;

try {
  fs.unlinkSync("./auth_info_multi.json");
} catch (err) {
  console.log("File Already Deleted");
}

const { state, saveState } = useSingleFileAuthState("./auth_info_multi.json");

// start a connection
// console.log('state : ', state.creds);
//------------------------------------------------------------------------------//
//--------------------------------------DATABASE--------------------------------//
const db = require("./db/authDB");
//------------------------------------------------------------------------------//
//--------------------------------AUTH-FETCH------------------------------------//
let cred, auth_row_count;
async function fetchauth() {
  try {
    auth_result = await db.query("select * from auth;"); //checking auth table
    console.log("Fetching login data...");
    auth_row_count = await auth_result.rowCount;
    let data = auth_result.rows[0];
    // console.log("data ",data);
    if (auth_row_count == 0) {
      console.log("No login data found!");
    } else {
      console.log("Login data found!");
      cred = {
        creds: {
          noiseKey: JSON.parse(data.noisekey),
          signedIdentityKey: JSON.parse(data.signedidentitykey),
          signedPreKey: JSON.parse(data.signedprekey),
          registrationId: Number(data.registrationid),
          advSecretKey: data.advsecretkey,
          nextPreKeyId: Number(data.nextprekeyid),
          firstUnuploadedPreKeyId: Number(data.firstunuploadedprekeyid),
          serverHasPreKeys: Boolean(data.serverhasprekeys),
          account: JSON.parse(data.account),
          me: JSON.parse(data.me),
          signalIdentities: JSON.parse(data.signalidentities),
          lastAccountSyncTimestamp: 0, // To allow bot to read the messages
          // lastAccountSyncTimestamp: Number(data.lastaccountsynctimestampb),
          myAppStateKeyId: data.myappstatekeyid,
        },
        keys: state.keys,
      };
      cred.creds.noiseKey.private = Buffer.from(cred.creds.noiseKey.private);
      cred.creds.noiseKey.public = Buffer.from(cred.creds.noiseKey.public);
      cred.creds.signedIdentityKey.private = Buffer.from(
        cred.creds.signedIdentityKey.private
      );
      cred.creds.signedIdentityKey.public = Buffer.from(
        cred.creds.signedIdentityKey.public
      );
      cred.creds.signedPreKey.keyPair.private = Buffer.from(
        cred.creds.signedPreKey.keyPair.private
      );
      cred.creds.signedPreKey.keyPair.public = Buffer.from(
        cred.creds.signedPreKey.keyPair.public
      );
      cred.creds.signedPreKey.signature = Buffer.from(
        cred.creds.signedPreKey.signature
      );
      cred.creds.signalIdentities[0].identifierKey = Buffer.from(
        cred.creds.signalIdentities[0].identifierKey
      );
    }
  } catch (err) {
    console.log(err);
    console.log("Creating database..."); //if login fail create a db
    await db.query(
      "CREATE TABLE auth(noiseKey text, signedIdentityKey text, signedPreKey text, registrationId text, advSecretKey text, nextPreKeyId text, firstUnuploadedPreKeyId text, serverHasPreKeys text, account text, me text, signalIdentities text, lastAccountSyncTimestamp text, myAppStateKeyId text);"
    );

    await fetchauth();
  }
}

/* -------------------------- Extra package include ------------------------- */
const util = require("util");
const axios = require("axios");
let Parser = require("rss-parser");
let parser = new Parser();

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

let commandsPublic = {};
let commandsMembers = {};
let commandsAdmins = {};
let commandsOwners = {};

const prefix = "!";

require("dotenv").config();
const myNumber = process.env.myNumber;
const pvx = process.env.pvx;

const { setCountMember } = require("./db/countMemberDB");
const { setCountVideo } = require("./db/countVideoDB");
const { storeNewsTech } = require("./db/postTechDB");
const { storeNewsStudy } = require("./db/postStudyDB");
const { getBlacklist } = require("./db/blacklistDB");
const { getCountVideo } = require("./db/countVideoDB");

let countSent = 1;
let commandSent = 1;

let pvxcommunity = "919557666582-1467533860@g.us";
let pvxprogrammer = "919557666582-1584193120@g.us";
let pvxadmin = "919557666582-1498394056@g.us";
let pvxstudy = "919557666582-1617595892@g.us";
let pvxmano = "19016677357-1630334490@g.us";
let pvxtech = "919557666582-1551290369@g.us";
let pvxsport = "919557666582-1559476348@g.us";
let pvxmovies = "919557666582-1506690003@g.us";
let pvxsticker1 = "919557666582-1580308963@g.us";
let pvxsticker2 = "919557666582-1621700558@g.us";
let pvxstickeronly1 = "919557666582-1628610549@g.us";
let pvxstickeronly2 = "919557666582-1586018947@g.us";
let mano = "19016677357-1630334490@g.us";
let pvxdeals = "919557666582-1582555632@g.us";

const addCommands = async () => {
  console.log("Commands Added!");
  let path = "./commands/public/";
  let filenames = await readdir(path);
  filenames.forEach((file) => {
    if (file.endsWith(".js")) {
      let { command } = require(path + file);
      let cmdinfo = command(); // {cmd:"", handler:function, alias:[]}
      // console.log(cmdinfo.cmd);
      for (let c of cmdinfo.cmd) {
        commandsPublic[c] = cmdinfo.handler;
      }
    }
  });

  path = "./commands/group/members/";
  filenames = await readdir(path);
  filenames.forEach((file) => {
    if (file.endsWith(".js")) {
      let { command } = require(path + file);
      let cmdinfo = command(); // {cmd:"", handler:function, alias:[]}
      // console.log(cmdinfo.cmd);
      for (let c of cmdinfo.cmd) {
        commandsMembers[c] = cmdinfo.handler;
      }
    }
  });

  path = "./commands/group/admins/";
  filenames = await readdir(path);
  filenames.forEach((file) => {
    if (file.endsWith(".js")) {
      let { command } = require(path + file);
      let cmdinfo = command(); // {cmd:"", handler:function, alias:[]}
      // console.log(cmdinfo.cmd);
      for (let c of cmdinfo.cmd) {
        commandsAdmins[c] = cmdinfo.handler;
      }
    }
  });

  path = "./commands/owner/";
  filenames = await readdir(path);
  filenames.forEach((file) => {
    if (file.endsWith(".js")) {
      let { command } = require(path + file);
      let cmdinfo = command(); // {cmd:"", handler:function, alias:[]}
      // console.log(cmdinfo.cmd);
      for (let c of cmdinfo.cmd) {
        commandsOwners[c] = cmdinfo.handler;
      }
    }
  });
};

const getGroupAdmins = (participants) => {
  admins = [];
  for (let memb of participants) {
    memb.admin ? admins.push(memb.id) : "";
  }
  return admins;
};

let authSaveInterval, dateCheckerInterval;
//CRICKET variables
let matchIdGroups = {}; //to store every group name with its match ID
let cricSetIntervalGroups = {}; //to store every group name with its setInterval value so that it can be stopped
let cricStartedGroups = {}; //to store every group name with boolean value to know if cricket score is already started or not
const { getCricketScore } = require("./functions/cricket");

const startSock = async () => {
  addCommands();
  clearInterval(authSaveInterval);
  clearInterval(dateCheckerInterval);
  Object.keys(cricSetIntervalGroups).forEach((e) => {
    clearInterval(e);
  });
  // try {
  //   mdClient.connect(async (err) => {
  //     if (err) console.log(err);
  //   });
  //   // throw "YES";
  //   let collection2 = mdClient.db("bot").collection("auth");
  //   let result = await collection2.findOne({ _id: 1 });
  //   if (result._id === 1) {
  //     let sessionAuth = result["sessionAuth"];
  //     sessionAuth = JSON.parse(sessionAuth);
  //     // delete sessionAuth.keys;
  //     // sessionAuth["creds"]["lastAccountSyncTimestamp"] = 0;
  //     sessionAuth = JSON.stringify(sessionAuth);
  //     fs.writeFileSync("./auth_info_multi.json", sessionAuth);
  //   }
  //   //console.log(session);
  //   console.log("Local file written");
  // } catch (err) {
  //   console.error("Local file writing error :", err);
  // }

  // store.readFromFile("./baileys_store_multi.json");
  // save every 1m

  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`using WA v${version.join(".")}, isLatest: ${isLatest}`);

  let noLogs = P({ level: "silent" }); //to hide the chat logs
  let yesLogs = P({ level: "debug" });
  await fetchauth();
  if (auth_row_count != 0) {
    state.creds = cred.creds;
  }
  const sock = makeWASocket({
    version,
    logger: noLogs,
    defaultQueryTimeoutMs: undefined,
    printQRInTerminal: true,
    auth: state,
  });

  store.bind(sock.ev);

  if (pvx) {
    let usedDate = new Date()
      .toLocaleString("en-GB", { timeZone: "Asia/kolkata" })
      .split(",")[0];

    const checkTodayBday = async (todayDate) => {
      console.log("CHECKING TODAY BDAY...", todayDate);
      todayDate = todayDate.split("/");
      let d = todayDate[0];
      d = d.startsWith("0") ? d[1] : d;
      let m = todayDate[1];
      m = m.startsWith("0") ? m[1] : m;
      let url = "https://pvxgroup.herokuapp.com/api/bday";
      let { data } = await axios.get(url);
      let bday = [];

      data.data.forEach((member) => {
        if (member.month == m && member.date == d) {
          bday.push(
            `${member.name.toUpperCase()} (${member.username.toUpperCase()})`
          );
          console.log(`Today is ${member.name} Birthday!`);
        }
      });
      if (bday.length) {
        let bdayComb = bday.join(" & ");
        await sock.sendMessage(pvxcommunity, {
          text: `*─「 🔥 <{PVX}> BOT 🔥 」─* \n\nToday is ${bdayComb} Birthday 🍰 🎉🎉`,
        });
      } else {
        console.log("NO BIRTHDAY!");
        await sock.sendMessage(pvxcommunity, {
          text: `*─「 🔥 <{PVX}> BOT 🔥 」─* \n\nThere is no Birthday today!`,
        });
      }
      try {
        await sock.groupUpdateSubject(pvxcommunity, "<{PVX}> COMMUNITY ❤️");
      } catch (err) {
        console.log(err);
      }
    };

    const postTechNews = async (count) => {
      if (count > 20) {
        //20 times, already posted news comes up
        return;
      }
      console.log(`TECH NEWS FUNCTION ${count} times!`);

      let url = "https://pvx-api-vercel.vercel.app/api/news";
      let { data } = await axios.get(url);
      delete data["about"];

      let newsWeb = [
        "gadgets-ndtv",
        "gadgets-now",
        "xda-developers",
        "inshorts",
        "beebom",
        "india",
        "mobile-reuters",
        "techcrunch",
        "engadget",
      ];

      let randomWeb = newsWeb[Math.floor(Math.random() * newsWeb.length)]; //random website
      let index = Math.floor(Math.random() * data[randomWeb].length);

      let news = data[randomWeb][index];
      let techRes = await storeNewsTech(news);
      if (techRes) {
        console.log("NEW TECH NEWS!");
        sock.sendMessage(pvxtech, { text: `📰 ${news}` });
      } else {
        console.log("OLD TECH NEWS!");
        postTechNews(count + 1);
      }
    };

    const postStudyInfo = async (count) => {
      if (count > 20) {
        //20 times already posted news came
        return;
      }
      console.log(`STUDY NEWS FUNCTION ${count} times!`);
      let feed;
      //   "https://www.thehindu.com/news/national/feeder/default.rss"
      //   "https://timesofindia.indiatimes.com/rssfeedmostrecent.cms"
      feed = await parser.parseURL(
        "https://www.mid-day.com/Resources/midday/rss/india-news.xml"
      );
      // https://zeenews.india.com/rss/india-national-news.xml

      let li = feed.items.map((item) => {
        return { title: item.title, link: item.link };
      });

      let index = Math.floor(Math.random() * li.length);

      let news = li[index];

      let techRes = await storeNewsStudy(news.title);
      if (techRes) {
        console.log("NEW STUDY NEWS!");
        sock.sendMessage(pvxstudy, { text: `📰 ${news.title}` });
      } else {
        console.log("OLD STUDY NEWS!");
        postStudyInfo(count + 1);
      }
    };

    const kickZeroMano = async () => {
      let resultCountGroupIndi = await getCountVideo(pvxmano);

      let memWithMsg = new Set();
      for (let member of resultCountGroupIndi) {
        memWithMsg.add(member.memberjid);
      }

      const groupMetadata = await sock.groupMetadata(pvxmano);
      const groupMembers = groupMetadata.participants;

      let zeroMano = [];
      groupMembers.forEach((mem) => {
        if (!memWithMsg.has(mem.id)) {
          zeroMano.push(mem.id);
        }
      });

      let randomMemId = zeroMano[Math.floor(Math.random() * zeroMano.length)];
      let num_split = `${randomMemId.split("@s.whatsapp.net")[0]}`;

      console.log(`Removing ${randomMemId} from Mano.`);
      await sock.sendMessage(pvxmano, {
        text: `Removing  @${num_split}\nReason: 0 videos count! `,
        mentions: [randomMemId],
      });
      await sock.groupParticipantsUpdate(pvxmano, [randomMemId], "remove");

      // randomMemId = zeroMano[Math.floor(Math.random() * zeroMano.length)];
      // num_split = `${randomMemId.split("@s.whatsapp.net")[0]}`;
      // console.log(`Removing ${randomMemId} from Mano.`);
      // await sock.sendMessage(pvxmano, {
      //   text: `Removing  @${num_split}\nReason: 0 videos count! `,
      //   mentions: [randomMemId],
      // });
      // await sock.groupParticipantsUpdate(pvxmano, [randomMemId], "remove");
    };

    dateCheckerInterval = setInterval(() => {
      console.log("SET INTERVAL.");
      let todayDate = new Date().toLocaleDateString("en-GB", {
        timeZone: "Asia/kolkata",
      });

      let hour = Number(
        new Date()
          .toLocaleTimeString("en-GB", {
            timeZone: "Asia/kolkata",
          })
          .split(":")[0]
      );
      //8 to 24 ON
      if (hour >= 8) {
        postTechNews(0);
        postStudyInfo(0);
      }

      if (hour % 12 == 0) kickZeroMano();

      if (usedDate !== todayDate) {
        usedDate = todayDate;
        checkTodayBday(todayDate);
      }
    }, 1000 * 60 * 20); //20 min
  }

  // store.bind(sock.ev);

  const sendMessageWTyping = async (msg, jid) => {
    await sock.presenceSubscribe(jid);
    await delay(500);
    await sock.sendPresenceUpdate("composing", jid);
    await delay(2000);
    await sock.sendPresenceUpdate("paused", jid);
    await sock.sendMessage(jid, msg);
  };

  // sock.ev.on("chats.set", (item) =>
  //   console.log(`recv ${item.chats.length} chats (is latest: ${item.isLatest})`)
  // );
  // sock.ev.on("messages.set", (item) =>
  //   console.log(
  //     `recv ${item.messages.length} messages (is latest: ${item.isLatest})`
  //   )
  // );
  // sock.ev.on("contacts.set", (item) =>
  //   console.log(`recv ${item.contacts.length} contacts`)
  // );

  //---------------------------------------group-participants.update-----------------------------------------//
  sock.ev.on("group-participants.update", async (msg) => {
    try {
      let from = msg.id;
      const groupMetadata = await sock.groupMetadata(from);
      let groupDesc = groupMetadata.desc.toString();
      let groupSubject = groupMetadata.subject;
      let blockCommandsInDesc = []; //commands to be blocked
      if (groupDesc) {
        let firstLineDesc = groupDesc.split("\n")[0];
        blockCommandsInDesc = firstLineDesc.split(",");
      }

      let numJid = msg.participants[0];
      let num_split = `${numJid.split("@s.whatsapp.net")[0]}`;

      if (msg.action == "add") {
        // other than +91 are blocked from joining when description have written in first line -> only91
        // blockCommandsInDesc.includes("only91")
        if (
          !num_split.startsWith(91) &&
          groupSubject.toUpperCase().includes("<{PVX}>")
        ) {
          await sock.sendMessage(from, {
            text: `*─「 🔥 <{PVX}> BOT 🔥 」─* \n\nOnly +91 numbers are allowed !!!!`,
          });
          await sock.groupParticipantsUpdate(from, [numJid], "remove");

          await sock.sendMessage(myNumber + "@s.whatsapp.net", {
            text: `${num_split} is removed from ${groupSubject}. Not 91!`,
          });
          return;
        }

        //if number is blacklisted
        let blacklistRes = await getBlacklist();
        blacklistRes = blacklistRes.map((num) => num.number);
        // console.log(blacklistRes);
        if (blacklistRes.includes(num_split)) {
          await sock.sendMessage(from, {
            text: `*─「 🔥 <{PVX}> BOT 🔥 」─* \n\nNumber is blacklisted !!!!`,
          });

          await sock.groupParticipantsUpdate(from, [numJid], "remove");
          await sock.sendMessage(myNumber + "@s.whatsapp.net", {
            text: `${num_split} is removed from ${groupSubject}. Blacklisted!`,
          });
          return;
        }

        //for study group
        if (from === pvxstudy) {
          await sock.sendMessage(from, {
            text: `Welcome @${num_split} to PVX Study group.\nhttps://pvxcommunity.com/\n\nKindly fill the Biodata form (mandatory for all)\n\n👇🏻👇🏻👇🏻👇🏻👇🏻\nhttps://forms.gle/uuvUwV5fTk8JAjoTA`,
            mentions: [numJid],
          });
        }

        //for movies group
        if (from === pvxmovies) {
          await sock.sendMessage(from, {
            text: `Welcome @${num_split} to PVX Movies.\nhttps://pvxcommunity.com/\n\nWhat are your currently watching..?`,
            mentions: [numJid],
          });
        }

        //for community group
        if (from === pvxcommunity) {
          await sock.sendMessage(from, {
            text: `Welcome @${num_split} to PVX COMMUNITY.\nhttps://pvxcommunity.com/\n\nSend ${prefix}rules to know all PVX rules.\nIf you're new to PVX, please share how did you find us.`,
            mentions: [numJid],
          });
        }

        //for mano
        if (from === pvxmano) {
          await sock.sendMessage(from, {
            text: `Welcome  @${num_split} to PVX MANORANJAN 🔥\n\n1) Send videos regularly especially new members.\n2) Don't Send CP or any other illegal videos.\n 3) A group bot will be counting the number of videos you've sent.\nSend ${prefix}pvxv to know video count.\nInactive members will be kicked time to time.`,
            mentions: [numJid],
          });
        }

        //for programmer group
        if (from === pvxprogrammer) {
          await sock.sendMessage(from, {
            text: `Welcome @${num_split} to PVX Programmers Group.\nhttps://pvxcommunity.com/\n\n*Kindly give your intro like*\nName:\nCollege/Degree:\nInterest:\nSkills:\nCompany(if working):`,
            mentions: [numJid],
          });
        }

        if (from === pvxsticker1 || from === pvxsticker2) {
          await sock.sendMessage(from, {
            text: `Welcome @${num_split} to PVX Stickers\nhttps://pvxcommunity.com/\n\n1) Don't make any type of sticker that targets any caste, community, religion, sex, creed, etc.\n2) The use of any kind of 18+ media (be it nudes or semi nudes) is not allowed.\n3) Every sticker you make here gets PVX branding in it along with website, so You'll get instant ban on disobeying any rule`,
            mentions: [numJid],
          });
        }

        let botNumberJid = sock.user.id; //'1506xxxxx54:3@s.whatsapp.net'
        botNumberJid =
          botNumberJid.slice(0, botNumberJid.search(":")) +
          botNumberJid.slice(botNumberJid.search("@"));
        if (numJid === botNumberJid) {
          console.log("Bot is added to new group!");
          // await sock.sendMessage(myNumber + "@s.whatsapp.net", {
          //   text: `*─「 🔥 <{PVX}> BOT 🔥 」─* \n\nSEND ${prefix}help FOR BOT COMMANDS`,
          // });
        }
        console.log(`[GROUP] ${groupSubject} [JOINED] ${numJid}`);
      }
      if (msg.action == "remove") {
        console.log(`[GROUP] ${groupSubject} [LEAVED] ${numJid}`);
      }
    } catch (err) {
      console.log(err);
    }
  });

  sock.ev.on("messages.upsert", async (m) => {
    // console.log(JSON.stringify(m, undefined, 2));
    // console.log(m.messages);
    // if (msg.key && msg.key.remoteJid == "status@broadcast") return;
    try {
      const msg = JSON.parse(JSON.stringify(m)).messages[0];
      if (!msg.message) return; //when demote, add, remove, etc happen then msg.message is not there

      const content = JSON.stringify(msg.message);
      const from = msg.key.remoteJid;
      // console.log(msg);
      const type = Object.keys(msg.message)[0];

      let botNumberJid = sock.user.id; //'1506xxxxx54:3@s.whatsapp.net'
      botNumberJid =
        botNumberJid.slice(0, botNumberJid.search(":")) +
        botNumberJid.slice(botNumberJid.search("@"));

      //body will have the text message
      let body =
        type === "conversation" && msg.message.conversation.startsWith(prefix)
          ? msg.message.conversation
          : type == "imageMessage" &&
            msg.message.imageMessage.caption &&
            msg.message.imageMessage.caption.startsWith(prefix)
          ? msg.message.imageMessage.caption
          : type == "videoMessage" &&
            msg.message.videoMessage.caption &&
            msg.message.videoMessage.caption.startsWith(prefix)
          ? msg.message.videoMessage.caption
          : type == "extendedTextMessage" &&
            msg.message.extendedTextMessage.text &&
            msg.message.extendedTextMessage.text.startsWith(prefix)
          ? msg.message.extendedTextMessage.text
          : "";
      // console.log(body);
      if (body[1] == " ") body = body[0] + body.slice(2); //remove space when space btw prefix and commandName like "! help"
      const command = body.slice(1).trim().split(/ +/).shift().toLowerCase();
      const args = body.trim().split(/ +/).slice(1);
      const isCmd = body.startsWith(prefix);

      const isGroup = from.endsWith("@g.us");
      const groupMetadata = isGroup ? await sock.groupMetadata(from) : "";
      const groupName = isGroup ? groupMetadata.subject : "";
      let sender = isGroup ? msg.key.participant : from;
      if (msg.key.fromMe) sender = botNumberJid;
      if (sender.includes(":"))
        //remove : from number
        sender =
          sender.slice(0, sender.search(":")) +
          sender.slice(sender.search("@"));
      const senderName = msg.pushName;

      //Count message
      if (
        isGroup &&
        groupName.toUpperCase().includes("<{PVX}>") &&
        from !== pvxstickeronly1 &&
        from != pvxstickeronly2 &&
        from != pvxdeals
      ) {
        setCountMember(sender, from, senderName);
      }

      //count video
      if (isGroup && from == pvxmano && msg.message.videoMessage) {
        setCountVideo(sender, from);
      }

      //Forward all stickers
      if (
        pvx &&
        isGroup &&
        msg.message.stickerMessage &&
        groupName.toUpperCase().startsWith("<{PVX}>") &&
        from !== pvxstickeronly1 &&
        from != pvxstickeronly2 &&
        from !== mano
      ) {
        // msg.key.fromMe == false &&
        // "<{PVX}> BOT 🤖"

        let downloadFilePath = msg.message.stickerMessage;
        const stream = await downloadContentFromMessage(
          downloadFilePath,
          "sticker"
        );
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk]);
        }

        const sticker = new Sticker(buffer, {
          pack: "BOT 🤖",
          author: "pvxcommunity.com",
          type: StickerTypes.DEFAULT,
          quality: 80,
        });

        await sock.sendMessage(pvxstickeronly1, await sticker.toMessage());
        await sock.sendMessage(pvxstickeronly2, await sticker.toMessage());

        console.log(`${countSent} sticker sent!`);
        countSent += 1;
      }

      if (!isCmd) return;

      const groupDesc = isGroup ? groupMetadata.desc.toString() : "";
      const groupMembers = isGroup ? groupMetadata.participants : "";
      const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : "";
      const isBotGroupAdmins = groupAdmins.includes(botNumberJid) || false;
      const isGroupAdmins = groupAdmins.includes(sender) || false;

      const isMedia = type === "imageMessage" || type === "videoMessage"; //image or video
      const isTaggedImage =
        type === "extendedTextMessage" && content.includes("imageMessage");
      const isTaggedVideo =
        type === "extendedTextMessage" && content.includes("videoMessage");
      const isTaggedSticker =
        type === "extendedTextMessage" && content.includes("stickerMessage");
      const isTaggedDocument =
        type === "extendedTextMessage" && content.includes("documentMessage");

      const reply = (text) => {
        sock.sendMessage(from, { text }, { quoted: m.messages[0] });
      };

      // Display every command info
      console.log(
        "[COMMAND]",
        command,
        "[FROM]",
        sender.split("@")[0],
        "[IN]",
        groupName
      );

      let msgInfoObj = {
        prefix,
        sender,
        senderName,
        groupName,
        groupDesc,
        groupMembers,
        groupAdmins,
        isBotGroupAdmins,
        isGroupAdmins,
        isMedia,
        type,
        isTaggedImage,
        isTaggedDocument,
        isTaggedVideo,
        isTaggedSticker,
        myNumber,
        botNumberJid,
        reply,
      };

      // send every command info to my whatsapp, won't work when i send something for bot
      if (myNumber && myNumber + "@s.whatsapp.net" !== sender) {
        await sock.sendMessage(myNumber + "@s.whatsapp.net", {
          text: `${commandSent}) [${prefix}${command}] [${groupName}]`,
        });
        ++commandSent;
      }

      //return false when stopped in middle. return true when run fully
      const startcHelper = async (isFromSetInterval = false) => {
        if (!groupDesc) {
          reply(
            `❌ ERROR\n- Group description is empty.\n- Put match ID in starting of group description.\n- Get match ID from cricbuzz today match url.\n- example: https://www.cricbuzz.com/live-cricket-scores/37572/mi-vs-kkr-34th-match-indian-premier-league-2021 \n- so match ID is 37572 !\n# If you've put correct match ID in description starting and still facing this error then contact developer by !dev`
          );

          return false;
        }

        matchIdGroups[groupName] = groupDesc.slice(0, 5);
        if (!isFromSetInterval) {
          reply(
            "✔️ Starting Cricket scores for matchID: " +
              matchIdGroups[groupName] +
              " (taken from description)"
          );
        }

        let response = await getCricketScore(matchIdGroups[groupName]);

        //response.info have "MO" only when command is startc
        if (response.info === "MO") {
          sock.sendMessage(from, { text: response.message });
          reply("✔️ Match over! Stopping Cricket scores for this group !");
          console.log("Match over! Stopping Cricket scores for " + groupName);
          clearInterval(cricSetIntervalGroups[groupName]);
          cricStartedGroups[groupName] = false;
          return false;
        } else if (response.info === "IO") {
          sock.sendMessage(from, { text: response.message });
          reply(
            "✔️ Inning over! Open again live scores later when 2nd inning will start by !startc"
          );
          reply("✔️ Stopping Cricket scores for this group !");
          console.log("Stopping Cricket scores for " + groupName);
          clearInterval(cricSetIntervalGroups[groupName]);
          cricStartedGroups[groupName] = false;
          return false;
        } else if (response.info === "ER") {
          reply(
            `❌ ERROR\n- Group description starting is "${matchIdGroups[groupName]}"\n- Put match ID in starting of group description. \n- Get match ID from cricbuzz today match url.\n- example: https://www.cricbuzz.com/live-cricket-scores/37572/mi-vs-kkr-34th-match-indian-premier-league-2021 \n- so match ID is 37572 !\n# If you've put correct match ID in description starting and still facing this error then contact developer by !dev`
          );
          return false;
        }
        sock.sendMessage(from, { text: response.message });
        return true;
      };

      switch (command) {
        case "startc":
          if (!isGroup) {
            reply("❌ Group command only!");
            return;
          }
          if (cricStartedGroups[groupName]) {
            reply("❌ CRICKET SCORES already started for this group!");
            return;
          }

          let respCric = await startcHelper("startc");
          if (!respCric) return;

          cricStartedGroups[groupName] = true;
          cricSetIntervalGroups[groupName] = setInterval(async () => {
            respCric = await startcHelper("startc", true);
            if (!respCric) return;
          }, 1000 * 90); //1 min
          return;

        case "stopc":
          if (!isGroup) {
            reply("❌ Group command only!");
            return;
          }

          if (cricStartedGroups[groupName]) {
            reply("✔️ Stopping Cricket scores for this group !");
            console.log("Stopping Cricket scores for " + groupName);
            clearInterval(cricSetIntervalGroups[groupName]);
            cricStartedGroups[groupName] = false;
          } else reply("❌ CRICKET scores was never started for this group!");
          return;

        case "test":
          if (myNumber + "@s.whatsapp.net" !== sender) {
            reply(`❌ Command only for owner for bot testing purpose!`);
            return;
          }

          if (args.length === 0) {
            reply(`❌ empty query!`);
            return;
          }
          try {
            let resultTest = eval(args[0]);
            if (typeof resultTest === "object")
              reply(JSON.stringify(resultTest));
            else reply(resultTest.toString());
          } catch (err) {
            reply(err.toString());
          }
          return;
      }

      //using 'm.messages[0]' to tag message, by giving 'msg' throw some error
      try {
        /* ----------------------------- public commands ---------------------------- */
        if (commandsPublic[command]) {
          await commandsPublic[command](
            sock,
            m.messages[0],
            from,
            args,
            msgInfoObj
          );
          return;
        }

        /* ------------------------- group members commands ------------------------- */
        if (commandsMembers[command]) {
          if (isGroup) {
            await commandsMembers[command](
              sock,
              m.messages[0],
              from,
              args,
              msgInfoObj
            );
            return;
          }
          await sock.sendMessage(
            from,
            {
              text: "❌ Group command only!",
            },
            { quoted: m.messages[0] }
          );
          return;
        }

        /* -------------------------- group admins commands ------------------------- */
        if (commandsAdmins[command]) {
          if (!isGroup) {
            reply("❌ Group command only!");
            return;
          }

          if (isGroupAdmins) {
            await commandsAdmins[command](
              sock,
              m.messages[0],
              from,
              args,
              msgInfoObj
            );
            return;
          }
          await sock.sendMessage(
            from,
            {
              text: "❌ Admin command!",
            },
            { quoted: m.messages[0] }
          );
          return;
        }

        /* ----------------------------- owner commands ----------------------------- */
        if (commandsOwners[command]) {
          if (myNumber + "@s.whatsapp.net" === sender) {
            await commandsOwners[command](
              sock,
              m.messages[0],
              from,
              args,
              msgInfoObj
            );
            return;
          }
          await sock.sendMessage(
            from,
            {
              text: "❌ Owner command only!",
            },
            { quoted: m.messages[0] }
          );
          return;
        }
      } catch (err) {
        console.log("[ERROR]: ", err);
        reply(err.toString());
        await sock.sendMessage(myNumber + "@s.whatsapp.net", {
          text: `ERROR: [${prefix}${command}] [${groupName}]\n${err}`,
        });
      }

      /* ----------------------------- unknown command ---------------------------- */
      await sock.sendMessage(
        from,
        {
          text: `Send ${prefix}help for <{PVX}> BOT commands!`,
        },
        { quoted: m.messages[0] }
      );
    } catch (err) {
      console.log(err);
      return;
    }
  });

  // sock.ev.on("messages.update", (m) => console.log(m));
  // sock.ev.on("message-receipt.update", (m) => console.log(m));
  // sock.ev.on("presence.update", (m) => console.log(m));
  // sock.ev.on("chats.update", (m) => console.log(m));
  // sock.ev.on("contacts.upsert", (m) => console.log(m));

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      // reconnect if not logged out
      if (
        (lastDisconnect.error &&
          lastDisconnect.error.output &&
          lastDisconnect.error.output.statusCode) !== DisconnectReason.loggedOut
      ) {
        console.log("CONNECTION CLOSE.");
        ++startCount;
        console.log("--- START SOCK COUNT ---", startCount);
        startSock();
      } else {
        console.log("Connection closed. You are logged out.");
      }
    }

    if (connection === "open") {
      console.log("Connected");
    }

    console.log("connection update", update);
  });
  // listen for when the auth credentials is updated
  sock.ev.on("creds.update", () => {
    // console.log("Creds updated!");
    saveState();
    try {
      let noiseKey = JSON.stringify(state.creds.noiseKey);
      let signedIdentityKey = JSON.stringify(state.creds.signedIdentityKey);
      let signedPreKey = JSON.stringify(state.creds.signedPreKey);
      let registrationId = state.creds.registrationId;
      let advSecretKey = state.creds.advSecretKey;
      let nextPreKeyId = state.creds.nextPreKeyId;
      let firstUnuploadedPreKeyId = state.creds.firstUnuploadedPreKeyId;
      let serverHasPreKeys = state.creds.serverHasPreKeys;
      let account = JSON.stringify(state.creds.account);
      let me = JSON.stringify(state.creds.me);
      let signalIdentities = JSON.stringify(state.creds.signalIdentities);
      let lastAccountSyncTimestamp = state.creds.lastAccountSyncTimestamp;
      // let lastAccountSyncTimestamp = 0;
      let myAppStateKeyId = state.creds.myAppStateKeyId; //?

      // INSERT / UPDATE LOGIN DATA
      if (auth_row_count == 0) {
        console.log("Inserting login data...");
        db.query(
          "INSERT INTO auth VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13);",
          [
            noiseKey,
            signedIdentityKey,
            signedPreKey,
            registrationId,
            advSecretKey,
            nextPreKeyId,
            firstUnuploadedPreKeyId,
            serverHasPreKeys,
            account,
            me,
            signalIdentities,
            lastAccountSyncTimestamp,
            myAppStateKeyId,
          ]
        );
        db.query("commit;");
        console.log("New login data inserted!");
      } else {
        // console.log("Updating login data....");
        db.query(
          "UPDATE auth SET noiseKey = $1, signedIdentityKey = $2, signedPreKey = $3, registrationId = $4, advSecretKey = $5, nextPreKeyId = $6, firstUnuploadedPreKeyId = $7, serverHasPreKeys = $8, account = $9, me = $10, signalIdentities = $11, lastAccountSyncTimestamp = $12, myAppStateKeyId = $13;",
          [
            noiseKey,
            signedIdentityKey,
            signedPreKey,
            registrationId,
            advSecretKey,
            nextPreKeyId,
            firstUnuploadedPreKeyId,
            serverHasPreKeys,
            account,
            me,
            signalIdentities,
            lastAccountSyncTimestamp,
            myAppStateKeyId,
          ]
        );
        db.query("commit;");
        console.log("Login data updated!");
      }
    } catch (err) {
      console.log(err);
    }
  });

  // sock.ev.on("creds.update", async () => {
  //   saveState();
  //   // authSaveInterval = setInterval(async () => {
  //   // console.log("Auth updating to DB");
  //   store.writeToFile("./baileys_store_multi.json");
  //   try {
  //     let sessionDataAuth = fs.readFileSync("./auth_info_multi.json");
  //     sessionDataAuth = JSON.parse(sessionDataAuth);
  //     // delete sessionDataAuth.keys;
  //     sessionDataAuth = JSON.stringify(sessionDataAuth);
  //     //console.log(sessionData);
  //     let collection2 = mdClient.db("bot").collection("auth");
  //     //(chatid,{})
  //     const res = await collection2.updateOne(
  //       { _id: 1 },
  //       { $set: { sessionAuth: sessionDataAuth } }
  //     );
  //     if (res.matchedCount) {
  //       console.log("DB UPDATED");
  //     } else {
  //       collection2.insertOne({ _id: 1, sessionAuth: sessionDataAuth });
  //       console.log("DB INSERTED");
  //     }
  //   } catch (err) {
  //     console.log("Db updation error : ", err);
  //   }

  //   // }, 1000 * 60);
  // });

  return sock;
};

startSock();
