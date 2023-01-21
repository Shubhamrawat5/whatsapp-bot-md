const {
  downloadContentFromMessage,
  toBuffer,
} = require("@adiwajshing/baileys");
const { Exif } = require("wa-sticker-formatter");
const { LoggerTg } = require("./loggerBot");
const fs = require("fs");

const pvxstickeronly1 = "919557666582-1628610549@g.us";
const pvxstickeronly2 = "919557666582-1586018947@g.us";
let countSent = 1;
let countIn = 0,
  countOut = 0,
  countErr = 0;

const getRandom = (ext) => {
  return `${Math.floor(Math.random() * 10000)}${ext}`;
};

module.exports.forwardSticker = async (bot, msg) => {
  try {
    countIn += 1;
    let downloadFilePath = msg.message.stickerMessage;
    let stream = await downloadContentFromMessage(downloadFilePath, "sticker");

    let buffer = await toBuffer(stream);
    const fileName = getRandom(".webp");

    await fs.promises.writeFile(`./${fileName}`, buffer);
    const webpWithExif = await new Exif({
      pack: "BOT 🤖",
      author: "pvxcommunity.com",
    }).add(fs.readFileSync(`./${fileName}`));

    // let sticker = new Sticker(buffer, {
    //   pack: "BOT 🤖",
    //   author: "pvxcommunity.com",
    //   type: StickerTypes.DEFAULT,
    //   quality: 80,
    // });

    // let stickerMesssage = await sticker.toMessage();

    // 1000*60*60*24 = 86400ms = 1 day
    await bot.sendMessage(
      pvxstickeronly1,
      { sticker: webpWithExif },
      {
        mimetype: "sticker",
        ephemeralExpiration: 86400,
        mediaUploadTimeoutMs: 1000 * 20,
      }
    );
    await bot.sendMessage(
      pvxstickeronly2,
      { sticker: webpWithExif },
      {
        mimetype: "sticker",
        ephemeralExpiration: 86400,
        mediaUploadTimeoutMs: 1000 * 20,
      }
    );

    fs.unlinkSync(fileName);
    countOut += 1;
    console.log(
      `${countSent} sticker sent! In:${countIn}, Out:${countOut}, Err:${countErr}`
    );
    countSent += 1;
  } catch (err) {
    console.log(err);
    await LoggerTg(`ERROR: [FORWARD-STICKER]\n${err.toString()}`);
    countErr += 1;
  }
};
