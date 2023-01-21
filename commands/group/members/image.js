const fs = require("fs");
const {
  downloadContentFromMessage,
  toBuffer,
} = require("@adiwajshing/baileys");
const { writeFile } = require("fs/promises");

module.exports.command = () => {
  let cmd = ["image", "toimg"];

  return { cmd, handler };
};

const getRandom = (ext) => {
  return `${Math.floor(Math.random() * 10000)}${ext}`;
};

const handler = async (bot, msg, from, msgInfoObj) => {
  let { isMedia, isTaggedSticker, reply } = msgInfoObj;

  if ((isMedia && !msg.message.stickerMessage.isAnimated) || isTaggedSticker) {
    let downloadFilePath;
    if (msg.message.stickerMessage) {
      downloadFilePath = msg.message.stickerMessage;
    } else {
      downloadFilePath =
        msg.message.extendedTextMessage.contextInfo.quotedMessage
          .stickerMessage;
    }
    const stream = await downloadContentFromMessage(downloadFilePath, "image");
    const buffer = await toBuffer(stream);

    const media = getRandom(".jpeg");
    await writeFile(media, buffer);

    await bot.sendMessage(
      from,
      {
        image: fs.readFileSync(media),
      },
      {
        mimetype: "image/png",
        quoted: msg,
      }
    );

    fs.unlinkSync(media);
  } else {
    await reply(
      "❌ There is some problem!\nTag a non-animated sticker with command to convert to Image!"
    );
  }
};
