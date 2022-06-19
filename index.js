/* --------------------------------- SERVER --------------------------------- */
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 80;
app.get("/", (req, res) => {
  res.send("Bot is running fine... no tension :)");
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
try {
  fs.unlinkSync("./auth_info_multi.json");
} catch {
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
          noiseKey: {
            private: data.noicekeyprvt,
            public: data.noicekeypub,
          },
          signedIdentityKey: {
            private: data.signedidentitykeyprvt,
            public: data.signedidentitykeypub,
          },
          signedPreKey: {
            keyPair: {
              private: data.signedprekeypairprv,
              public: data.signedprekeypairpub,
            },
            signature: data.signedprekeysignature,
            keyId: Number(data.signedprekeyidb),
          },
          registrationId: Number(data.registrationidb),
          advSecretKey: data.advsecretkeyb,
          nextPreKeyId: Number(data.nextprekeyidb),
          firstUnuploadedPreKeyId: Number(data.firstunuploadedprekeyidb),
          serverHasPreKeys: Boolean(data.serverhasprekeysb),
          account: {
            details: data.accountdetailsb,
            accountSignatureKey: data.accountsignaturekeyb,
            accountSignature: data.accountsignatureb,
            deviceSignature: data.devicesignatureb,
          },
          me: {
            id: data.meidb,
            verifiedName: data.meverifiednameb,
            name: data.menameb,
          },
          signalIdentities: [
            {
              identifier: {
                name: data.signalidentitiesnameb,
                deviceId: Number(data.signalidentitiesdeviceidb),
              },
              identifierKey: data.signalidentitieskey,
            },
          ],
          lastAccountSyncTimestamp: 0, // To allow bot to read the messages
          // lastAccountSyncTimestamp: Number(data.lastaccountsynctimestampb),
          myAppStateKeyId: data.myappstatekeyidb,
        },
        keys: state.keys,
      };
      //---------------noiceKey----------------//
      let noiceKeyPrvt = [],
        noiceKeyPub = [];
      let noiceKeyPrvtB = cred.creds.noiseKey.private.slice(1).split("+");
      let noiceKeyPubB = cred.creds.noiseKey.public.slice(1).split("+");
      for (let i = 0; i < noiceKeyPrvtB.length; i++) {
        noiceKeyPrvt.push(parseInt(noiceKeyPrvtB[i]));
      }
      for (let i = 0; i < noiceKeyPubB.length; i++) {
        noiceKeyPub.push(parseInt(noiceKeyPubB[i]));
      }
      cred.creds.noiseKey.private = Buffer.from(noiceKeyPrvt);
      cred.creds.noiseKey.public = Buffer.from(noiceKeyPub);
      //------------------------------------------//
      //----------------signedIdentityKey---------//
      let signedIdentityKeyPrvt = [],
        signedIdentityKeyPub = [];
      let signedIdentityKeyPrvtB = cred.creds.signedIdentityKey.private
        .slice(1)
        .split("+");
      let signedIdentityKeyPubB = cred.creds.signedIdentityKey.public
        .slice(1)
        .split("+");
      for (let i = 0; i < signedIdentityKeyPrvtB.length; i++) {
        signedIdentityKeyPrvt.push(parseInt(signedIdentityKeyPrvtB[i]));
      }
      for (let i = 0; i < signedIdentityKeyPubB.length; i++) {
        signedIdentityKeyPub.push(parseInt(signedIdentityKeyPubB[i]));
      }
      cred.creds.signedIdentityKey.private = Buffer.from(signedIdentityKeyPrvt);
      cred.creds.signedIdentityKey.public = Buffer.from(signedIdentityKeyPub);
      //------------------------------------------//
      //----------------signedPreKey------------------//
      let signedPreKeyPairPrv = [],
        signedPreKeyPairPub = [];
      let signedPreKeyPairPrvB = cred.creds.signedPreKey.keyPair.private
        .slice(1)
        .split("+");
      let signedPreKeyPairPubB = cred.creds.signedPreKey.keyPair.public
        .slice(1)
        .split("+");
      for (let i = 0; i < signedPreKeyPairPrvB.length; i++) {
        signedPreKeyPairPrv.push(parseInt(signedPreKeyPairPrvB[i]));
      }
      for (let i = 0; i < signedPreKeyPairPubB.length; i++) {
        signedPreKeyPairPub.push(parseInt(signedPreKeyPairPubB[i]));
      }
      cred.creds.signedPreKey.keyPair.private =
        Buffer.from(signedPreKeyPairPrv);
      cred.creds.signedPreKey.keyPair.public = Buffer.from(signedPreKeyPairPub);
      //------------------------------------------//
      let signedPreKeySignature = [];
      let signedPreKeySignatureB = cred.creds.signedPreKey.signature
        .slice(1)
        .split("+");
      for (let i = 0; i < signedPreKeySignatureB.length; i++) {
        signedPreKeySignature.push(parseInt(signedPreKeySignatureB[i]));
      }
      cred.creds.signedPreKey.signature = Buffer.from(signedPreKeySignature);
      //-----------------------------------------------//
      //---------------------------signalIdentities-----//
      let signalIdentitiesKey = [];
      let signalIdentitiesKeyB = cred.creds.signalIdentities[0].identifierKey
        .slice(1)
        .split("+");
      for (let i = 0; i < signalIdentitiesKeyB.length; i++) {
        signalIdentitiesKey.push(parseInt(signalIdentitiesKeyB[i]));
      }
      cred.creds.signalIdentities[0].identifierKey =
        Buffer.from(signalIdentitiesKey);
      // console.log("Auth : ", cred.creds.signalIdentities);
      //---------------------------------------------------//
    }
  } catch (err) {
    console.log("Creating database..."); //if login fail create a db
    await db.query(
      "CREATE TABLE auth(noiceKeyPrvt text, noiceKeyPub text, signedIdentityKeyPrvt text, signedIdentityKeyPub text, signedPreKeyPairPrv text, signedPreKeyPairPub text, signedPreKeySignature text, signedPreKeyIdB text, registrationIdB text, advSecretKeyB text, nextPreKeyIdB text, firstUnuploadedPreKeyIdB text, serverHasPreKeysB text, accountdetailsB text, accountSignatureKeyB text, accountSignatureB text, deviceSignatureB text, meIdB text, meverifiedNameB text, menameB text, signalIdentitiesNameB text, signalIdentitiesDeviceIDB text, signalIdentitiesKey text, lastAccountSyncTimestampB text, myAppStateKeyIdB text);"
    );
    await fetchauth();
  }
}

/* -------------------------- Extra package include ------------------------- */
const fs = require("fs");
const util = require("util");

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

let countSent = 1;

let pvxcommunity = "919557666582-1467533860@g.us";
let pvxprogrammer = "919557666582-1584193120@g.us";
let pvxadmin = "919557666582-1498394056@g.us";
let pvxstudy = "919557666582-1617595892@g.us";
let pvxmano = "19016677357-1630334490@g.us";
let pvxtech = "919557666582-1551290369@g.us";
let pvxsport = "919557666582-1559476348@g.us";
let pvxmovies = "919557666582-1506690003@g.us";
let pvxstickeronly1 = "919557666582-1628610549@g.us";
let pvxstickeronly2 = "919557666582-1586018947@g.us";
let pvxstickeronly3 = "919557666582-1608216809@g.us";
let mano = "19016677357-1630334490@g.us";
let pvxdeals = "919557666582-1582555632@g.us";

const addCommands = async () => {
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

const startSock = async () => {
  addCommands();

  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`using WA v${version.join(".")}, isLatest: ${isLatest}`);
  let noLogs = P({ level: "silent" }); //to hide the chat logs
  await fetchauth();
  if (auth_row_count == 0);
  else {
    state.creds = cred.creds;
  }
  const sock = makeWASocket({
    version,
    logger: noLogs,
    defaultQueryTimeoutMs: undefined,
    printQRInTerminal: true,
    auth: state,
  });

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
      // let blacklistRes = await getBlacklist();
      // blacklistRes = blacklistRes.map((num) => num.number);
      // console.log(blacklistRes);

      let numJid = msg.participants[0];
      let num_split = `${numJid.split("@s.whatsapp.net")[0]}`;

      if (msg.action == "add") {
        // other than 91 are blocked from joining when description have written in first line -> only91
        if (
          !num_split.startsWith(91) &&
          blockCommandsInDesc.includes("only91")
        ) {
          await sock.sendMessage(from, {
            text: `*─「 🔥 <{PVX}> BOT 🔥 」─* \n\nOnly 91 numbers are allowed !!!!`,
          });
          await sock.groupParticipantsUpdate(from, [numJid], "remove");

          await sock.sendMessage(myNumber + "@s.whatsapp.net", {
            text: `${num_split} is removed from ${groupSubject}. Not 91!`,
          });
          return;
        }

        //if number is blacklisted
        // if (blacklistRes.includes(num_split)) {
        //   conn.sendMessage(
        //     from,
        //     `*─「 🔥 <{PVX}> BOT 🔥 」─* \n\nNumber is blacklisted !!!!`,
        //     MessageType.text
        //   );
        //   conn.groupRemove(from, msg.participants);
        //   conn.sendMessage(
        //     myNumber + "@s.whatsapp.net",
        //     `${num_split} is removed from ${groupSubject}. Blacklisted!`,
        //     MessageType.text
        //   );
        //   return;
        // }

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
            text: `Welcome @${num_split} to PVX COMMUNITY.\nhttps://pvxcommunity.com/\n\nPlease follow the rules. Send ${prefix}rules to know all rules of PVX\nBe active and Don't spam`,
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

        let botNumberJid = sock.user.id; //'1506xxxxx54:3@s.whatsapp.net'
        botNumberJid =
          botNumberJid.slice(0, botNumberJid.search(":")) +
          botNumberJid.slice(botNumberJid.search("@"));
        if (numJid === botNumberJid) {
          console.log("Bot is added to new group!");
          await sock.sendMessage(myNumber + "@s.whatsapp.net", {
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
        from != pvxstickeronly3 &&
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
        from != pvxstickeronly3 &&
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
        groupName,
        groupDesc,
        groupMembers,
        groupAdmins,
        isBotGroupAdmins,
        isMedia,
        type,
        isTaggedImage,
        isTaggedVideo,
        isTaggedSticker,
        botNumberJid,
      };

      // send every command info to my whatsapp, won't work when i send something for bot
      if (myNumber && myNumber + "@s.whatsapp.net" !== sender) {
        await sock.sendMessage(myNumber + "@s.whatsapp.net", {
          text: `${0}) [${prefix}${command}] [${groupName}]`,
        });
      }

      //using 'm.messages[0]' to tag message, by giving 'msg' throw some error

      /* ----------------------------- public commands ---------------------------- */
      if (commandsPublic[command]) {
        commandsPublic[command](sock, m.messages[0], from, args, msgInfoObj);
        return;
      }

      /* ------------------------- group members commands ------------------------- */
      if (commandsMembers[command]) {
        if (isGroup) {
          commandsMembers[command](sock, m.messages[0], from, args, msgInfoObj);
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
          commandsAdmins[command](sock, m.messages[0], from, args, msgInfoObj);
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
          commandsOwners[command](sock, m.messages[0], from, args, msgInfoObj);
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

      /* ----------------------------- unknown command ---------------------------- */
      await sock.sendMessage(
        from,
        {
          text: `Send ${prefix}help for <{PVX}> BOT commands!\n\nThis is a new bot of multi device, so many old commands are not available right now.`,
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
        startSock();
      } else {
        console.log("Connection closed. You are logged out.");
      }
    }

    if (connection === "open") {
      console.log("Connected");
      try {
        //---------------noiceKey----------------//
        let noiceKeyPrvt = "",
          noiceKeyPub = "";
        let noiceKeyPrvtB = state.creds.noiseKey.private.toJSON().data;
        let noiceKeyPubB = state.creds.noiseKey.public.toJSON().data;
        for (let i = 0; i < noiceKeyPrvtB.length; i++) {
          noiceKeyPrvt += "+" + noiceKeyPrvtB[i].toString();
        }
        for (let i = 0; i < noiceKeyPubB.length; i++) {
          noiceKeyPub += "+" + noiceKeyPubB[i].toString();
        }
        //------------------------------------------//
        //----------------signedIdentityKey---------//
        let signedIdentityKeyPrvt = "",
          signedIdentityKeyPub = "";
        let signedIdentityKeyPrvtB =
          state.creds.signedIdentityKey.private.toJSON().data;
        let signedIdentityKeyPubB =
          state.creds.signedIdentityKey.public.toJSON().data;
        for (let i = 0; i < signedIdentityKeyPrvtB.length; i++) {
          signedIdentityKeyPrvt += "+" + signedIdentityKeyPrvtB[i].toString();
        }
        for (let i = 0; i < signedIdentityKeyPubB.length; i++) {
          signedIdentityKeyPub += "+" + signedIdentityKeyPubB[i].toString();
        }
        //------------------------------------------//
        //----------------signedPreKeyPair--------------//
        let signedPreKeyPairPrv = "",
          signedPreKeyPairPub = "";
        let signedPreKeyPairPrvB = state.creds.signedPreKey.keyPair.private;
        let signedPreKeyPairPubB = state.creds.signedPreKey.keyPair.public;
        for (let i = 0; i < signedPreKeyPairPrvB.length; i++) {
          signedPreKeyPairPrv += "+" + signedPreKeyPairPrvB[i].toString();
        }
        for (let i = 0; i < signedPreKeyPairPubB.length; i++) {
          signedPreKeyPairPub += "+" + signedPreKeyPairPubB[i].toString();
        }
        //------------------------------------------//
        //------------------signedPreKeySignature**---//
        let signedPreKeySignature = "";
        let signedPreKeySignatureB = state.creds.signedPreKey.signature;
        for (let i = 0; i < signedPreKeySignatureB.length; i++) {
          signedPreKeySignature += "+" + signedPreKeySignatureB[i].toString();
        }
        let signedPreKeyIdB = state.creds.signedPreKey.keyId;
        //---------------------------------------------//
        //------------------AutoKeys--------------------//
        let registrationIdB = state.creds.registrationId;
        let advSecretKeyB = state.creds.advSecretKey;
        let nextPreKeyIdB = state.creds.nextPreKeyId;
        let firstUnuploadedPreKeyIdB = state.creds.firstUnuploadedPreKeyId;
        let serverHasPreKeysB = state.creds.serverHasPreKeys;
        //-----------------------------------------------//
        //---------------------account-----------------//
        let accountdetailsB = state.creds.account.details;
        let accountSignatureKeyB = state.creds.account.accountSignatureKey;
        let accountSignatureB = state.creds.account.accountSignature;
        let deviceSignatureB = state.creds.account.deviceSignature;
        //----------------------ME------------------------//
        let meIdB = state.creds.me.id;
        let meverifiedNameB = state.creds.me.verifiedName;
        let menameB = state.creds.me.name;
        //--------------------------------------------------//
        //----------------------signalIdentities------------//
        let signalIdentitiesNameB =
          state.creds.signalIdentities[0].identifier.name;
        let signalIdentitiesDeviceIDB =
          state.creds.signalIdentities[0].identifier.deviceId;
        let signalIdentitiesKey = "";
        let signalIdentitiesKeyB =
          state.creds.signalIdentities[0].identifierKey.toJSON().data;
        for (let i = 0; i < signalIdentitiesKeyB.length; i++) {
          signalIdentitiesKey += "+" + signalIdentitiesKeyB[i].toString();
        }
        //----------------------------------------------------//
        let lastAccountSyncTimestampB = state.creds.lastAccountSyncTimestamp;
        let myAppStateKeyIdB = state.creds.myAppStateKeyId;
        // INSERT / UPDATE LOGIN DATA
        if (auth_row_count == 0) {
          console.log("Inserting login data...");
          db.query(
            "INSERT INTO auth VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25);",
            [
              noiceKeyPrvt,
              noiceKeyPub,
              signedIdentityKeyPrvt,
              signedIdentityKeyPub,
              signedPreKeyPairPrv,
              signedPreKeyPairPub,
              signedPreKeySignature,
              signedPreKeyIdB,
              registrationIdB,
              advSecretKeyB,
              nextPreKeyIdB,
              firstUnuploadedPreKeyIdB,
              serverHasPreKeysB,
              accountdetailsB,
              accountSignatureKeyB,
              accountSignatureB,
              deviceSignatureB,
              meIdB,
              meverifiedNameB,
              menameB,
              signalIdentitiesNameB,
              signalIdentitiesDeviceIDB,
              signalIdentitiesKey,
              lastAccountSyncTimestampB,
              myAppStateKeyIdB,
            ]
          );
          db.query("commit;");
          console.log("New login data inserted!");
        } else {
          console.log("Updating login data....");
          db.query(
            "UPDATE auth SET noiceKeyPrvt = $1, noiceKeyPub = $2, signedIdentityKeyPrvt = $3, signedIdentityKeyPub = $4, signedPreKeyPairPrv = $5, signedPreKeyPairPub = $6, signedPreKeySignature = $7, signedPreKeyIdB = $8, registrationIdB = $9, advSecretKeyB = $10, nextPreKeyIdB = $11, firstUnuploadedPreKeyIdB = $12, serverHasPreKeysB = $13, accountdetailsB = $14, accountSignatureKeyB = $15, accountSignatureB = $16, deviceSignatureB = $17, meIdB = $18, meverifiedNameB =$19, menameB =$20, signalIdentitiesNameB =$21, signalIdentitiesDeviceIDB =$22, signalIdentitiesKey =$23, lastAccountSyncTimestampB =$24, myAppStateKeyIdB =$25;",
            [
              noiceKeyPrvt,
              noiceKeyPub,
              signedIdentityKeyPrvt,
              signedIdentityKeyPub,
              signedPreKeyPairPrv,
              signedPreKeyPairPub,
              signedPreKeySignature,
              signedPreKeyIdB,
              registrationIdB,
              advSecretKeyB,
              nextPreKeyIdB,
              firstUnuploadedPreKeyIdB,
              serverHasPreKeysB,
              accountdetailsB,
              accountSignatureKeyB,
              accountSignatureB,
              deviceSignatureB,
              meIdB,
              meverifiedNameB,
              menameB,
              signalIdentitiesNameB,
              signalIdentitiesDeviceIDB,
              signalIdentitiesKey,
              lastAccountSyncTimestampB,
              myAppStateKeyIdB,
            ]
          );
          db.query("commit;");
          console.log("Login data updated!");
        }
      } catch {}
    }

    console.log("connection update", update);
  });
  // listen for when the auth credentials is updated
  // sock.ev.on("creds.update", saveState);
  // return sock;
};

startSock();
