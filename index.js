/* --------------------------------- SERVER --------------------------------- */
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
const port = process.env.PORT || 8080;
app.get("/", (req, res) => {
  // res.send("Bot is running");
  console.log("Get request to /");
  res.sendFile(__dirname + "/index.html");
});

/* -------------------------- delete auth from url -------------------------- */
const authHiddenPath = process.env.authHiddenPath; //to have a hidden path for auth db deletion
const { dropAuth } = require("./db/dropauthDB");
app.get("/" + authHiddenPath, async (req, res) => {
  console.log("Get request to /" + authHiddenPath);
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
  delay,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  isJidBroadcast,
} = require("@adiwajshing/baileys");
const pino = require("pino");
const fs = require("fs");
const NodeCache = require("node-cache");
const cache = new NodeCache();
const msgRetryCounterMap = {};

// start a connection
// console.log('state : ', state.creds);

/* ----------------------------- add local files ---------------------------- */
const { setCountMember } = require("./db/countMemberDB");
const { setCountVideo } = require("./db/countVideoDB");
const { getDisableCommandData } = require("./db/disableCommandDB");
const { postStudyInfo } = require("./functions/postStudyInfo");
const { postTechNews } = require("./functions/postTechNews");
const { checkTodayBday } = require("./functions/checkTodayBday");
const { storeAuth, fetchAuth } = require("./db/authDB");
const { getGroupAdmins } = require("./functions/getGroupAdmins");
const { addCommands } = require("./functions/addCommands");
const { LoggerBot, LoggerTg } = require("./functions/loggerBot");
const { forwardSticker } = require("./functions/forwardSticker");
const { memberAddCheck } = require("./functions/memberAddCheck");

require("dotenv").config();
const myNumber = process.env.myNumber;
const pvx = process.env.pvx;

const prefix = "!";

let commandSent = 1;
let startCount = 1;
let dateCheckerInterval;

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

try {
  fs.rmSync("./auth_info_multi.json", { recursive: true, force: true });
  // fs.unlinkSync("./auth_info_multi.json");
} catch (err) {
  console.log("Local auth file already deleted");
}

// if (pvx) {
//   setTimeout(() => {
//     throw new Error("To restart app");
//   }, 1000 * 60 * 60 * 1); //1 hour
// }

const startBot = async () => {
  console.log(`[STARTING BOT]: ${startCount}`);
  LoggerTg(`[STARTING BOT]: ${startCount}`);
  try {
    const { state, saveCreds } = await useMultiFileAuthState(
      "./auth_info_multi.json"
    );

    const { commandsPublic, commandsMembers, commandsAdmins, commandsOwners } =
      await addCommands();
    clearInterval(dateCheckerInterval);

    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`using WA v${version.join(".")}, isLatest: ${isLatest}`);

    let silentLogs = pino({ level: "silent" }); //to hide the chat logs
    let debugLogs = pino({ level: "debug" });

    //Fetch login auth
    const { cred, auth_row_count } = await fetchAuth(state);
    if (auth_row_count != 0) {
      state.creds = cred.creds;
    }
    const bot = makeWASocket({
      version,
      logger: silentLogs,
      printQRInTerminal: true,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, silentLogs),
      },
      msgRetryCounterMap,
      generateHighQualityLinkPreview: true,
      shouldIgnoreJid: (jid) => isJidBroadcast(jid),
      // implement to handle retries
      getMessage: async (key) => {
        if (store) {
          const msg = await store.loadMessage(key.remoteJid, key.id);
          return msg.message ? msg.message : undefined;
        }

        // only if store is present
        return {
          conversation: "hello",
        };
      },
    });

    if (pvx) {
      let usedDate = new Date()
        .toLocaleString("en-GB", { timeZone: "Asia/kolkata" })
        .split(",")[0];

      dateCheckerInterval = setInterval(async () => {
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
          await postTechNews(bot, 0);
          await postStudyInfo(bot, 0);
        }

        // if (hour % 12 == 0) kickZeroMano(bot);

        if (usedDate !== todayDate) {
          usedDate = todayDate;
          checkTodayBday(bot, todayDate);
        }
      }, 1000 * 60 * 20); //20 min
    }

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

    let botNumberJid = bot.user ? bot.user.id : ""; //'1506xxxxx54:3@s.whatsapp.net'
    botNumberJid =
      botNumberJid.slice(0, botNumberJid.search(":")) +
      botNumberJid.slice(botNumberJid.search("@"));

    bot.ev.on("groups.upsert", async (msg) => {
      //new group added
      try {
        console.log("[groups.upsert]");
        const from = msg[0].id;
        cache.del(from + ":groupMetadata");

        await bot.sendMessage(from, {
          text: `*─「 🔥 <{PVX}> BOT 🔥 」─* \n\nSEND ${prefix}help FOR BOT COMMANDS`,
        });
      } catch (err) {
        await LoggerBot(bot, "groups.upsert", err, msg);
      }
    });

    bot.ev.on("groups.update", async (msg) => {
      //subject change, etc
      try {
        console.log("[groups.update]");
        const from = msg[0].id;
        cache.del(from + ":groupMetadata");
      } catch (err) {
        await LoggerBot(bot, "groups.update", err, msg);
      }
    });

    //---------------------------------------group-participants.update-----------------------------------------//
    bot.ev.on("group-participants.update", async (msg) => {
      console.log("[group-participants.update]");
      try {
        let from = msg.id;
        cache.del(from + ":groupMetadata");
        const groupMetadata = await bot.groupMetadata(from);
        let groupSubject = groupMetadata.subject;

        let numJid = msg.participants[0];
        let num_split = `${numJid.split("@s.whatsapp.net")[0]}`;

        if (msg.action == "add") {
          await memberAddCheck(bot, from, num_split, numJid, groupSubject);
        }
        if (msg.action == "remove") {
          console.log(`[GROUP] ${groupSubject} [LEAVED] ${numJid}`);
        }
      } catch (err) {
        await LoggerBot(bot, "group-participants.update", err, msg);
      }
    });

    bot.ev.on("messages.upsert", async (m) => {
      // console.log("m", JSON.stringify(m, undefined, 2));
      // console.log(m.messages);
      try {
        const msg = JSON.parse(JSON.stringify(m)).messages[0];
        // console.log("msg", msg);
        if (msg.key && msg.key.remoteJid == "status@broadcast") return;
        if (!msg.message) return; //when demote, add, remove, etc happen then msg.message is not there

        const content = JSON.stringify(msg.message);
        const from = msg.key.remoteJid;
        // console.log(msg);
        // let type = Object.keys(msg.message)[0];
        // if (type === "senderKeyDistributionMessage") {
        //   type = Object.keys(msg.message)[1];
        // }
        const type = msg.message.conversation
          ? "conversation"
          : msg.message.reactionMessage
          ? "reactionMessage"
          : msg.message.imageMessage
          ? "imageMessage"
          : msg.message.videoMessage
          ? "videoMessage"
          : msg.message.extendedTextMessage
          ? "extendedTextMessage"
          : msg.message.stickerMessage
          ? "stickerMessage"
          : msg.message.documentMessage
          ? "documentMessage"
          : msg.message.ephemeralMessage
          ? "ephemeralMessage"
          : msg.message.protocolMessage
          ? "protocolMessage"
          : msg.message.senderKeyDistributionMessage
          ? "senderKeyDistributionMessage"
          : "";
        //ephemeralMessage are from disappearing chat

        //body will have the text message
        let body =
          type === "conversation"
            ? msg.message.conversation
            : type === "reactionMessage" && msg.message.reactionMessage.text
            ? msg.message.reactionMessage.text
            : type == "imageMessage" && msg.message.imageMessage.caption
            ? msg.message.imageMessage.caption
            : type == "videoMessage" && msg.message.videoMessage.caption
            ? msg.message.videoMessage.caption
            : type == "extendedTextMessage" &&
              msg.message.extendedTextMessage.text
            ? msg.message.extendedTextMessage.text
            : "";
        // console.log(body);

        const isGroup = from.endsWith("@g.us");

        let groupMetadata = "";
        if (isGroup) {
          groupMetadata = cache.get(from + ":groupMetadata");
          if (!groupMetadata) {
            groupMetadata = await bot.groupMetadata(from);
            const success = cache.set(
              from + ":groupMetadata",
              groupMetadata,
              60 * 30
            );
          }
        }

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
          await forwardSticker(bot, msg);
        }

        const messageLog =
          "[MESSAGE] " +
          (body ? body.substr(0, 30) : type) +
          " [FROM] " +
          sender.split("@")[0] +
          " [IN] " +
          (groupName || from);
        console.log(messageLog);

        // if (pvx && from === pvxcommunity && type !== "reactionMessage") {
        // fs.appendFile(
        //   "./message.txt",
        //   "\n" + JSON.stringify(msg.message) + "\n",
        //   "utf-8",
        //   function (err) {
        //     if (err) console.log(err);
        //   }
        // );
        // fs.appendFile("./message.txt", messageLog + "\n", "utf-8", function (err) {
        //   if (err) console.log(err);
        // });
        // let msgLogForTg =
        //   (body ? body.substr(0, 40) : type) +
        //   `\n[${senderName}] ` +
        //   sender.split("@")[0];
        // LoggerTg(msgLogForTg);
        // }

        const isCmd = body.startsWith(prefix);
        if (!isCmd) return;

        if (body[1] == " ") body = body[0] + body.slice(2); //remove space when space btw prefix and commandName like "! help"
        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase();
        const args = body.trim().split(/ +/).slice(1);

        // Display every command info
        console.log(
          "[COMMAND]",
          command,
          "[FROM]",
          sender.split("@")[0],
          "[IN]",
          groupName || from
        );

        const groupDesc =
          isGroup && groupMetadata.desc ? groupMetadata.desc.toString() : "";
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

        const reply = async (text) => {
          await bot.sendMessage(from, { text }, { quoted: m.messages[0] });
        };

        //CHECK IF COMMAND IF DISABLED FOR CURRENT GROUP OR NOT
        let resDisabled = [];
        if (isGroup) {
          resDisabled = cache.get(from + ":resDisabled");
          if (!resDisabled) {
            resDisabled = await getDisableCommandData(from);
            const success = cache.set(from + ":resDisabled", resDisabled, 60);
          }
        }
        if (resDisabled.includes(command)) {
          await reply("❌ Command disabled for this group!");
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
          command,
        };

        // send every command info to my whatsapp, won't work when i send something for bot
        if (myNumber && myNumber + "@s.whatsapp.net" !== sender) {
          await bot.sendMessage(myNumber + "@s.whatsapp.net", {
            text: `${commandSent}) [${prefix}${command}] [${groupName}]`,
          });
          ++commandSent;
        }

        switch (command) {
          case "test":
            if (myNumber + "@s.whatsapp.net" !== sender) {
              await reply(`❌ Command only for owner for bot testing purpose!`);
              return;
            }

            if (args.length === 0) {
              await reply(`❌ empty query!`);
              return;
            }
            try {
              let resultTest = eval(args[0]);
              if (typeof resultTest === "object")
                await reply(JSON.stringify(resultTest));
              else await reply(resultTest.toString());
            } catch (err) {
              await reply(err.stack);
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
              await reply("❌ Group command only!");
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
          await reply(err.stack);
          await LoggerBot(bot, `COMMAND-ERROR in ${groupName}`, err, msg);
          return;
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
        await LoggerBot(bot, "messages.upsert", err, msg);
      }
    });

    bot.ev.on("connection.update", async (update) => {
      try {
        LoggerTg(`connection.update: ${JSON.stringify(update)}`);
        const { connection, lastDisconnect } = update;
        if (connection === "open") {
          console.log("Connected");
          await bot.sendMessage(myNumber + "@s.whatsapp.net", {
            text: `[BOT STARTED] - ${startCount}`,
          });
        } else if (connection === "close") {
          // reconnect if not logged out
          if (
            (lastDisconnect.error &&
              lastDisconnect.error.output &&
              lastDisconnect.error.output.statusCode) !==
            DisconnectReason.loggedOut
          ) {
            await LoggerBot(
              false,
              "CONNECTION-CLOSED",
              lastDisconnect.error,
              update
            );
            ++startCount;
            startBot();
          } else {
            LoggerTg(`[CONNECTION-CLOSED]: You are logged out`);
            console.log("[CONNECTION-CLOSED]: You are logged out");
          }
        }

        console.log("connection update", update);
      } catch (err) {
        await LoggerBot(false, "connection.update", err, msg);
      }
    });
    // listen for when the auth credentials is updated
    bot.ev.on("creds.update", async () => {
      try {
        await saveCreds();
        await storeAuth(state);
      } catch (err) {
        await LoggerBot(false, "creds.update", err, msg);
      }
    });

    return bot;
  } catch (err) {
    await LoggerBot(false, "BOT-ERROR", err, "");
  }
};

startBot();
