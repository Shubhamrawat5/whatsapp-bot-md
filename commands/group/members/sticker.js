const {
  downloadContentFromMessage,
  toBuffer,
} = require("@adiwajshing/baileys");
const fs = require("fs");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

module.exports.command = () => {
  let cmd = ["sticker", "s"];

  return { cmd, handler };
};

const getRandom = (ext) => {
  return `${Math.floor(Math.random() * 10000)}${ext}`;
};

const handler = async (bot, msg, from, msgInfoObj) => {
  let { type, isTaggedImage, isTaggedVideo, reply, args } = msgInfoObj;
  let packName = "BOT 🤖";
  let authorName = "pvxcommunity.com";
  const stickerFileName = getRandom(".webp");
  let stickerMake;
  //for image
  if (type === "imageMessage" || isTaggedImage) {
    let downloadFilePath;
    if (msg.message.imageMessage) {
      downloadFilePath = msg.message.imageMessage;
    } else {
      //tagged image
      downloadFilePath =
        msg.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage;
    }
    //for images
    const stream = await downloadContentFromMessage(downloadFilePath, "image");
    const buffer = await toBuffer(stream);

    stickerMake = new Sticker(buffer, {
      pack: packName,
      author: authorName,
      type:
        args.includes("crop") || args.includes("c")
          ? StickerTypes.CROPPED
          : StickerTypes.FULL,
      quality: 100,
    });
  } else if (type === "videoMessage" || isTaggedVideo) {
    //for videos
    let downloadFilePath;
    if (msg.message.videoMessage) {
      downloadFilePath = msg.message.videoMessage;
    } else {
      downloadFilePath =
        msg.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage;
    }
    const stream = await downloadContentFromMessage(downloadFilePath, "video");
    const buffer = await toBuffer(stream);

    stickerMake = new Sticker(buffer, {
      pack: packName, // The pack name
      author: authorName, // The author name
      type:
        args.includes("crop") || args.includes("c")
          ? StickerTypes.CROPPED
          : StickerTypes.FULL,
      quality: 40,
    });
  } else {
    await reply("❌ Give a media to convert into sticker!");
    return;
  }

  await stickerMake.toFile(stickerFileName);
  await bot.sendMessage(
    from,
    {
      sticker: fs.readFileSync(stickerFileName),
    },
    { quoted: msg }
  );
  try {
    fs.unlinkSync(stickerFileName);
  } catch {
    console.log("error in deleting file.");
  }
};
