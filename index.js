/* --------------------------------- SERVER --------------------------------- */
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
const port = process.env.PORT || 8080;
app.get("/", (req, res) => {
  // res.send("Bot is running");
  res.sendFile(__dirname + "/index.html");
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

/* ------------------------------ add packages ------------------------------ */
const {
  default: makeWASocket,
  DisconnectReason,
  AnyMessageContent,
  delay,
  useSingleFileAuthState,
  makeInMemoryStore,
  fetchLatestBaileysVersion,
  downloadContentFromMessage,
  WA_DEFAULT_EPHEMERAL,
} = require("@adiwajshing/baileys");
const { Boom } = require("@hapi/boom");
const P = require("pino");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const util = require("util");

const fs = require("fs");

// start a connection
// console.log('state : ', state.creds);

/* ----------------------------- add local files ---------------------------- */
const { setCountMember } = require("./db/countMemberDB");
const { setCountVideo } = require("./db/countVideoDB");
const { getBlacklist } = require("./db/blacklistDB");
const { getDisableCommandData } = require("./db/disableCommandDB");
const { getCricketScore } = require("./functions/cricket");
const { postStudyInfo } = require("./functions/postStudyInfo");
const { postTechNews } = require("./functions/postTechNews");
const { checkTodayBday } = require("./functions/checkTodayBday");
const { storeAuth, fetchAuth } = require("./db/authDB");

require("dotenv").config();
const myNumber = process.env.myNumber;
const pvx = process.env.pvx;

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

const commandsPublic = {};
const commandsMembers = {};
const commandsAdmins = {};
const commandsOwners = {};

const prefix = "!";

let countSent = 1;
let commandSent = 1;
let startCount = 1;

let authSaveInterval, dateCheckerInterval;
let matchIdGroups = {}; //to store every group name with its match ID
let cricSetIntervalGroups = {}; //to store every group name with its setInterval value so that it can be stopped
let cricStartedGroups = {}; //to store every group name with boolean value to know if cricket score is already started or not

const pvxcommunity = "919557666582-1467533860@g.us";
const pvxprogrammer = "919557666582-1584193120@g.us";
const pvxadmin = "919557666582-1498394056@g.us";
const pvxstudy = "919557666582-1617595892@g.us";
const pvxmano = "19016677357-1630334490@g.us";
const pvxtech = "919557666582-1551290369@g.us";
const pvxsport = "919557666582-1559476348@g.us";
const pvxmovies = "919557666582-1506690003@g.us";
const pvxsticker1 = "919557666582-1580308963@g.us";
const pvxsticker2 = "919557666582-1621700558@g.us";
const pvxstickeronly1 = "919557666582-1628610549@g.us";
const pvxstickeronly2 = "919557666582-1586018947@g.us";
const pvxdeals = "919557666582-1582555632@g.us";

const store = makeInMemoryStore({
  logger: P().child({ level: "debug", stream: "store" }),
});

try {
  fs.unlinkSync("./auth_info_multi.json");
} catch (err) {
  console.log("Local auth file already deleted");
}

const { state, saveState } = useSingleFileAuthState("./auth_info_multi.json");
const MAIN_LOGGER = P({ timestamp: () => `,"time":"${new Date().toJSON()}"` });
const logger = MAIN_LOGGER.child({});
logger.level = "warn";

const addCommands = async () => {
  let path = "./commands/public/";
  let filenames = await readdir(path);
  filenames.forEach((file) => {
    if (file.endsWith(".js")) {
      let { command } = require(path + file);
      let cmdinfo = command(); // {cmd:["",""], handler:function}
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
      let cmdinfo = command(); // {cmd:["",""], handler:function}
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
      let cmdinfo = command(); // {cmd:["",""], handler:function}
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
      let cmdinfo = command(); // {cmd:["",""], handler:function}
      // console.log(cmdinfo.cmd);
      for (let c of cmdinfo.cmd) {
        commandsOwners[c] = cmdinfo.handler;
      }
    }
  });
  console.log("Commands Added!");
};

const getGroupAdmins = (participants) => {
  admins = [];
  for (let memb of participants) {
    memb.admin ? admins.push(memb.id) : "";
  }
  return admins;
};

const startBot = async () => {
  addCommands();
  clearInterval(authSaveInterval);
  clearInterval(dateCheckerInterval);
  Object.keys(cricSetIntervalGroups).forEach((e) => {
    clearInterval(e);
  });

  // store.readFromFile("./baileys_store_multi.json");
  // save every 1m

  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`using WA v${version.join(".")}, isLatest: ${isLatest}`);

  let noLogs = P({ level: "silent" }); //to hide the chat logs
  let yesLogs = P({ level: "debug" });

  //Fetch login auth
  const { cred, auth_row_count } = await fetchAuth(state);
  if (auth_row_count != 0) {
    state.creds = cred.creds;
  }
  const bot = makeWASocket({
    version,
    logger: noLogs,
    defaultQueryTimeoutMs: undefined,
    printQRInTerminal: true,
    auth: state,
  });

  store.bind(bot.ev);

  if (pvx) {
    let usedDate = new Date()
      .toLocaleString("en-GB", { timeZone: "Asia/kolkata" })
      .split(",")[0];

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
        postTechNews(bot, 0);
        postStudyInfo(bot, 0);
      }

      // if (hour % 12 == 0) kickZeroMano(bot);

      if (usedDate !== todayDate) {
        usedDate = todayDate;
        checkTodayBday(bot, todayDate);
      }
    }, 1000 * 60 * 20); //20 min
  }

  // store.bind(bot.ev);

  const sendMessageWTyping = async (msg, jid) => {
    await bot.presenceSubscribe(jid);
    await delay(500);
    await bot.sendPresenceUpdate("composing", jid);
    await delay(2000);
    await bot.sendPresenceUpdate("paused", jid);
    await bot.sendMessage(jid, msg);
  };

  // bot.ev.on("chats.set", (item) =>
  //   console.log(`recv ${item.chats.length} chats (is latest: ${item.isLatest})`)
  // );
  // bot.ev.on("messages.set", (item) =>
  //   console.log(
  //     `recv ${item.messages.length} messages (is latest: ${item.isLatest})`
  //   )
  // );
  // bot.ev.on("contacts.set", (item) =>
  //   console.log(`recv ${item.contacts.length} contacts`)
  // );

  //---------------------------------------group-participants.update-----------------------------------------//
  bot.ev.on("group-participants.update", async (msg) => {
    try {
      let from = msg.id;
      const groupMetadata = await bot.groupMetadata(from);
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
          await bot.sendMessage(from, {
            text: `*─「 🔥 <{PVX}> BOT 🔥 」─* \n\nOnly +91 numbers are allowed !!!!`,
          });
          await bot.groupParticipantsUpdate(from, [numJid], "remove");

          await bot.sendMessage(myNumber + "@s.whatsapp.net", {
            text: `${num_split} is removed from ${groupSubject}. Not 91!`,
          });
          return;
        }

        //if number is blacklisted
        let blacklistRes = await getBlacklist();
        blacklistRes = blacklistRes.map((num) => num.number);
        // console.log(blacklistRes);
        if (blacklistRes.includes(num_split)) {
          await bot.sendMessage(from, {
            text: `*─「 🔥 <{PVX}> BOT 🔥 」─* \n\nNumber is blacklisted !!!!`,
          });

          await bot.groupParticipantsUpdate(from, [numJid], "remove");
          await bot.sendMessage(myNumber + "@s.whatsapp.net", {
            text: `${num_split} is removed from ${groupSubject}. Blacklisted!`,
          });
          return;
        }

        //for study group
        if (from === pvxstudy) {
          await bot.sendMessage(from, {
            text: `Welcome @${num_split} to PVX Study group.\nhttps://pvxcommunity.com/\n\nKindly fill the Biodata form (mandatory for all)\n\n👇🏻👇🏻👇🏻👇🏻👇🏻\nhttps://forms.gle/uuvUwV5fTk8JAjoTA`,
            mentions: [numJid],
          });
        }

        //for movies group
        if (from === pvxmovies) {
          await bot.sendMessage(from, {
            text: `Welcome @${num_split} to PVX Movies.\nhttps://pvxcommunity.com/\n\nWhat are your currently watching..?`,
            mentions: [numJid],
          });
        }

        //for community group
        if (from === pvxcommunity) {
          await bot.sendMessage(from, {
            text: `Welcome @${num_split} to PVX COMMUNITY.\nhttps://pvxcommunity.com/\n\nSend ${prefix}rules to know all PVX rules.\nIf you're new to PVX, please share how did you find us.`,
            mentions: [numJid],
          });
        }

        //for mano
        if (from === pvxmano) {
          await bot.sendMessage(from, {
            text: `Welcome  @${num_split} to PVX MANORANJAN 🔥\n\n1) Send videos regularly especially new members.\n2) Don't Send CP or any other illegal videos.\n 3) A group bot will be counting the number of videos you've sent.\nSend ${prefix}pvxv to know video count.\nInactive members will be kicked time to time.`,
            mentions: [numJid],
          });
        }

        //for programmer group
        if (from === pvxprogrammer) {
          await bot.sendMessage(from, {
            text: `Welcome @${num_split} to PVX Programmers Group.\nhttps://pvxcommunity.com/\n\n*Kindly give your intro like*\nName:\nCollege/Degree:\nInterest:\nSkills:\nCompany(if working):`,
            mentions: [numJid],
          });
        }

        if (from === pvxsticker1 || from === pvxsticker2) {
          await bot.sendMessage(from, {
            text: `Welcome @${num_split} to PVX Stickers\nhttps://pvxcommunity.com/\n\n1) Don't make any type of sticker that targets any caste, community, religion, sex, creed, etc.\n2) The use of any kind of 18+ media (be it nudes or semi nudes) is not allowed.\n3) Every sticker you make here gets PVX branding in it along with website, so You'll get instant ban on disobeying any rule`,
            mentions: [numJid],
          });
        }

        let botNumberJid = bot.user.id; //'1506xxxxx54:3@s.whatsapp.net'
        botNumberJid =
          botNumberJid.slice(0, botNumberJid.search(":")) +
          botNumberJid.slice(botNumberJid.search("@"));
        if (numJid === botNumberJid) {
          console.log("Bot is added to new group!");
          await bot.sendMessage(myNumber + "@s.whatsapp.net", {
            text: `*─「 🔥 <{PVX}> BOT 🔥 」─* \n\nSEND ${prefix}help FOR BOT COMMANDS`,
          });
        }
        console.log(`[GROUP] ${groupSubject} [JOINED] ${numJid}`);
      }
      if (msg.action == "remove") {
        console.log(`[GROUP] ${groupSubject} [LEAVED] ${numJid}`);
      }
    } catch (err) {
      console.log(err);
      await bot.sendMessage(myNumber + "@s.whatsapp.net", {
        text: `ERROR: ${err}`,
      });
    }
  });

  bot.ev.on("messages.upsert", async (m) => {
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

      let botNumberJid = bot.user.id; //'1506xxxxx54:3@s.whatsapp.net'
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
      const groupMetadata = isGroup ? await bot.groupMetadata(from) : "";
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
        from !== pvxmano
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

        // WA_DEFAULT_EPHEMERAL = 604800 (7 days)
        // 86400 = 60x60x24 (1 day)
        await bot.sendMessage(pvxstickeronly1, await sticker.toMessage(), {
          ephemeralExpiration: 86400,
        });
        await bot.sendMessage(pvxstickeronly2, await sticker.toMessage(), {
          ephemeralExpiration: 86400,
        });

        console.log(`${countSent} sticker sent!`);
        countSent += 1;
      }

      if (!isCmd) return;

      let groupDesc;
      try {
        groupDesc = isGroup ? groupMetadata.desc.toString() : "";
      } catch {
        //when group description is empty
        groupDesc = "";
      }
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
        bot.sendMessage(from, { text }, { quoted: m.messages[0] });
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

      //CHECK IF COMMAND IF DISABLED FOR CURRENT GROUP OR NOT
      let resDisabled = await getDisableCommandData(from);
      if (resDisabled.includes(command)) {
        reply("❌ Command disabled for this group!");
        return;
      }

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
        await bot.sendMessage(myNumber + "@s.whatsapp.net", {
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
          bot.sendMessage(from, { text: response.message });
          reply("✔️ Match over! Stopping Cricket scores for this group !");
          console.log("Match over! Stopping Cricket scores for " + groupName);
          clearInterval(cricSetIntervalGroups[groupName]);
          cricStartedGroups[groupName] = false;
          return false;
        } else if (response.info === "IO") {
          bot.sendMessage(from, { text: response.message });
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
        bot.sendMessage(from, { text: response.message });
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
            bot,
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
              bot,
              m.messages[0],
              from,
              args,
              msgInfoObj
            );
            return;
          }
          await bot.sendMessage(
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
              bot,
              m.messages[0],
              from,
              args,
              msgInfoObj
            );
            return;
          }
          await bot.sendMessage(
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
              bot,
              m.messages[0],
              from,
              args,
              msgInfoObj
            );
            return;
          }
          await bot.sendMessage(
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
        await bot.sendMessage(myNumber + "@s.whatsapp.net", {
          text: `ERROR: [${prefix}${command}] [${groupName}]\n${err}`,
        });
      }

      /* ----------------------------- unknown command ---------------------------- */
      await bot.sendMessage(
        from,
        {
          text: `Send ${prefix}help for <{PVX}> BOT commands!`,
        },
        { quoted: m.messages[0] }
      );
    } catch (err) {
      console.log(err);
      await bot.sendMessage(myNumber + "@s.whatsapp.net", {
        text: `ERROR: [${prefix}${command}] [${groupName}]\n${err}`,
      });
      return;
    }
  });

  // bot.ev.on("messages.update", (m) => console.log(m));
  // bot.ev.on("message-receipt.update", (m) => console.log(m));
  // bot.ev.on("presence.update", (m) => console.log(m));
  // bot.ev.on("chats.update", (m) => console.log(m));
  // bot.ev.on("contacts.upsert", (m) => console.log(m));

  bot.ev.on("connection.update", (update) => {
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
        console.log("--- START SOCK COUNT -->", startCount);
        startBot();
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
  bot.ev.on("creds.update", async () => {
    saveState();
    await storeAuth(state);
  });

  return bot;
};

startBot();
