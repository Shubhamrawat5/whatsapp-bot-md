const {
  MessageType,
  Mimetype,
  downloadContentFromMessage,
} = require("@adiwajshing/baileys");
const fs = require("fs");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");

module.exports.command = () => {
  let cmd = ["sticker", "s"];

  return { cmd, handler };
};

const getRandom = (ext) => {
  return `${Math.floor(Math.random() * 10000)}${ext}`;
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { prefix, isMedia, isTaggedImage, isTaggedVideo } = msgInfoObj;
  try {
    if (isMedia || isTaggedImage || isTaggedVideo) {
      let packName = "BOT 🤖";
      let authorName = "pvxcommunity.com";
      const saveSticker = getRandom(".webp");

      let downloadFilePath;
      if (msg.message.imageMessage) {
        downloadFilePath = msg.message.imageMessage;
      } else {
        //tagged image
        downloadFilePath =
          msg.message.extendedTextMessage.contextInfo.quotedMessage
            .imageMessage;
      }
      //for images
      const stream = await downloadContentFromMessage(
        downloadFilePath,
        "image"
      );
      let buffer = Buffer.from([]);
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }

      const sticker1 = new Sticker(buffer, {
        pack: packName,
        author: authorName,
        type:
          args.includes("crop") || args.includes("c")
            ? StickerTypes.CROPPED
            : StickerTypes.FULL,
        quality: 100,
      });
      await sticker1.toFile(saveSticker);
      await sock.sendMessage(from, {
        sticker: fs.readFileSync(saveSticker),
      });
    } else if (
      (isMedia && msg.message.videoMessage.seconds < 11) ||
      (isTaggedVideo &&
        msg.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage
          .seconds < 11)
    ) {
      //for videos
      let downloadFilePath;
      if (msg.message.videoMessage) {
        downloadFilePath = msg.message.videoMessage;
      } else {
        downloadFilePath =
          msg.message.extendedTextMessage.contextInfo.quotedMessage
            .videoMessage;
      }
      const stream = await downloadContentFromMessage(
        downloadFilePath,
        "video"
      );
      let buffer = Buffer.from([]);
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }

      const sticker1 = new Sticker(buffer, {
        pack: packName, // The pack name
        author: authorName, // The author name
        type:
          args.includes("crop") || args.includes("c")
            ? StickerTypes.CROPPED
            : StickerTypes.FULL,
        quality: 40,
      });
      await sticker1.toFile(saveSticker);
      await sock.sendMessage(from, {
        sticker: fs.readFileSync(saveSticker),
      });
    } else {
      console.log(msg);
      await sock.sendMessage(
        from,
        {
          text: "❌ Give a media to convert into sticker!",
        },
        { quoted: msg }
      );
      return;
    }
    try {
      fs.unlinkSync(saveSticker);
    } catch {
      console.log("error in deleting file.");
    }
  } catch (err) {
    console.log(err);
    await sock.sendMessage(
      from,
      {
        text: "❌ There is some problem!",
      },
      { quoted: msg }
    );
  }
};
