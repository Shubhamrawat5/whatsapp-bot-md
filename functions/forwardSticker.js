const { downloadContentFromMessage } = require("@adiwajshing/baileys");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const { LoggerTg } = require("./loggerBot");

const pvxstickeronly1 = "919557666582-1628610549@g.us";
const pvxstickeronly2 = "919557666582-1586018947@g.us";
let countSent = 1;
let countIn = 0,
  countOut = 0,
  countErr = 0;

module.exports.forwardSticker = async (bot, msg) => {
  try {
    countIn += 1;
    let downloadFilePath = msg.message.stickerMessage;
    let stream = await downloadContentFromMessage(downloadFilePath, "sticker");
    if (!stream) return;

    // let buffer = Buffer.from([]);
    // for await (const chunk of stream) {
    //   buffer = Buffer.concat([buffer, chunk]);
    // }

    // let sticker = new Sticker(buffer, {
    //   pack: "BOT 🤖",
    //   author: "pvxcommunity.com",
    //   type: StickerTypes.DEFAULT,
    //   quality: 80,
    // });

    // let stickerMesssage = await sticker.toMessage();

    //1000*60*60*24 = 86400ms = 1 day
    // await bot.sendMessage(pvxstickeronly1, stickerMesssage, {
    //   ephemeralExpiration: 86400,
    //   mediaUploadTimeoutMs: 1000 * 20,
    // });
    // await bot.sendMessage(pvxstickeronly2, stickerMesssage, {
    //   ephemeralExpiration: 86400,
    //   mediaUploadTimeoutMs: 1000 * 20,
    // });

    countOut += 1;
    console.log(
      `${countSent} sticker sent! In:${countIn}, Out:${countOut}, Err:${countErr}`,
      stream.nothing
    );
    countSent += 1;
  } catch (err) {
    // await LoggerBot(false, "FORWARD-STICKER", err, undefined);
    await LoggerTg(`ERROR: [FORWARD-STICKER]\n${err.toString()}`);
    countErr += 1;
  }
};
