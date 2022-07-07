const {
  MessageType,
  Mimetype,
  downloadContentFromMessage,
} = require("@adiwajshing/baileys");
const { writeFile } = require("fs/promises");
const AdmZip = require("adm-zip");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");

module.exports.command = () => {
  let cmd = ["tg"];

  return { cmd, handler };
};

const getRandom = (ext) => {
  return `${Math.floor(Math.random() * 10000)}${ext}`;
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { prefix, reply, isTaggedDocument } = msgInfoObj;

  if (!isTaggedDocument) {
    reply(`❌ Send zip document file!`);
    return;
  }
  // https://t.me/tgstowebpbot <- animated 128px.zip
  // https://t.me/Stickerdownloadbot <- non-animated webp.zip
  const encmediatg =
    msg.message.extendedTextMessage.contextInfo.quotedMessage.documentMessage;

  console.log("downloading...");
  const stream = await downloadContentFromMessage(encmediatg, "document");
  let buffer = Buffer.from([]);
  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }
  // let buffer = await downloadContentFromMessage(encmediatg, "document");
  const media = getRandom(".zip");
  await writeFile(media, buffer);
  console.log("downloaded");
  // return;

  // reading zip
  let zip = new AdmZip(`./${media}`);
  // extracts everything
  zip.extractAllTo(`./`, true);
  let zipEntries = zip.getEntries(); // an array of ZipEntry records

  // let filestg = fs.readdirSync(dirNametg);
  let stickerCounttg = zipEntries.length;
  console.log("extracted: files " + stickerCounttg);

  reply(`✔ Sending all ${stickerCounttg} stickers`);
  let itg = -1;
  setIntervaltg = setInterval(async () => {
    itg += 1;

    //last file
    if (itg >= stickerCounttg - 1) {
      stickertg = false;
      clearInterval(setIntervaltg);
      reply(`✔ Finished!`);
    }
    console.log("Sending sticker ", itg);
    if (zipEntries[itg].entryName.endsWith(".webp")) {
      let filepath = `./`;
      //add slash of not present
      filepath += zipEntries[itg].entryName.startsWith("/") ? "" : "/";
      filepath += `${zipEntries[itg].entryName}`;

      const sticker = new Sticker(filepath, {
        pack: "BOT 🤖",
        author: "pvxcommunity.com",
        type: StickerTypes.DEFAULT,
        quality: 75,
      });
      await sock.sendMessage(from, await sticker.toMessage());
    }
  }, 0);
};
