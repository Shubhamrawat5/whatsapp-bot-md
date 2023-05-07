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

const getQuality = (isCrop, args1, args2) => {
  let quality;
  if (!isCrop && args1 && !isNaN(Number(args1))) {
    //1st arg check
    quality = Number(args1);
  }
  if (isCrop && args2 && !isNaN(Number(args2))) {
    //2nd arg check
    quality = Number(args2);
  }

  return quality;
};

const handler = async (bot, msg, msgInfoObj) => {
  let { type, isTaggedImage, isTaggedVideo, reply, args, from } = msgInfoObj;
  let packName = "BOT 🤖";
  let authorName = "pvxcommunity.com";
  let quality;

  const args1 = args[0];
  const args2 = args[1];
  const isCrop = args1 === "c" || args1 === "crop";

  let stickerMake;
  //for image
  if (type === "imageMessage" || isTaggedImage) {
    quality = 100;
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

    const resQuality = getQuality(isCrop, args1, args2);
    if (resQuality) quality = resQuality;
    console.log("Sticker Quality: ", quality);

    stickerMake = new Sticker(buffer, {
      pack: packName,
      author: authorName,
      type: isCrop ? StickerTypes.CROPPED : StickerTypes.FULL,
      quality: quality,
    });
  } else if (type === "videoMessage" || isTaggedVideo) {
    //for videos
    quality = 40;
    // if( msg.message.videoMessage.fileLength > ){
    //   quality = 20
    // }

    let downloadFilePath;
    if (msg.message.videoMessage) {
      //video message
      downloadFilePath = msg.message.videoMessage;
    } else {
      //tagged video message
      downloadFilePath =
        msg.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage;
    }

    const limit = 2;
    if (downloadFilePath.fileLength > limit * 1000 * 1000) {
      await reply(`❌ File size is too large!\nVideo limit: ${limit}mb`);
      return;
    }

    const stream = await downloadContentFromMessage(downloadFilePath, "video");
    const buffer = await toBuffer(stream);

    const resQuality = getQuality(isCrop, args1, args2);
    if (resQuality) quality = resQuality;
    console.log("Sticker Quality: ", quality);

    stickerMake = new Sticker(buffer, {
      pack: packName, // The pack name
      author: authorName, // The author name
      type: isCrop ? StickerTypes.CROPPED : StickerTypes.FULL,
      quality: quality,
    });
  } else {
    await reply("❌ Give a media to convert into sticker!");
    return;
  }

  const stickerFileName = getRandom(".webp");
  await stickerMake.toFile(stickerFileName);
  await bot.sendMessage(
    from,
    {
      sticker: fs.readFileSync(stickerFileName),
    },
    { quoted: msg, mediaUploadTimeoutMs: 1000 * 30 }
  );
  try {
    fs.unlinkSync(stickerFileName);
  } catch (error) {
    console.log("Problem with deleting media");
    // reply(error.toString());
  }
};
