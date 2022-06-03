const {
  MessageType,
  Mimetype,
  downloadContentFromMessage,
} = require("@adiwajshing/baileys");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const {
  Sticker,
  createSticker,
  StickerTypes,
} = require("wa-sticker-formatter");
const { writeFile } = require("fs/promises");

module.exports.command = () => {
  let cmd = ["sticker", "s"];

  return { cmd, handler };
};

const getRandom = (ext) => {
  return `${Math.floor(Math.random() * 10000)}${ext}`;
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { prefix, isMedia, isTaggedImage, isTaggedVideo } = msgInfoObj;

  if (isMedia || isTaggedImage || isTaggedVideo) {
    let packName = "BOT 🤖";
    let authorName = "pvxcommunity.com";

    let downloadFilePath;
    if (msg.message.imageMessage) {
      downloadFilePath = msg.message.imageMessage;
    } else {
      //tagged image
      downloadFilePath =
        msg.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage;
    }
    const stream = await downloadContentFromMessage(downloadFilePath, "image");
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    const media = getRandom(".jpeg");
    await writeFile(media, buffer);
    (async () => {
      const sticker1 = new Sticker(media, {
        pack: packName, // The pack name
        author: authorName, // The author name
        type:
          args.includes("crop") || args.includes("c")
            ? StickerTypes.CROPPED
            : StickerTypes.FULL,
        quality: 100,
      });
      const saveSticker = getRandom(".webp");
      await sticker1.toFile(saveSticker);
      await sock.sendMessage(from, {
        sticker: fs.readFileSync(saveSticker),
      });
      fs.unlinkSync(media);
      fs.unlinkSync(saveSticker);
    })();
  } else if (
    (isMedia && msg.message.videoMessage.seconds < 11) ||
    (isTaggedVideo &&
      msg.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage
        .seconds < 11)
  ) {
    let downloadFilePath;
    if (msg.message.videoMessage) {
      downloadFilePath = msg.message.videoMessage;
    } else {
      downloadFilePath =
        msg.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage;
    }
    const stream = await downloadContentFromMessage(downloadFilePath, "video");
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    const media = getRandom(".mp4");
    await writeFile(media, buffer);
    (async () => {
      const sticker1 = new Sticker(media, {
        pack: packName, // The pack name
        author: authorName, // The author name
        type:
          args.includes("crop") || args.includes("c")
            ? StickerTypes.CROPPED
            : StickerTypes.FULL,
        quality: 40,
      });
      const saveSticker = getRandom(".webp");
      await sticker1.toFile(saveSticker);
      await sock.sendMessage(from, {
        sticker: fs.readFileSync(saveSticker),
      });
      try {
        fs.unlinkSync(media);
        fs.unlinkSync(saveSticker);
      } catch {
        console.log("error");
      }
    })();
  } else {
    console.log(msg);
    await sock.sendMessage(
      from,
      {
        text: "❌ Give a media to convert into sticker!",
      },
      { quoted: msg }
    );
  }
};
